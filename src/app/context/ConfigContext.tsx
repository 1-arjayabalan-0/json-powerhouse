"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { defaultConfig as defaultFormatterConfig } from '@/core/types/json-formatter-config';
import { defaultViewerConfig } from '@/core/types/json-viewer-config';
import { defaultJSON5Config } from '@/core/types/json5-converter-config';
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
} from '@/core/types/code-generator-config';
import { defaultDiffConfig } from '@/core/types/diff-config';

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
        if (pathname === '/tools/json/viewer') {
            setConfig(defaultViewerConfig);
        } else if (pathname === '/tools/json/json5') {
            setConfig(defaultJSON5Config);
        } else if (pathname === '/tools/code/json-to-typescript') {
            setConfig(defaultTypeScriptConfig);
        } else if (pathname === '/tools/code/json-to-java') {
            setConfig(defaultJavaConfig);
        } else if (pathname === '/tools/code/json-to-kotlin') {
            setConfig(defaultKotlinConfig);
        } else if (pathname === '/tools/code/json-to-dart') {
            setConfig(defaultDartConfig);
        } else if (pathname === '/tools/code/json-to-swift') {
            setConfig(defaultSwiftConfig);
        } else if (pathname === '/tools/code/json-to-go') {
            setConfig(defaultGoConfig);
        } else if (pathname === '/tools/code/json-to-csharp') {
            setConfig(defaultCSharpConfig);
        } else if (pathname === '/tools/code/json-to-python') {
            setConfig(defaultPythonConfig);
        } else if (pathname === '/tools/code/json-to-rust') {
            setConfig(defaultRustConfig);
        } else if (pathname === '/tools/code/json-to-php') {
            setConfig(defaultPHPConfig);
        } else if (pathname === '/tools/json/diff') {
            setConfig({ ...defaultDiffConfig, diffStrategy: 'json-patch-6902' }); // Adding strategy here
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
