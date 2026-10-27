"use client"

import { ReactNode, useCallback, useSyncExternalStore } from "react";
import { Settings2 } from "lucide-react";
import { getToolById, ToolId } from "@/app/config/tool-registry";
import { settingsByTool } from "@/app/components/settings";
import SettingsPanel from "./SettingsPanel";
import { isDesktopNow } from "./useDesktop";

const OPEN_KEY = "jph:settings-open";
const DESKTOP_QUERY = "(min-width: 1024px)";

// Desktop: persisted in localStorage (default open). Mobile: session-only, closed by default.
let mobileOpenFor: string | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(l => l());

function subscribe(cb: () => void) {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    const mq = window.matchMedia(DESKTOP_QUERY);
    mq.addEventListener("change", cb);
    return () => {
        listeners.delete(cb);
        window.removeEventListener("storage", cb);
        mq.removeEventListener("change", cb);
    };
}

function readStored(): string | null {
    try { return localStorage.getItem(OPEN_KEY); } catch { return null; }
}

function writeOpen(toolId: string, v: boolean) {
    if (isDesktopNow()) {
        try { localStorage.setItem(OPEN_KEY, v ? "1" : "0"); } catch { /* ignore */ }
    } else {
        mobileOpenFor = v ? toolId : null;
    }
    notify();
}

export default function ToolWorkspace({ toolId, children }: { toolId: ToolId; children: ReactNode }) {
    const tool = getToolById(toolId);
    const hasSettings = Boolean(settingsByTool[toolId]);
    const getSnapshot = useCallback(
        () => (isDesktopNow() ? readStored() !== "0" : mobileOpenFor === toolId),
        [toolId]
    );
    const open = useSyncExternalStore(subscribe, getSnapshot, () => false);

    if (!tool) return <>{children}</>;
    const Icon = tool.icon;

    return (
        <section className="flex h-auto min-h-[520px] flex-col border-b border-border md:h-[calc(100dvh-48px)]" aria-label={tool.name}>
            <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4">
                <Icon className="size-4 text-primary" />
                <h1 className="text-sm font-semibold text-foreground">{tool.name}</h1>
                <p className="hidden truncate text-xs text-muted-foreground md:block">{tool.tagline}</p>
                {hasSettings && (
                    <button
                        type="button"
                        onClick={() => writeOpen(toolId, !open)}
                        aria-pressed={open}
                        className={`ml-auto flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors ${open ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <Settings2 className="size-4" /> Settings
                    </button>
                )}
            </div>
            <div className="flex min-h-0 flex-1">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
                {hasSettings && <SettingsPanel open={open} onClose={() => writeOpen(toolId, false)} />}
            </div>
        </section>
    );
}
