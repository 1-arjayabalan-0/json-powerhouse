"use client"

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Menu, Moon, Sun, BookOpen } from "lucide-react";
import ToolSearch from "./ToolSearch";
import { useShell } from "./ShellContext";

const VSCODE_URL = "https://marketplace.visualstudio.com/items?itemName=arjayabalan.json-powerhouse-vscode";

const subscribeNoop = () => () => {};

export default function AppHeader({ showMenuButton = false }: { showMenuButton?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const { setDrawerOpen } = useShell();
    // false on the server / during hydration, true afterwards.
    const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);

    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-4">
            {showMenuButton && (
                <button type="button" onClick={() => setDrawerOpen(true)} className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Open tool menu">
                    <Menu className="size-5" />
                </button>
            )}
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="JSON PowerHouse home">
                <Image src="/JSON-PowerHouse-Logo.png" alt="" width={128} height={128} className="size-9 rounded-md" preload />
            </Link>
            <div className="flex flex-1 justify-center px-2">
                <ToolSearch />
            </div>
            <nav className="flex items-center gap-1">
                <Link href="/blog" className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                    <BookOpen className="size-4" /> Blog
                </Link>
                <a href={VSCODE_URL} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                    VS Code
                </a>
                <button
                    type="button"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="Toggle theme"
                >
                    {mounted && resolvedTheme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </button>
            </nav>
        </header>
    );
}
