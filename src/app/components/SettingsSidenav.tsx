"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { JSONFormatterConfig, IndentationType, QuoteStyle, KeyCase, ArrayFormatting, KeySorting } from "@/app/types/json-formatter-config";
import { JsonTreeViewerConfig } from "@/app/types/json-viewer-config";
import { JSON5ConverterConfig } from "@/app/types/json5-converter-config";
import {
    TypeScriptConfig, JavaConfig, KotlinConfig, DartConfig, SwiftConfig,
    GoConfig, CSharpConfig, PythonConfig, RustConfig, PHPConfig,
    defaultTypeScriptConfig, defaultJavaConfig, defaultKotlinConfig, defaultDartConfig, defaultSwiftConfig,
    defaultGoConfig, defaultCSharpConfig, defaultPythonConfig, defaultRustConfig, defaultPHPConfig
} from "@/app/types/code-generator-config";
import { toast } from "sonner";

interface SettingsSidenavProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export default function SettingsSidenav({ config, onConfigChange }: SettingsSidenavProps) {
    const pathname = usePathname();
    const isTreeViewer = pathname === '/tools/json-viewer';
    const isJSON5Converter = pathname === '/tools/json-json5';

    // Code Generators
    const isTypeScript = pathname === '/tools/json-to-typescript';
    const isJava = pathname === '/tools/json-to-java';
    const isKotlin = pathname === '/tools/json-to-kotlin';
    const isDart = pathname === '/tools/json-to-dart';
    const isSwift = pathname === '/tools/json-to-swift';
    const isGo = pathname === '/tools/json-to-go';
    const isCSharp = pathname === '/tools/json-to-csharp';
    const isPython = pathname === '/tools/json-to-python';
    const isRust = pathname === '/tools/json-to-rust';
    const isPHP = pathname === '/tools/json-to-php';

    const [isCollapsed, setIsCollapsed] = useState(false);

    const updateConfig = (key: string, value: any) => {
        onConfigChange({ ...config, [key]: value });
    };

