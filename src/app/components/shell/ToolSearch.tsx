"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getVisibleTools, toolGroups } from "@/app/config/tool-registry";

export default function ToolSearch() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const all = getVisibleTools();
        if (!q) return all;
        return all.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.tagline.toLowerCase().includes(q) ||
            t.keywords.some(k => k.includes(q)));
    }, [query]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActive(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const go = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-8 w-full max-w-[320px] items-center gap-2 rounded-md border border-border bg-muted/60 px-3 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                aria-label="Search tools"
            >
                <Search className="size-3.5" />
                <span className="hidden sm:inline">Search tools…</span>
                <kbd className="ml-auto hidden sm:inline rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
            </button>

            {open && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
                    <div
                        role="dialog"
                        aria-label="Search tools"
                        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 border-b border-border px-3">
                            <Search className="size-4 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setOpen(false);
                                    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
                                    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
                                    if (e.key === 'Enter' && results[active]) go(results[active].path);
                                }}
                                placeholder="Search tools…"
                                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <ul className="max-h-[50vh] overflow-y-auto p-1 scroll-thin">
                            {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No tools found</li>}
                            {results.map((t, i) => {
                                const Icon = t.icon;
                                return (
                                    <li key={t.id}>
                                        <button
                                            type="button"
                                            onMouseEnter={() => setActive(i)}
                                            onClick={() => go(t.path)}
                                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left ${i === active ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span className="flex min-w-0 flex-col">
                                                <span className="text-sm text-foreground">{t.name}</span>
                                                <span className="truncate text-xs">{t.tagline}</span>
                                            </span>
                                            <span className="ml-auto text-[10px] uppercase tracking-wide">
                                                {toolGroups.find(g => g.id === t.group)?.name}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
