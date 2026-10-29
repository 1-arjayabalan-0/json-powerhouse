"use client"

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getToolByPath, ToolId } from '@/app/config/tool-registry';
import { getToolDefaults } from '@/app/config/tool-defaults';
import { clearToolConfig, getBrowserStorage, readToolConfig, writeToolConfig } from '@/app/lib/tool-config-storage';

interface ConfigContextType {
    toolId: ToolId | null;
    // Each tool narrows this to its own config type at the call site.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setConfig: (next: any | ((prev: any) => any)) => void;
    reset: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const toolId = (getToolByPath(pathname)?.id ?? null) as ToolId | null;

    // Server render and first client render use defaults; stored values load after mount.
    const [state, setState] = useState<{ toolId: ToolId | null; config: object }>(() => ({
        toolId,
        config: getToolDefaults(toolId),
    }));

    useEffect(() => {
        setState({ toolId, config: toolId ? readToolConfig(getBrowserStorage(), toolId, getToolDefaults(toolId)) : getToolDefaults(toolId) });
    }, [toolId]);

    // While switching tools, never expose the previous tool's config.
    const config = state.toolId === toolId ? state.config : getToolDefaults(toolId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setConfig = useCallback((next: any) => {
        setState(prev => {
            const base = prev.toolId === toolId ? prev.config : getToolDefaults(toolId);
            const value = typeof next === 'function' ? next(base) : next;
            if (toolId) writeToolConfig(getBrowserStorage(), toolId, value);
            return { toolId, config: value };
        });
    }, [toolId]);

    const reset = useCallback(() => {
        if (toolId) clearToolConfig(getBrowserStorage(), toolId);
        setState({ toolId, config: getToolDefaults(toolId) });
    }, [toolId]);

    return (
        <ConfigContext.Provider value={{ toolId, config, setConfig, reset }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}
