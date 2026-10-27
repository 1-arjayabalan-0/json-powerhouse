"use client"

import { createContext, useContext, useState, ReactNode } from "react";

const ShellContext = createContext<{ drawerOpen: boolean; setDrawerOpen: (v: boolean) => void } | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return <ShellContext.Provider value={{ drawerOpen, setDrawerOpen }}>{children}</ShellContext.Provider>;
}

export function useShell() {
    const ctx = useContext(ShellContext);
    // Pages outside the tools shell (home, blog) have no drawer.
    return ctx ?? { drawerOpen: false, setDrawerOpen: () => {} };
}