    const SettingsContainer = ({ title, children, onReset, defaultConf }: { title: string, children: React.ReactNode, onReset: () => void, defaultConf?: any }) => (
        <div className={`bg-background-dark border-l border-white/10 flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
            <div className="flex items-center justify-between border-b border-white/10 p-1">
                {!isCollapsed && <h2 className="text-white text-lg font-bold">{title}</h2>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="pr-2 flex rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors ml-auto"
                    title={isCollapsed ? "Expand settings" : "Collapse settings"}
                >
                    <span className={`material-symbols-outlined text-xl transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
                        chevron_right
                    </span>
                </button>
            </div>
            {!isCollapsed && (
                <div className="overflow-y-auto flex-1 p-4 space-y-6">
                    {children}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={onReset}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // ----------------------------------------------------------------------
    // TypeScript Settings
    // ----------------------------------------------------------------------
    if (isTypeScript) {
        const tsConfig = config as TypeScriptConfig;
        return (
            <SettingsContainer title="TypeScript Settings" onReset={() => onConfigChange(defaultTypeScriptConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Type Kind</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => updateConfig('typeKind', 'interface')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tsConfig.typeKind === 'interface' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'}`}>Interface</button>
                            <button onClick={() => updateConfig('typeKind', 'type')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tsConfig.typeKind === 'type' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'}`}>Type Alias</button>
                        </div>
                    </div>
                    <Toggle label="Runtime Typecheck" checked={tsConfig.runtimeTypecheck} onChange={(v) => updateConfig('runtimeTypecheck', v)} />
                    <Toggle label="Readonly Properties" checked={tsConfig.readonlyProperties} onChange={(v) => updateConfig('readonlyProperties', v)} />
                    <Toggle label="Explicit Any" checked={tsConfig.explicitAny} onChange={(v) => updateConfig('explicitAny', v)} />
                    <Toggle label="Nice Property Names" checked={tsConfig.nicePropertyNames} onChange={(v) => updateConfig('nicePropertyNames', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Java Settings
    // ----------------------------------------------------------------------
    if (isJava) {
        const javaConfig = config as JavaConfig;
        return (
            <SettingsContainer title="Java Settings" onReset={() => onConfigChange(defaultJavaConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Package Name</label>
                        <input type="text" value={javaConfig.packageName} onChange={(e) => updateConfig('packageName', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Array Type</label>
                        <select value={javaConfig.arrayType} onChange={(e) => updateConfig('arrayType', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="List">List</option>
                            <option value="Array">Array</option>
                        </select>
                    </div>
                    <Toggle label="Getters & Setters" checked={javaConfig.useGettersSetters} onChange={(v) => updateConfig('useGettersSetters', v)} />
                    <Toggle label="Use Optional" checked={javaConfig.useOptional} onChange={(v) => updateConfig('useOptional', v)} />
                    <Toggle label="Use BigDecimal" checked={javaConfig.useBigDecimal} onChange={(v) => updateConfig('useBigDecimal', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Kotlin Settings
    // ----------------------------------------------------------------------
    if (isKotlin) {
        const kotlinConfig = config as KotlinConfig;
        return (
            <SettingsContainer title="Kotlin Settings" onReset={() => onConfigChange(defaultKotlinConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Package Name</label>
                        <input type="text" value={kotlinConfig.packageName} onChange={(e) => updateConfig('packageName', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Framework</label>
                        <select value={kotlinConfig.framework} onChange={(e) => updateConfig('framework', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="just-types">Just Types</option>
                            <option value="jackson">Jackson</option>
                            <option value="kotlinx">Kotlinx</option>
                        </select>
                    </div>
                    <Toggle label="Use Data Classes" checked={kotlinConfig.useDataClasses} onChange={(v) => updateConfig('useDataClasses', v)} />
                    <Toggle label="Use Arrays" checked={kotlinConfig.useArrays} onChange={(v) => updateConfig('useArrays', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Dart Settings
    // ----------------------------------------------------------------------
    if (isDart) {
        const dartConfig = config as DartConfig;
        return (
            <SettingsContainer title="Dart Settings" onReset={() => onConfigChange(defaultDartConfig)}>
                <div className="space-y-4">
                    <Toggle label="Use Freezed" checked={dartConfig.useFreezed} onChange={(v) => updateConfig('useFreezed', v)} />
                    <Toggle label="Use JsonSerializable" checked={dartConfig.useJsonSerializable} onChange={(v) => updateConfig('useJsonSerializable', v)} />
                    <Toggle label="Null Safety" checked={dartConfig.nullSafety} onChange={(v) => updateConfig('nullSafety', v)} />
                    <Toggle label="Use num type" checked={dartConfig.useNum} onChange={(v) => updateConfig('useNum', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Swift Settings
    // ----------------------------------------------------------------------
    if (isSwift) {
        const swiftConfig = config as SwiftConfig;
        return (
            <SettingsContainer title="Swift Settings" onReset={() => onConfigChange(defaultSwiftConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Type Kind</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => updateConfig('typeKind', 'struct')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${swiftConfig.typeKind === 'struct' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'}`}>Struct</button>
                            <button onClick={() => updateConfig('typeKind', 'class')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${swiftConfig.typeKind === 'class' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60'}`}>Class</button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Access Level</label>
                        <select value={swiftConfig.accessLevel} onChange={(e) => updateConfig('accessLevel', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="internal">Internal</option>
                            <option value="public">Public</option>
                            <option value="open">Open</option>
                        </select>
                    </div>
                    <Toggle label="Use Codable" checked={swiftConfig.useCodable} onChange={(v) => updateConfig('useCodable', v)} />
                    <Toggle label="Mutable Classes" checked={swiftConfig.useClassesForMutable} onChange={(v) => updateConfig('useClassesForMutable', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Go Settings
    // ----------------------------------------------------------------------
    if (isGo) {
        const goConfig = config as GoConfig;
        return (
            <SettingsContainer title="Go Settings" onReset={() => onConfigChange(defaultGoConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Package Name</label>
                        <input type="text" value={goConfig.packageName} onChange={(e) => updateConfig('packageName', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Field Naming</label>
                        <select value={goConfig.fieldNaming} onChange={(e) => updateConfig('fieldNaming', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="json">JSON Tags</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                    <Toggle label="Omit Empty" checked={goConfig.useOmitEmpty} onChange={(v) => updateConfig('useOmitEmpty', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // C# Settings
    // ----------------------------------------------------------------------
    if (isCSharp) {
        const csharpConfig = config as CSharpConfig;
        return (
            <SettingsContainer title="C# Settings" onReset={() => onConfigChange(defaultCSharpConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Namespace</label>
                        <input type="text" value={csharpConfig.namespace} onChange={(e) => updateConfig('namespace', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Framework</label>
                        <select value={csharpConfig.framework} onChange={(e) => updateConfig('framework', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="Newtonsoft.Json">Newtonsoft.Json</option>
                            <option value="System.Text.Json">System.Text.Json</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Array Type</label>
                        <select value={csharpConfig.arrayType} onChange={(e) => updateConfig('arrayType', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="List">List</option>
                            <option value="Array">Array</option>
                        </select>
                    </div>
                    <Toggle label="Use Properties" checked={csharpConfig.useProperties} onChange={(v) => updateConfig('useProperties', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Python Settings
    // ----------------------------------------------------------------------
    if (isPython) {
        const pythonConfig = config as PythonConfig;
        return (
            <SettingsContainer title="Python Settings" onReset={() => onConfigChange(defaultPythonConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Python Version</label>
                        <select value={pythonConfig.pythonVersion} onChange={(e) => updateConfig('pythonVersion', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="3.7">3.7</option>
                            <option value="3.6">3.6</option>
                        </select>
                    </div>
                    <Toggle label="Type Hints" checked={pythonConfig.useTypeHints} onChange={(v) => updateConfig('useTypeHints', v)} />
                    <Toggle label="Nice Property Names" checked={pythonConfig.nicePropertyNames} onChange={(v) => updateConfig('nicePropertyNames', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Rust Settings
    // ----------------------------------------------------------------------
    if (isRust) {
        const rustConfig = config as RustConfig;
        return (
            <SettingsContainer title="Rust Settings" onReset={() => onConfigChange(defaultRustConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Visibility</label>
                        <select value={rustConfig.visibility} onChange={(e) => updateConfig('visibility', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="public">Public</option>
                            <option value="crate">Crate</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Density</label>
                        <select value={rustConfig.density} onChange={(e) => updateConfig('density', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500">
                            <option value="normal">Normal</option>
                            <option value="dense">Dense</option>
                        </select>
                    </div>
                    <Toggle label="Derive Debug" checked={rustConfig.deriveDebug} onChange={(v) => updateConfig('deriveDebug', v)} />
                    <Toggle label="Derive Clone" checked={rustConfig.deriveClone} onChange={(v) => updateConfig('deriveClone', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // PHP Settings
    // ----------------------------------------------------------------------
    if (isPHP) {
        const phpConfig = config as PHPConfig;
        return (
            <SettingsContainer title="PHP Settings" onReset={() => onConfigChange(defaultPHPConfig)}>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-white text-sm font-medium">Namespace</label>
                        <input type="text" value={phpConfig.namespace} onChange={(e) => updateConfig('namespace', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500" />
                    </div>
                    <Toggle label="Strict Types" checked={phpConfig.strictTypes} onChange={(v) => updateConfig('strictTypes', v)} />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // JSON5 Converter Settings
    // ----------------------------------------------------------------------
    if (isJSON5Converter) {
        const json5Config = config as JSON5ConverterConfig;

        return (
            <SettingsContainer title="JSON5 Settings" onReset={() => {
                const { defaultJSON5Config } = require('@/app/types/json5-converter-config');
                onConfigChange(defaultJSON5Config);
            }}>
                {/* Indentation */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Indentation</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['2', '4', 'tab'] as const).map((indent) => (
                            <button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${json5Config.indentation === indent
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {indent === 'tab' ? 'Tab' : `${indent} Spaces`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quote Style */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Quote Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['double', 'single'] as const).map((style) => (
                            <button
                                key={style}
                                onClick={() => updateConfig('quoteStyle', style)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${json5Config.quoteStyle === style
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {style === 'double' ? 'Double " "' : "Single ' '"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                    <Toggle
                        label="Use JSON5 Format"
                        checked={json5Config.useJSON5}
                        onChange={(v) => updateConfig('useJSON5', v)}
                    />
                    <Toggle
                        label="Unquoted Keys"
                        checked={json5Config.unquotedKeys}
                        onChange={(v) => updateConfig('unquotedKeys', v)}
                    />
                    <Toggle
                        label="Trailing Commas"
                        checked={json5Config.trailingCommas}
                        onChange={(v) => updateConfig('trailingCommas', v)}
                    />
                    <Toggle
                        label="Strip Comments"
                        checked={json5Config.stripComments}
                        onChange={(v) => updateConfig('stripComments', v)}
                    />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // JSON Tree Viewer Settings
    // ----------------------------------------------------------------------
    if (isTreeViewer) {
        const treeConfig = config as JsonTreeViewerConfig;

        return (
            <SettingsContainer title="Tree Settings" onReset={() => {
                const { defaultViewerConfig } = require('@/app/types/json-viewer-config');
                onConfigChange(defaultViewerConfig);
            }}>
                {/* Indentation */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Indentation</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['2', '4', 'tab'] as const).map((indent) => (
                            <button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${treeConfig.indentation === indent
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {indent === 'tab' ? 'Tab' : `${indent} Spaces`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                    <Toggle
                        label="Show Commas"
                        checked={treeConfig.showCommas}
                        onChange={(v) => updateConfig('showCommas', v)}
                    />
                    <Toggle
                        label="Show Brackets"
                        checked={treeConfig.showBrackets}
                        onChange={(v) => updateConfig('showBrackets', v)}
                    />
                    <Toggle
                        label="Show Item Counts"
                        checked={treeConfig.showItemCounts}
                        onChange={(v) => updateConfig('showItemCounts', v)}
                    />
                </div>
            </SettingsContainer>
        );
    }

    // ----------------------------------------------------------------------
    // Default JSON Formatter Settings
    // ----------------------------------------------------------------------
    const formatterConfig = config as JSONFormatterConfig;

    return (
        <SettingsContainer title="Settings" onReset={() => {
            const { defaultConfig } = require('@/app/types/json-formatter-config');
            onConfigChange(defaultConfig);
        }}>
            {/* Phase 1: Core Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Core Settings</h3>

                {/* Indentation */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Indentation</label>
                    <div className="grid grid-cols-4 gap-2">
                        {(['2', '4', 'tab', '0'] as IndentationType[]).map((indent) => (
                            <button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formatterConfig.indentation === indent
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {indent === 'tab' ? 'Tab' : indent === '0' ? 'None' : `${indent} sp`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pretty / Minify */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Format Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateConfig('pretty', true)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formatterConfig.pretty
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                }`}
                        >
                            Pretty Print
                        </button>
                        <button
                            onClick={() => updateConfig('pretty', false)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!formatterConfig.pretty
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                }`}
                        >
                            Minify
                        </button>
                    </div>
                </div>
            </div>

            {/* Phase 2: Intermediate Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Intermediate Settings</h3>

                {/* Key Sorting */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Key Sorting</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['none', 'asc', 'desc'] as KeySorting[]).map((sort) => (
                            <button
                                key={sort}
                                onClick={() => updateConfig('keySorting', sort)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formatterConfig.keySorting === sort
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {sort === 'none' ? 'None' : sort === 'asc' ? 'A → Z' : 'Z → A'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Array Formatting */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Array Formatting</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['multi-line', 'single-line'] as ArrayFormatting[]).map((format) => (
                            <button
                                key={format}
                                onClick={() => updateConfig('arrayFormatting', format)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formatterConfig.arrayFormatting === format
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {format === 'multi-line' ? 'Multi-line' : 'Single-line'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Normalize Spaces */}
                <Toggle
                    label="Clean Duplicate Spaces"
                    checked={formatterConfig.normalizeSpaces}
                    onChange={(v) => updateConfig('normalizeSpaces', v)}
                />

                {/* Normalize Line Breaks */}
                <Toggle
                    label="Normalize Line Breaks"
                    checked={formatterConfig.normalizeLineBreaks}
                    onChange={(v) => updateConfig('normalizeLineBreaks', v)}
                />
            </div>

            {/* Phase 3: Key/Value Level Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Key/Value Level Settings</h3>

                {/* Quote Style */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Quote Style</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['double', 'single'] as QuoteStyle[]).map((style) => (
                            <button
                                key={style}
                                onClick={() => updateConfig('quoteStyle', style)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${formatterConfig.quoteStyle === style
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                {style === 'double' ? 'Double " "' : "Single ' '"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trailing Commas */}
                <Toggle
                    label="Trailing Commas"
                    checked={formatterConfig.trailingCommas}
                    onChange={(v) => updateConfig('trailingCommas', v)}
                />
            </div>

            {/* Phase 4: Extended JSON Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Extended JSON Settings</h3>

                {/* Use JSON5 */}
                <Toggle
                    label="Use JSON5"
                    checked={formatterConfig.useJSON5}
                    onChange={(v) => updateConfig('useJSON5', v)}
                />

                {/* Strip Comments */}
                <Toggle
                    label="Strip JSON5 Comments"
                    checked={formatterConfig.stripComments}
                    onChange={(v) => updateConfig('stripComments', v)}
                />

                {/* Remove Null */}
                <Toggle
                    label="Remove Null Fields"
                    checked={formatterConfig.removeNull}
                    onChange={(v) => updateConfig('removeNull', v)}
                />

                {/* Remove Empty Arrays */}
                <Toggle
                    label="Remove Empty Arrays"
                    checked={formatterConfig.removeEmptyArrays}
                    onChange={(v) => updateConfig('removeEmptyArrays', v)}
                />

                {/* Remove Empty Objects */}
                <Toggle
                    label="Remove Empty Objects"
                    checked={formatterConfig.removeEmptyObjects}
                    onChange={(v) => updateConfig('removeEmptyObjects', v)}
                />

                {/* Key Case Transformation */}
                <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Key Case Transform</label>
                    <select
                        value={formatterConfig.keyCase}
                        onChange={(e) => updateConfig('keyCase', e.target.value as KeyCase)}
                        className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value="none">No Transformation</option>
                        <option value="camelCase">camelCase</option>
                        <option value="snake_case">snake_case</option>
                        <option value="PascalCase">PascalCase</option>
                        <option value="kebab-case">kebab-case</option>
                    </select>
                </div>
            </div>
        </SettingsContainer>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <label className="text-white text-sm font-medium">{label}</label>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-white/20'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
    );
}
