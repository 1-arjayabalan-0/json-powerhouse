/**
 * Code and schema generators: one registry drives the commands, the "All Generators…" picker,
 * reading settings, the quick-options picker and in-place regeneration of the output editor.
 */
import * as vscode from 'vscode';
import JSON5 from 'json5';

import { generateCSharpCode } from '@/core/generators/json-to-csharp';
import { generateDartCode } from '@/core/generators/json-to-dart';
import { generateGoCode } from '@/core/generators/json-to-go';
import { generateJavaCode } from '@/core/generators/json-to-java';
import { generateKotlinCode } from '@/core/generators/json-to-kotlin';
import { generatePHPCode } from '@/core/generators/json-to-php';
import { generatePythonCode } from '@/core/generators/json-to-python';
import { generateRustCode } from '@/core/generators/json-to-rust';
import { generateSwiftCode } from '@/core/generators/json-to-swift';
import { generateTypeScriptCode } from '@/core/generators/json-to-typescript';
import { generateSqlSchema } from '@/core/lib/schema/sql';
import { generatePrismaSchema } from '@/core/lib/schema/prisma';
import { generateJsonSchema } from '@/core/lib/schema/json-schema';
import { getGeneratorSettings, resolveGeneratorConfig, type OptionSpec } from '@/core/config/generator-settings';
import { errorKind, track } from './telemetry';

/** Where a generation was started from, for usage telemetry. */
type RunSource = 'command' | 'picker' | 'options';

const PREFIX = 'json-powerhouse';
const RECENT_KEY = `${PREFIX}.recentGenerators`;
const MAX_RECENT = 3;
const OUTPUT_CONTEXT_KEY = 'jsonPowerhouse.isGeneratedOutput';

type GenerateFn = (json: string, config: any) => string | Promise<string>;

export interface GeneratorEntry {
    command: string;
    label: string;
    detail: string;
    icon: string;
    group: 'Code' | 'Database & Schema';
    /** Settings section in src/core/config/generator-settings.ts. */
    section: string;
    language: string;
    generate: GenerateFn;
}

/** Every generator, in picker order. */
export const GENERATORS: GeneratorEntry[] = [
    { command: 'generateTypeScript', label: 'TypeScript', detail: 'Interfaces', icon: 'symbol-interface', group: 'Code', section: 'typescript', language: 'typescript', generate: generateTypeScriptCode },
    { command: 'generateCSharp', label: 'C#', detail: 'Classes', icon: 'symbol-class', group: 'Code', section: 'csharp', language: 'csharp', generate: generateCSharpCode },
    { command: 'generateJava', label: 'Java', detail: 'Classes', icon: 'symbol-class', group: 'Code', section: 'java', language: 'java', generate: generateJavaCode },
    { command: 'generatePython', label: 'Python', detail: 'Classes', icon: 'symbol-class', group: 'Code', section: 'python', language: 'python', generate: generatePythonCode },
    { command: 'generateGo', label: 'Go', detail: 'Structs', icon: 'symbol-structure', group: 'Code', section: 'go', language: 'go', generate: generateGoCode },
    { command: 'generateKotlin', label: 'Kotlin', detail: 'Data classes', icon: 'symbol-class', group: 'Code', section: 'kotlin', language: 'kotlin', generate: generateKotlinCode },
    { command: 'generateSwift', label: 'Swift', detail: 'Structs', icon: 'symbol-structure', group: 'Code', section: 'swift', language: 'swift', generate: generateSwiftCode },
    { command: 'generateDart', label: 'Dart', detail: 'Classes', icon: 'symbol-class', group: 'Code', section: 'dart', language: 'dart', generate: generateDartCode },
    { command: 'generateRust', label: 'Rust', detail: 'Structs', icon: 'symbol-structure', group: 'Code', section: 'rust', language: 'rust', generate: generateRustCode },
    { command: 'generatePhp', label: 'PHP', detail: 'Classes', icon: 'symbol-class', group: 'Code', section: 'php', language: 'php', generate: generatePHPCode },
    { command: 'generatePostgreSql', label: 'PostgreSQL', detail: 'CREATE TABLE + optional INSERTs', icon: 'database', group: 'Database & Schema', section: 'sql', language: 'sql', generate: (j, c) => generateSqlSchema(j, { ...c, dialect: 'postgresql' }) },
    { command: 'generateMySql', label: 'MySQL', detail: 'CREATE TABLE + optional INSERTs', icon: 'database', group: 'Database & Schema', section: 'sql', language: 'sql', generate: (j, c) => generateSqlSchema(j, { ...c, dialect: 'mysql' }) },
    { command: 'generateSqlite', label: 'SQLite', detail: 'CREATE TABLE + optional INSERTs', icon: 'database', group: 'Database & Schema', section: 'sql', language: 'sql', generate: (j, c) => generateSqlSchema(j, { ...c, dialect: 'sqlite' }) },
    { command: 'generatePrisma', label: 'Prisma', detail: 'Models with relations', icon: 'database', group: 'Database & Schema', section: 'prisma', language: 'prisma', generate: generatePrismaSchema },
    { command: 'generateJsonSchema', label: 'JSON Schema', detail: 'Draft 2020-12 / draft-07', icon: 'json', group: 'Database & Schema', section: 'jsonSchema', language: 'json', generate: generateJsonSchema },
];

