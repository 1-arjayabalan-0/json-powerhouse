"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { getVisibleTools, toolGroups, getToolByPath } from "@/app/config/tool-registry";
import { useShell } from "./ShellContext";

const COLLAPSE_KEY = "jph:sidebar-collapsed";

function readCollapsed(): boolean {
    try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch { return false; }
}

function ToolNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
    const pathname = usePathname();
    const activeId = getToolByPath(pathname)?.id;
    return (
        <nav aria-label="Tools" className="flex flex-col gap-4 py-3">
            {toolGroups.map(group => (
                <div key={group.id} className="flex flex-col gap-0.5 px-2">
                    {!collapsed && (
                        <h2 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group.name}</h2>
                    )}
                    {getVisibleTools(group.id).map(tool => {
                        const Icon = tool.icon;
                        const active = tool.id === activeId;
                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                onClick={onNavigate}
                                title={collapsed ? tool.name : undefined}
                                aria-current={active ? "page" : undefined}
                                className={`group flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors ${collapsed ? 'justify-center' : ''} ${
                                    active
                                        ? 'bg-primary/12 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" />
                                {!collapsed && <span className="truncate">{tool.shortName}</span>}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}

export default function ToolSidebar() {
    const { drawerOpen, setDrawerOpen } = useShell();
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => setCollapsed(readCollapsed()), []);
    useEffect(() => setDrawerOpen(false), [pathname, setDrawerOpen]);

    const toggle = () => {
        setCollapsed(c => {
            try { localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1"); } catch { /* ignore */ }
            return !c;
        });
    };

    return (
        <>
            {/* Desktop rail */}
            <aside
                className={`sticky top-12 hidden h-[calc(100dvh-48px)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex transition-[width] duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
            >
                <div className="flex-1 overflow-y-auto scroll-thin">
                    <ToolNav collapsed={collapsed} />
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="flex h-10 items-center gap-2 border-t border-sidebar-border px-4 text-xs text-muted-foreground hover:text-foreground"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <PanelLeftOpen className="size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}
                </button>
            </aside>

            {/* Mobile drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-label="Tools">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl">
                        <div className="flex h-12 items-center justify-between border-b border-sidebar-border px-4">
                            <span className="text-sm font-semibold">Tools</span>
                            <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close tool menu">
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto scroll-thin">
                            <ToolNav collapsed={false} onNavigate={() => setDrawerOpen(false)} />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
