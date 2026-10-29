"use client"

import { useEffect, useRef } from "react";
import { RotateCcw, X } from "lucide-react";
import { useConfig } from "@/app/context/ConfigContext";
import { settingsByTool } from "@/app/components/settings";
import { trapTab } from "./focusTrap";
import { useDesktop } from "./useDesktop";

export default function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { toolId, config, setConfig, reset } = useConfig();
    const desktop = useDesktop();
    const sheetRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const sheetOpen = open && !desktop;

    // Mobile sheet: move focus in on open, restore to the opener on close.
    useEffect(() => {
        if (!sheetOpen) return;
        const opener = document.activeElement as HTMLElement | null;
        closeRef.current?.focus();
        return () => { opener?.focus?.(); };
    }, [sheetOpen]);

    const Settings = toolId ? settingsByTool[toolId] : undefined;
    if (!Settings || !open) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = (key: any, value: any) => setConfig((prev: any) => ({ ...prev, [key]: value }));

    const body = (
        <>
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Settings</span>
                <button ref={desktop ? undefined : closeRef} type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Close settings">
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 scroll-thin">
                <Settings config={config} update={update} />
            </div>
            <div className="flex h-11 shrink-0 items-center justify-between border-t border-border px-4">
                <span className="text-[11px] text-muted-foreground">Saved for this tool</span>
                <button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                    <RotateCcw className="size-3.5" /> Reset to defaults
                </button>
            </div>
        </>
    );

    // Render only one variant so field ids stay unique.
    if (desktop) {
        return (
            <aside className="flex w-72 shrink-0 flex-col border-l border-border bg-card" aria-label="Tool settings">
                {body}
            </aside>
        );
    }

    return (
        <div
            ref={sheetRef}
            className="fixed inset-0 z-[55]"
            role="dialog"
            aria-modal="true"
            aria-label="Tool settings"
            onKeyDown={(e) => {
                if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
                trapTab(e, sheetRef.current);
            }}
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[75dvh] flex-col rounded-t-xl border-t border-border bg-card shadow-2xl">
                {body}
            </div>
        </div>
    );
}
