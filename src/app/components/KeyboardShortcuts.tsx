"use client"

import { useEffect, ReactNode } from "react";

interface KeyboardShortcutsProps {
    /** Called on Ctrl+Enter / Cmd+Enter */
    onProcess?: () => void;
    /** Called on Ctrl+Shift+C / Cmd+Shift+C */
    onCopyOutput?: () => void;
    /** Called on Escape */
    onClear?: () => void;
    /** Whether shortcuts are enabled */
    enabled?: boolean;
}

/**
 * Global keyboard shortcuts for all tools.
 * 
 * Core principle: "Faster than VS Code + extension"
 * 
 * Shortcuts:
 * - Ctrl+Enter / Cmd+Enter → Process (format, generate, etc.)
 * - Ctrl+Shift+C / Cmd+Shift+C → Copy output
 * - Escape → Clear
 */
export default function KeyboardShortcuts({
    onProcess,
    onCopyOutput,
    onClear,
    enabled = true,
}: KeyboardShortcutsProps) {
    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const isMod = e.ctrlKey || e.metaKey;

            // Ctrl+Enter / Cmd+Enter → Process
            if (isMod && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onProcess?.();
                return;
            }

            // Ctrl+Shift+C / Cmd+Shift+C → Copy output
            if (isMod && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
                // Don't intercept if user is selecting text in an input/editor
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }
                e.preventDefault();
                onCopyOutput?.();
                return;
            }

            // Escape → Clear (only if not in an input)
            if (e.key === 'Escape') {
                const target = e.target as HTMLElement;
                if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
                    onClear?.();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onProcess, onCopyOutput, onClear, enabled]);

    return null; // This is a behavior-only component, no UI
}

/**
 * Display keyboard shortcut hints.
 * Shows in tooltips and help modals.
 */
export function ShortcutHint({ keys }: { keys: string[] }) {
    return (
        <span className="inline-flex items-center gap-0.5">
            {keys.map((key, i) => (
                <span key={i}>
                    {i > 0 && <span className="text-muted-foreground/40 mx-0.5">+</span>}
                    <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-mono bg-muted border border-border rounded text-muted-foreground min-w-[20px]">
                        {key}
                    </kbd>
                </span>
            ))}
        </span>
    );
}
