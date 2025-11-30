"use client"

import { createContext, useContext, useState, ReactNode } from 'react';
import { defaultConfig, JSONFormatterConfig } from '@/app/types/json-formatter-config';

interface ConfigContextType {
    config: any;
    setConfig: (config: any) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<any>(defaultConfig);

    return (
        <ConfigContext.Provider value={{ config, setConfig }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}
