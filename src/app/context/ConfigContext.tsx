"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { defaultConfig as defaultFormatterConfig } from '@/app/types/json-formatter-config';
import { defaultViewerConfig } from '@/app/types/json-viewer-config';
import { defaultJSON5Config } from '@/app/types/json5-converter-config';
import {
    defaultTypeScriptConfig,
    defaultJavaConfig,
    defaultKotlinConfig,
    defaultDartConfig,
    defaultSwiftConfig,
    defaultGoConfig,
    defaultCSharpConfig,
    defaultPythonConfig,
    defaultRustConfig,
    defaultPHPConfig,
} from '@/app/types/code-generator-config';

interface ConfigContextType {
    config: any;
    setConfig: (config: any) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [config, setConfig] = useState<any>(defaultFormatterConfig);

    // Update config when pathname changes
    useEffect(() => {
        if (pathname === '/tools/json-viewer') {
            setConfig(defaultViewerConfig);
        } else if (pathname === '/tools/json-json5') {
            setConfig(defaultJSON5Config);
        } else if (pathname === '/tools/json-to-typescript') {
            setConfig(defaultTypeScriptConfig);
        } else if (pathname === '/tools/json-to-java') {
            setConfig(defaultJavaConfig);
        } else if (pathname === '/tools/json-to-kotlin') {
            setConfig(defaultKotlinConfig);
        } else if (pathname === '/tools/json-to-dart') {
            setConfig(defaultDartConfig);
        } else if (pathname === '/tools/json-to-swift') {
            setConfig(defaultSwiftConfig);
        } else if (pathname === '/tools/json-to-go') {
            setConfig(defaultGoConfig);
        } else if (pathname === '/tools/json-to-csharp') {
            setConfig(defaultCSharpConfig);
        } else if (pathname === '/tools/json-to-python') {
            setConfig(defaultPythonConfig);
        } else if (pathname === '/tools/json-to-rust') {
            setConfig(defaultRustConfig);
        } else if (pathname === '/tools/json-to-php') {
            setConfig(defaultPHPConfig);
        } else {
            setConfig(defaultFormatterConfig);
        }
    }, [pathname]);

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
