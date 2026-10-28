"use client"

import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";

const ShellContext = createContext<{ drawerOpen: boolean; setDrawerOpen: (v: boolean) => void } | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // Remember which path the drawer was opened on; it counts as closed once the path changes
    // (link navigation, browser back/forward) without needing an effect.
    const [openedAt, setOpenedAt] = useState<string | null>(null);
    const drawerOpen = openedAt !== null && openedAt === pathname;
    const setDrawerOpen = useCallback((v: boolean) => setOpenedAt(v ? pathname : null), [pathname]);
    const value = useMemo(() => ({ drawerOpen, setDrawerOpen }), [drawerOpen, setDrawerOpen]);
    return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
    const ctx = useContext(ShellContext);
    // Pages outside the tools shell (home, blog) have no drawer.
    return ctx ?? { drawerOpen: false, setDrawerOpen: () => {} };
}