const fullCommand = (g: GeneratorEntry) => `${PREFIX}.${g.command}`;
const findByCommand = (cmd: string) => GENERATORS.find(g => fullCommand(g) === cmd || g.command === cmd);

/** The last output each generator opened, so option changes can regenerate it in place. */
interface GeneratedOutput {
    entry: GeneratorEntry;
    input: string;
    document: vscode.TextDocument;
}
const outputs = new Map<string, GeneratedOutput>(); // keyed by output document URI

let ctx: vscode.ExtensionContext;
let log: (message: string, level?: 'INFO' | 'ERROR') => void = () => undefined;

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function readConfig(section: string): Record<string, unknown> {
    const cfg = vscode.workspace.getConfiguration(`${PREFIX}.${section}`);
    const config = resolveGeneratorConfig<Record<string, unknown>>(section, key => cfg.get(key));
    // Blank names fall back to the defaults instead of producing empty identifiers.
    const defaults = getGeneratorSettings(section).defaults;
    for (const opt of getGeneratorSettings(section).options) {
        if (opt.type === 'string' && opt.key !== 'title' && config[opt.key] === '') config[opt.key] = defaults[opt.key];
    }
    return config;
}

/** Saves where the user already customised it (workspace or global); otherwise globally. */
async function writeSetting(section: string, key: string, value: unknown) {
    const cfg = vscode.workspace.getConfiguration(`${PREFIX}.${section}`);
    const info = cfg.inspect(key);
    const target = info?.workspaceFolderValue !== undefined
        ? vscode.ConfigurationTarget.WorkspaceFolder
        : info?.workspaceValue !== undefined
            ? vscode.ConfigurationTarget.Workspace
            : vscode.ConfigurationTarget.Global;
    await cfg.update(key, value, target);
}

function formatValue(opt: OptionSpec, value: unknown): string {
    if (opt.type === 'boolean') return value ? 'On' : 'Off';
    if (opt.type === 'enum') return opt.choices?.find(c => c.value === value)?.label ?? String(value);
    return value === '' ? '(empty)' : String(value);
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/** Accepts strict JSON, or JSONC/JSON5 (comments, trailing commas), normalized to strict JSON. */
function toStrictJson(text: string): string {
    try {
        JSON.parse(text);
        return text;
    } catch {
        return JSON.stringify(JSON5.parse(text));
    }
}

async function resolveLanguage(preferred: string): Promise<string> {
    const languages = await vscode.languages.getLanguages();
    return languages.includes(preferred) ? preferred : 'plaintext';
}

async function render(entry: GeneratorEntry, input: string): Promise<string> {
    return entry.generate(toStrictJson(input), readConfig(entry.section));
}

function readInput(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Open a JSON file to generate from.');
        return undefined;
    }
    // Running from a generated output re-uses the JSON it was generated from.
    const previous = outputs.get(editor.document.uri.toString());
    if (previous) return previous.input;

    const text = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
    if (!text.trim()) {
        vscode.window.showErrorMessage('Select some JSON text or open a JSON file.');
        return undefined;
    }
    return text;
}

async function rememberRecent(entry: GeneratorEntry) {
    const recent = ctx.globalState.get<string[]>(RECENT_KEY, []);
    const updated = [entry.command, ...recent.filter(c => c !== entry.command)].slice(0, MAX_RECENT);
    await ctx.globalState.update(RECENT_KEY, updated);
}

