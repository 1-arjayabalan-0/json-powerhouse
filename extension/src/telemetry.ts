/**
 * Anonymous usage telemetry, sent to PostHog.
 *
 * What is sent: which command ran, whether a generation failed (with a coarse error category),
 * which quick option was changed (its name, never its value), a once-a-day "active" ping, and
 * environment info (extension/editor version, editor name, extension store, OS). Events are keyed by VS Code's
 * anonymous machine id.
 *
 * What is never sent: JSON content, file names or paths, setting values, error messages.
 *
 * Nothing is sent when VS Code telemetry is off (enforced by vscode.env.createTelemetryLogger),
 * when `json-powerhouse.telemetry.enabled` is false, when no PostHog key is configured, or when
 * running in development or tests (F5 / extension test host).
 * See the "Telemetry" section of README.md.
 */
import * as vscode from 'vscode';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PostHog project API key (starts with "phc_"). This key can only write events, so it is
 * safe to ship in the extension. Leave empty to disable telemetry entirely.
 */
const POSTHOG_KEY = 'phc_vmbh7dT72sa5kmHgLKKmgKAriCLtuEp98y3QwNh2CK2v';
/** https://us.i.posthog.com for US Cloud projects, https://eu.i.posthog.com for EU Cloud. */
const POSTHOG_HOST = 'https://us.i.posthog.com';

const SETTING = 'json-powerhouse.telemetry.enabled';
const LAST_ACTIVE_KEY = 'json-powerhouse.telemetry.lastActiveDay';
const FLUSH_INTERVAL_MS = 30_000;
const MAX_QUEUE = 200;

interface QueuedEvent {
    event: string;
    distinct_id: string;
    timestamp: string;
    properties: Record<string, unknown>;
}

let logger: vscode.TelemetryLogger | undefined;
let queue: QueuedEvent[] = [];
let baseProperties: Record<string, unknown> = {};
let distinctId = '';

/**
 * Which extension store the editor installs from, read from its product.json:
 * 'vs-marketplace' (VS Code), 'open-vsx' (VSCodium, Windsurf, …), 'cursor' (Cursor's own
 * store, which mirrors Open VSX), 'other' (e.g. a private company gallery; its address is not
 * sent) or 'unknown'. Manually installed .vsix files cannot be told apart.
 */
function detectGallery(): string {
    try {
        const productPath = path.join(vscode.env.appRoot, 'product.json');
        const product = JSON.parse(fs.readFileSync(productPath, 'utf8'));
        const url: unknown = product?.extensionsGallery?.serviceUrl;
        if (typeof url !== 'string' || !url) return 'unknown';
        const host = new URL(url).hostname;
        if (host === 'marketplace.visualstudio.com') return 'vs-marketplace';
        if (host.includes('open-vsx')) return 'open-vsx';
        if (host.endsWith('cursorapi.com')) return 'cursor';
        return 'other';
    } catch {
        return 'unknown';
    }
}

function settingEnabled(): boolean {
    return vscode.workspace.getConfiguration().get<boolean>(SETTING, true);
}

function post(events: QueuedEvent[]): Promise<void> {
    return new Promise(resolve => {
        const body = JSON.stringify({ api_key: POSTHOG_KEY, batch: events });
        try {
            const req = https.request(`${POSTHOG_HOST}/batch/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
                timeout: 10_000,
            }, res => {
                res.resume();
                res.on('end', resolve);
            });
            // Telemetry must never disturb the user: errors are dropped silently.
            req.on('error', () => resolve());
            req.on('timeout', () => { req.destroy(); resolve(); });
            req.end(body);
        } catch {
            resolve();
        }
    });
}

async function flush(): Promise<void> {
    if (!queue.length) return;
    const events = queue;
    queue = [];
    await post(events);
}

const sender: vscode.TelemetrySender = {
    sendEventData(eventName, data) {
        if (!settingEnabled() || queue.length >= MAX_QUEUE) return;
        queue.push({
            // The logger prefixes names with the extension id ("publisher.name/event").
            event: eventName.slice(eventName.lastIndexOf('/') + 1),
            distinct_id: distinctId,
            timestamp: new Date().toISOString(),
            properties: { ...baseProperties, ...data, $process_person_profile: false },
        });
    },
    // Error events are sent through logUsage with a category instead; never send stack traces.
    sendErrorData() { /* intentionally empty */ },
    flush,
};

export function initTelemetry(context: vscode.ExtensionContext) {
    if (!POSTHOG_KEY) return;
    // Only count real installs: skip F5 debug sessions and extension tests.
    if (context.extensionMode !== vscode.ExtensionMode.Production) return;

    distinctId = vscode.env.machineId;
    baseProperties = {
        $lib: 'json-powerhouse-vscode',
        extension_version: context.extension.packageJSON.version,
        editor: vscode.env.appName,
        gallery: detectGallery(),
        editor_version: vscode.version,
        os: process.platform,
        ui_kind: vscode.env.uiKind === vscode.UIKind.Web ? 'web' : 'desktop',
        remote: vscode.env.remoteName ?? 'local',
        language: vscode.env.language,
    };

    logger = vscode.env.createTelemetryLogger(sender, { ignoreBuiltInCommonProperties: true });
    context.subscriptions.push(logger);

    const timer = setInterval(() => void flush(), FLUSH_INTERVAL_MS);
    context.subscriptions.push({ dispose: () => clearInterval(timer) });

    // One "active" event per machine per day gives daily/weekly/monthly active users.
    const today = new Date().toISOString().slice(0, 10);
    if (context.globalState.get<string>(LAST_ACTIVE_KEY) !== today) {
        void context.globalState.update(LAST_ACTIVE_KEY, today);
        track('extension_active');
    }
}

/** Records a usage event. Only pass names and categories, never user content. */
export function track(event: string, properties: Record<string, string | number | boolean> = {}) {
    logger?.logUsage(event, properties);
}

/** Maps an error to a coarse category, so no message text (which may echo JSON) is sent. */
export function errorKind(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof SyntaxError || /JSON5?:|Unexpected|invalid character/i.test(message)) return 'invalid_json';
    if (/object or an array|empty|only objects/i.test(message)) return 'unsupported_shape';
    return 'other';
}

/** Registers a command that also records a `command_used` event. */
export function registerTrackedCommand(command: string, callback: (...args: any[]) => unknown): vscode.Disposable {
    return vscode.commands.registerCommand(command, (...args: any[]) => {
        track('command_used', { command: command.replace(/^json-powerhouse\./, '') });
        return callback(...args);
    });
}

export function shutdownTelemetry(): Promise<void> {
    return flush();
}
