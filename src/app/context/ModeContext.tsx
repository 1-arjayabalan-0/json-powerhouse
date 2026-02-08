"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type ToolMode = 'json' | 'code';

interface ModeContextType {
    mode: ToolMode;
    setMode: (mode: ToolMode) => void;
    toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
    const [mode, setModeState] = useState<ToolMode>('json');
    const pathname = usePathname();
    const router = useRouter();

    // Sync mode with URL
    useEffect(() => {
        if (pathname.includes('/tools/json')) {
            setModeState('json');
            sessionStorage.setItem('json-powerhouse-mode', 'json');
        } else if (pathname.includes('/tools/code')) {
            setModeState('code');
            sessionStorage.setItem('json-powerhouse-mode', 'code');
        }
    }, [pathname]);

    // Load initial mode from sessionStorage if not determined by URL (e.g. on root or other pages)
    // However, since we sync with URL, the URL usually takes precedence.
    // But if we land on a page that doesn't specify, we might want to know the last mode.
    useEffect(() => {
        const storedMode = sessionStorage.getItem('json-powerhouse-mode') as ToolMode;
        if (storedMode && (storedMode === 'json' || storedMode === 'code')) {
            // Only set if pathname doesn't override it
            if (!pathname.includes('/tools/json') && !pathname.includes('/tools/code')) {
                setModeState(storedMode);
            }
        }
    }, []);

    const setMode = (newMode: ToolMode) => {
        setModeState(newMode);
        sessionStorage.setItem('json-powerhouse-mode', newMode);
        
        // Navigate to default tool if switching modes
        if (newMode === 'json' && !pathname.includes('/tools/json')) {
            router.push('/tools/json/formatter');
        } else if (newMode === 'code' && !pathname.includes('/tools/code')) {
            router.push('/tools/code/json-to-typescript');
        }
    };

    const toggleMode = () => {
        const newMode = mode === 'json' ? 'code' : 'json';
        setMode(newMode);
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
}