export async function runGenerator(entry: GeneratorEntry, input = readInput(), via: RunSource = 'command') {
    if (input === undefined) return;
    track('command_used', { command: entry.command, via });
    log(`Generating ${entry.label}`);
    try {
        const content = await render(entry, input);
        const document = await vscode.workspace.openTextDocument({ content, language: await resolveLanguage(entry.language) });
        outputs.set(document.uri.toString(), { entry, input, document });
        await vscode.window.showTextDocument(document, { preview: false, viewColumn: vscode.ViewColumn.Beside });
        updateOutputContext();
        await rememberRecent(entry);
    } catch (error: any) {
        log(`Error generating ${entry.label}: ${error.message}`, 'ERROR');
        track('generation_failed', { command: entry.command, error_kind: errorKind(error) });
        vscode.window.showErrorMessage(`JSON → ${entry.label}: ${error.message}`);
    }
}

/** Re-renders every open output of generators that share `section` with the latest settings. */
async function regenerateOutputs(section: string) {
    for (const [uri, out] of outputs) {
        if (out.document.isClosed) {
            outputs.delete(uri);
            continue;
        }
        if (out.entry.section !== section) continue;
        try {
            const content = await render(out.entry, out.input);
            const edit = new vscode.WorkspaceEdit();
            const doc = out.document;
            edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length)), content);
            await vscode.workspace.applyEdit(edit);
        } catch (error: any) {
            log(`Error regenerating ${out.entry.label}: ${error.message}`, 'ERROR');
        }
    }
}

function updateOutputContext() {
    const doc = vscode.window.activeTextEditor?.document;
    const isOutput = !!doc && !doc.isClosed && outputs.has(doc.uri.toString());
    vscode.commands.executeCommand('setContext', OUTPUT_CONTEXT_KEY, isOutput);
}

// ---------------------------------------------------------------------------
// Quick options
// ---------------------------------------------------------------------------

type OptionItem = vscode.QuickPickItem & { action?: 'option' | 'generate' | 'settings'; option?: OptionSpec };

async function editOption(entry: GeneratorEntry, opt: OptionSpec, current: unknown): Promise<boolean> {
    let value: unknown;
    if (opt.type === 'boolean') {
        value = !current;
    } else if (opt.type === 'enum') {
        const pick = await vscode.window.showQuickPick(
            opt.choices!.map(c => ({ label: `${c.value === current ? '$(check)' : '$(blank)'} ${c.label}`, value: c.value })),
            { title: `${entry.label}: ${opt.label}`, placeHolder: opt.description },
        );
        if (!pick) return false;
        value = pick.value;
    } else {
        value = await vscode.window.showInputBox({ title: `${entry.label}: ${opt.label}`, prompt: opt.description, value: String(current ?? '') });
        if (value === undefined) return false;
    }
    if (value === current) return false;
    await writeSetting(entry.section, opt.key, value);
    // The option name only; values such as package or table names are never sent.
    track('quick_option_changed', { section: entry.section, option: opt.key });
    return true;
}

/**
 * The most useful options of one generator, editable in place. Changes are saved to the
 * settings and any open output of that generator is regenerated immediately.
 */
export async function showQuickOptions(entry: GeneratorEntry, input?: string) {
    track('quick_options_opened', { section: entry.section });
    const spec = getGeneratorSettings(entry.section);
    const quick = spec.options.filter(o => o.quick);
    const shared = GENERATORS.filter(g => g.section === entry.section).length > 1;

    for (;;) {
        const config = readConfig(entry.section);
        const items: OptionItem[] = quick.map(opt => ({
            label: opt.type === 'boolean' ? `${config[opt.key] ? '$(pass-filled)' : '$(circle-large-outline)'} ${opt.label}` : `$(edit) ${opt.label}`,
            description: formatValue(opt, config[opt.key]),
            detail: opt.description,
            action: 'option',
            option: opt,
        }));
        items.push(
            { label: '', kind: vscode.QuickPickItemKind.Separator },
            { label: `$(play) Generate ${entry.label}`, action: 'generate' },
            { label: '$(settings-gear) All options…', description: `${spec.options.length} settings`, action: 'settings' },
        );

        const pick = await vscode.window.showQuickPick(items, {
            title: `JSON → ${entry.label} options${shared ? ` (shared with ${spec.title})` : ''}`,
            placeHolder: 'Changes are saved to your settings and applied to the open output',
        });
        if (!pick) return;

        if (pick.action === 'settings') {
            track('all_options_opened', { section: entry.section });
            await vscode.commands.executeCommand('workbench.action.openSettings', `${PREFIX}.${entry.section}.`);
            return;
        }
        if (pick.action === 'generate') {
            // An output for this exact JSON is already open (and kept up to date): just show it.
            const existing = [...outputs.values()].find(o => o.entry === entry && o.input === input && !o.document.isClosed);
            if (existing) await vscode.window.showTextDocument(existing.document, { preview: false, viewColumn: vscode.ViewColumn.Beside });
            else await runGenerator(entry, input, 'options');
            return;
        }
        // Saving the setting triggers onDidChangeConfiguration, which regenerates open outputs.
        if (pick.option) await editOption(entry, pick.option, config[pick.option.key]);
    }
}

