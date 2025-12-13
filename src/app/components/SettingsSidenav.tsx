"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { JSONFormatterConfig, IndentationType, QuoteStyle, KeyCase, ArrayFormatting, KeySorting, defaultConfig as defaultFormatterConfig } from "@/core/types/json-formatter-config";
import { JsonTreeViewerConfig, defaultViewerConfig } from "@/core/types/json-viewer-config";
import { JSON5ConverterConfig, defaultJSON5Config } from "@/core/types/json5-converter-config";
import {
    TypeScriptConfig, JavaConfig, KotlinConfig, DartConfig, SwiftConfig,
    GoConfig, CSharpConfig, PythonConfig, RustConfig, PHPConfig,
    defaultTypeScriptConfig, defaultJavaConfig, defaultKotlinConfig, defaultDartConfig, defaultSwiftConfig,
    defaultGoConfig, defaultCSharpConfig, defaultPythonConfig, defaultRustConfig, defaultPHPConfig
} from "@/core/types/code-generator-config";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";

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
                        <Button
                            onClick={onReset}
                            variant="secondary"
                            className="w-full bg-white/10 text-white hover:bg-white/20"
                        >
                            Reset to Defaults
                        </Button>
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
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Type Kind</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => updateConfig('typeKind', 'interface')} variant={tsConfig.typeKind === 'interface' ? 'secondary' : 'ghost'} className="w-full">Interface</Button>
                                <Button onClick={() => updateConfig('typeKind', 'type')} variant={tsConfig.typeKind === 'type' ? 'secondary' : 'ghost'} className="w-full">Type Alias</Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Runtime Typecheck</Label>
                        <Select value={tsConfig.runtimeTypecheck} onValueChange={(value) => updateConfig('runtimeTypecheck', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select runtime typecheck" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="io-ts">IO-TS</SelectItem>
                                <SelectItem value="zod">Zod</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
                        <Label className="text-white text-sm font-medium">Package Name</Label>
                        <Input
                            type="text"
                            value={javaConfig.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Array Type</Label>
                        <Select value={javaConfig.arrayType} onValueChange={(value) => updateConfig('arrayType', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select array type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">List</SelectItem>
                                <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Package Name</Label>
                        <Input
                            type="text"
                            value={kotlinConfig.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Framework</Label>
                        <Select value={kotlinConfig.framework} onValueChange={(value) => updateConfig('framework', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="just-types">Just Types</SelectItem>
                                <SelectItem value="jackson">Jackson</SelectItem>
                                <SelectItem value="kotlinx">Kotlinx</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Type Kind</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => updateConfig('typeKind', 'struct')} variant={swiftConfig.typeKind === 'struct' ? 'secondary' : 'ghost'} className="w-full">Struct</Button>
                                <Button onClick={() => updateConfig('typeKind', 'class')} variant={swiftConfig.typeKind === 'class' ? 'secondary' : 'ghost'} className="w-full">Class</Button>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Access Level</Label>
                        <Select value={swiftConfig.accessLevel} onValueChange={(value) => updateConfig('accessLevel', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select access level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="internal">Internal</SelectItem>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Package Name</Label>
                        <Input
                            type="text"
                            value={goConfig.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Field Naming</Label>
                        <Select value={goConfig.fieldNaming} onValueChange={(value) => updateConfig('fieldNaming', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select field naming" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json">JSON Tags</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Namespace</Label>
                        <Input
                            type="text"
                            value={csharpConfig.namespace}
                            onChange={(e) => updateConfig('namespace', e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:border-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Framework</Label>
                        <Select value={csharpConfig.framework} onValueChange={(value) => updateConfig('framework', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Newtonsoft.Json">Newtonsoft.Json</SelectItem>
                                <SelectItem value="System.Text.Json">System.Text.Json</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Array Type</Label>
                        <Select value={csharpConfig.arrayType} onValueChange={(value) => updateConfig('arrayType', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select array type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">List</SelectItem>
                                <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Python Version</Label>
                        <Select value={pythonConfig.pythonVersion} onValueChange={(value) => updateConfig('pythonVersion', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select Python version" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3.7">3.7</SelectItem>
                                <SelectItem value="3.6">3.6</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Visibility</Label>
                        <Select value={rustConfig.visibility} onValueChange={(value) => updateConfig('visibility', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="crate">Crate</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Density</Label>
                        <Select value={rustConfig.density} onValueChange={(value) => updateConfig('density', value)}>
                            <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                                <SelectValue placeholder="Select density" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="dense">Dense</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label className="text-white text-sm font-medium">Namespace</Label>
                        <Input
                            type="text"
                            value={phpConfig.namespace}
                            onChange={(e) => updateConfig('namespace', e.target.value)}
                            className="bg-white/10 text-white border-white/20 focus:border-blue-500"
                        />
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
                onConfigChange(defaultJSON5Config);
            }}>
                {/* Indentation */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Indentation</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['2', '4', 'tab'] as const).map((indent) => (
                            <Button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                variant={json5Config.indentation === indent ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {indent === 'tab' ? 'Tab' : `${indent} Spaces`}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Quote Style */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Quote Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['double', 'single'] as const).map((style) => (
                            <Button
                                key={style}
                                onClick={() => updateConfig('quoteStyle', style)}
                                variant={json5Config.quoteStyle === style ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {style === 'double' ? 'Double " "' : "Single ' '"}
                            </Button>
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
                onConfigChange(defaultViewerConfig);
            }}>
                {/* Indentation */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Indentation</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['2', '4', 'tab'] as const).map((indent) => (
                            <Button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                variant={treeConfig.indentation === indent ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {indent === 'tab' ? 'Tab' : `${indent} Spaces`}
                            </Button>
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
            onConfigChange(defaultFormatterConfig);
        }}>
            {/* Phase 1: Core Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Core Settings</h3>

                {/* Indentation */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Indentation</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {(['2', '4', 'tab', '0'] as IndentationType[]).map((indent) => (
                            <Button
                                key={indent}
                                onClick={() => updateConfig('indentation', indent)}
                                variant={formatterConfig.indentation === indent ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {indent === 'tab' ? 'Tab' : indent === '0' ? 'None' : `${indent} sp`}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Pretty / Minify */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Format Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => updateConfig('pretty', true)}
                            variant={formatterConfig.pretty ? 'secondary' : 'ghost'}
                            className="w-full"
                        >
                            Pretty Print
                        </Button>
                        <Button
                            onClick={() => updateConfig('pretty', false)}
                            variant={!formatterConfig.pretty ? 'secondary' : 'ghost'}
                            className="w-full"
                        >
                            Minify
                        </Button>
                    </div>
                </div>
            </div>

            {/* Phase 2: Intermediate Settings */}
            <div className="space-y-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider opacity-60">Intermediate Settings</h3>

                {/* Key Sorting */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Key Sorting</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['none', 'asc', 'desc'] as KeySorting[]).map((sort) => (
                            <Button
                                key={sort}
                                onClick={() => updateConfig('keySorting', sort)}
                                variant={formatterConfig.keySorting === sort ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {sort === 'none' ? 'None' : sort === 'asc' ? 'A → Z' : 'Z → A'}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Array Formatting */}
                <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Array Formatting</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['multi-line', 'single-line'] as ArrayFormatting[]).map((format) => (
                            <Button
                                key={format}
                                onClick={() => updateConfig('arrayFormatting', format)}
                                variant={formatterConfig.arrayFormatting === format ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {format === 'multi-line' ? 'Multi-line' : 'Single-line'}
                            </Button>
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
                    <Label className="text-white text-sm font-medium">Quote Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['double', 'single'] as QuoteStyle[]).map((style) => (
                            <Button
                                key={style}
                                onClick={() => updateConfig('quoteStyle', style)}
                                variant={formatterConfig.quoteStyle === style ? 'secondary' : 'ghost'}
                                className="w-full"
                            >
                                {style === 'double' ? 'Double " "' : "Single ' '"}
                            </Button>
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
                    <Label className="text-white text-sm font-medium">Key Case Transform</Label>
                    <Select value={formatterConfig.keyCase} onValueChange={(value) => updateConfig('keyCase', value as KeyCase)}>
                        <SelectTrigger className="w-full bg-white/10 text-white border-white/20 focus:border-blue-500">
                            <SelectValue placeholder="Select key case" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Transformation</SelectItem>
                            <SelectItem value="camelCase">camelCase</SelectItem>
                            <SelectItem value="snake_case">snake_case</SelectItem>
                            <SelectItem value="PascalCase">PascalCase</SelectItem>
                            <SelectItem value="kebab-case">kebab-case</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </SettingsContainer>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="text-white text-sm font-medium">{label}</Label>
            <Switch
                id={label.replace(/\s+/g, '-').toLowerCase()}
                checked={checked}
                onCheckedChange={onChange}
            />
        </div>
    );
}