// ---------------------------------------------------------------------------
// "All Generators…" picker
// ---------------------------------------------------------------------------

type GeneratorPickItem = vscode.QuickPickItem & { entry?: GeneratorEntry };

const OPTIONS_BUTTON: vscode.QuickInputButton = { iconPath: new vscode.ThemeIcon('settings-gear'), tooltip: 'Options' };

export function showGeneratorPicker() {
    const recent = ctx.globalState.get<string[]>(RECENT_KEY, [])
        .map(findByCommand)
        .filter((g): g is GeneratorEntry => !!g);

    const toItem = (entry: GeneratorEntry): GeneratorPickItem => ({
        label: `$(${entry.icon}) JSON → ${entry.label}`,
        description: entry.detail,
        buttons: [OPTIONS_BUTTON],
        entry,
    });
    const separator = (label: string): GeneratorPickItem => ({ label, kind: vscode.QuickPickItemKind.Separator });

    const items: GeneratorPickItem[] = [];
    if (recent.length) items.push(separator('Recently used'), ...recent.map(toItem));
    for (const group of ['Code', 'Database & Schema'] as const) {
        items.push(separator(group), ...GENERATORS.filter(g => g.group === group && !recent.includes(g)).map(toItem));
    }

    // Capture the input now: once the picker closes the active editor may change.
    const input = readInput();
    if (input === undefined) return;

    track('generator_picker_opened');
    const picker = vscode.window.createQuickPick<GeneratorPickItem>();
    picker.title = 'JSON PowerHouse: Generate from JSON';
    picker.placeholder = 'Pick a target. Use ⚙ on a row to change its options first.';
    picker.matchOnDescription = true;
    picker.items = items;
    picker.onDidAccept(() => {
        const entry = picker.selectedItems[0]?.entry;
        picker.hide();
        if (entry) runGenerator(entry, input, 'picker');
    });
    picker.onDidTriggerItemButton(e => {
        picker.hide();
        if (e.item.entry) showQuickOptions(e.item.entry, input);
    });
    picker.onDidHide(() => picker.dispose());
    picker.show();
}

/** "Generator Options…": the active output's generator, or ask which one. */
async function showOptionsForActive() {
    const doc = vscode.window.activeTextEditor?.document;
    const out = doc ? outputs.get(doc.uri.toString()) : undefined;
    if (out) return showQuickOptions(out.entry, out.input);

    const pick = await vscode.window.showQuickPick(
        GENERATORS.map(entry => ({ label: `$(${entry.icon}) JSON → ${entry.label}`, description: entry.detail, entry })),
        { title: 'JSON PowerHouse: Generator Options', placeHolder: 'Which generator?' },
    );
    if (pick) await showQuickOptions(pick.entry);
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

export function registerGenerators(context: vscode.ExtensionContext, logger: typeof log) {
    ctx = context;
    log = logger;
    const sub = (d: vscode.Disposable) => context.subscriptions.push(d);

    for (const entry of GENERATORS) {
        sub(vscode.commands.registerCommand(fullCommand(entry), () => runGenerator(entry)));
    }
    sub(vscode.commands.registerCommand(`${PREFIX}.generate`, showGeneratorPicker));
    sub(vscode.commands.registerCommand(`${PREFIX}.generatorOptions`, showOptionsForActive));

    sub(vscode.window.onDidChangeActiveTextEditor(updateOutputContext));
    sub(vscode.workspace.onDidCloseTextDocument(doc => {
        outputs.delete(doc.uri.toString());
        updateOutputContext();
    }));
    // Edits made in the Settings editor also refresh open outputs.
    sub(vscode.workspace.onDidChangeConfiguration(e => {
        const sections = new Set(GENERATORS.map(g => g.section));
        for (const section of sections) {
            if (e.affectsConfiguration(`${PREFIX}.${section}`)) regenerateOutputs(section);
        }
    }));
}
