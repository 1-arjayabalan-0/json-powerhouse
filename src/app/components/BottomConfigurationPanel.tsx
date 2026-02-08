"use client"

import { usePathname, useRouter } from "next/navigation";
import { useConfig } from "@/app/context/ConfigContext";
import { toolsConfig, ToolCategory } from "@/app/config/tools-config";
import {
    JSONFormatterConfig, IndentationType, QuoteStyle, KeyCase, ArrayFormatting, KeySorting, defaultConfig as defaultFormatterConfig
} from "@/core/types/json-formatter-config";
import { JsonTreeViewerConfig, defaultViewerConfig } from "@/core/types/json-viewer-config";
import { JSON5ConverterConfig, defaultJSON5Config } from "@/core/types/json5-converter-config";
import { JsonDiffConfig, defaultDiffConfig } from "@/core/types/diff-config";
import {
    TypeScriptConfig, JavaConfig, KotlinConfig, DartConfig, SwiftConfig,
    GoConfig, CSharpConfig, PythonConfig, RustConfig, PHPConfig,
    defaultTypeScriptConfig, defaultJavaConfig, defaultKotlinConfig, defaultDartConfig, defaultSwiftConfig,
    defaultGoConfig, defaultCSharpConfig, defaultPythonConfig, defaultRustConfig, defaultPHPConfig
} from "@/core/types/code-generator-config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { useEffect, useState } from "react";
import { useMode } from "@/app/context/ModeContext";

export default function BottomConfigurationPanel() {
    const pathname = usePathname();
    const router = useRouter();
    const { config, setConfig } = useConfig();
    const { mode } = useMode();
    const [isExpanded, setIsExpanded] = useState(true);

    // Find current tool and flatten tools list for dropdown
    const allTools = toolsConfig.flatMap(c => c.tools);
    const currentTool = allTools.find(t => t.path === pathname);
    const currentCategory = toolsConfig.find(c => c.tools.some(t => t.path === pathname));

    const handleLanguageChange = (path: string) => {
        router.push(path);
    };

    const updateConfig = (key: string, value: any) => {
        setConfig({ ...config, [key]: value });
    };

    useEffect(() => {
        console.log("config", config);

    })

    // Helper to render specific settings based on current tool
    const renderSettings = () => {
        // --- Code Generators ---
        if (pathname === '/tools/code/json-to-csharp') {
            const conf = config as CSharpConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Output Type</Label>
                        <Select value={conf.recordType} onValueChange={(v) => updateConfig('recordType', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="record">Records</SelectItem>
                                <SelectItem value="class">Classes</SelectItem>
                                <SelectItem value="struct">Structs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Access Level</Label>
                        <Select value={conf.accessLevel} onValueChange={(v) => updateConfig('accessLevel', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">public</SelectItem>
                                <SelectItem value="internal">internal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.nullable} onCheckedChange={(v) => updateConfig('nullable', v)} id="nullable" />
                            <Label htmlFor="nullable" className="text-xs text-muted-foreground">Nullable Reference Types</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.systemTextJson} onCheckedChange={(v) => updateConfig('systemTextJson', v)} id="stj" />
                            <Label htmlFor="stj" className="text-xs text-muted-foreground">System.Text.Json</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-typescript') {
            const conf = config as TypeScriptConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type Kind</Label>
                        <Select value={conf.typeKind} onValueChange={(v) => updateConfig('typeKind', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="interface">Interface</SelectItem>
                                <SelectItem value="type">Type Alias</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Runtime Check</Label>
                        <Select value={conf.runtimeTypecheck} onValueChange={(v) => updateConfig('runtimeTypecheck', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="zod">Zod Schema</SelectItem>
                                <SelectItem value="io-ts">io-ts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-java') {
            const conf = config as JavaConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Package Name</Label>
                        <Input
                            value={conf.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="h-8 text-xs bg-accent border-input text-foreground w-full"
                        />
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Array Type</Label>
                        <Select value={conf.arrayType} onValueChange={(v) => updateConfig('arrayType', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="list">List&lt;T&gt;</SelectItem>
                                <SelectItem value="array">Array []</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useGettersSetters} onCheckedChange={(v) => updateConfig('useGettersSetters', v)} id="getters" />
                            <Label htmlFor="getters" className="text-xs text-muted-foreground">Getters & Setters</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useBigDecimal} onCheckedChange={(v) => updateConfig('useBigDecimal', v)} id="bigdecimal" />
                            <Label htmlFor="bigdecimal" className="text-xs text-muted-foreground">Use BigDecimal</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-kotlin') {
            const conf = config as KotlinConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Package Name</Label>
                        <Input
                            value={conf.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="h-8 text-xs bg-accent border-input text-foreground w-full"
                        />
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Framework</Label>
                        <Select value={conf.framework} onValueChange={(v) => updateConfig('framework', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="kotlinx">Kotlinx Serialization</SelectItem>
                                <SelectItem value="jackson">Jackson</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useDataClasses} onCheckedChange={(v) => updateConfig('useDataClasses', v)} id="dataclass" />
                            <Label htmlFor="dataclass" className="text-xs text-muted-foreground">Data Classes</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-dart') {
            const conf = config as DartConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.nullSafety} onCheckedChange={(v) => updateConfig('nullSafety', v)} id="nullsafety" />
                            <Label htmlFor="nullsafety" className="text-xs text-muted-foreground">Null Safety</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useFreezed} onCheckedChange={(v) => updateConfig('useFreezed', v)} id="freezed" />
                            <Label htmlFor="freezed" className="text-xs text-muted-foreground">Use Freezed</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useJsonSerializable} onCheckedChange={(v) => updateConfig('useJsonSerializable', v)} id="jsonserial" />
                            <Label htmlFor="jsonserial" className="text-xs text-muted-foreground">JSON Serializable</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-swift') {
            const conf = config as SwiftConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type Kind</Label>
                        <Select value={conf.typeKind} onValueChange={(v) => updateConfig('typeKind', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="struct">Struct</SelectItem>
                                <SelectItem value="class">Class</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Access Level</Label>
                        <Select value={conf.accessLevel} onValueChange={(v) => updateConfig('accessLevel', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="internal">Internal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useCodable} onCheckedChange={(v) => updateConfig('useCodable', v)} id="codable" />
                            <Label htmlFor="codable" className="text-xs text-muted-foreground">Codable Protocol</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-python') {
            const conf = config as PythonConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Python Version</Label>
                        <Select value={conf.pythonVersion} onValueChange={(v) => updateConfig('pythonVersion', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3.10+">3.10+</SelectItem>
                                <SelectItem value="3.9">3.9</SelectItem>
                                <SelectItem value="3.8">3.8</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Class Type</Label>
                        <Select value={conf.classType} onValueChange={(v) => updateConfig('classType', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dataclasses">Dataclasses</SelectItem>
                                <SelectItem value="attrs">Attrs</SelectItem>
                                <SelectItem value="plain">Plain Class</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useTypeHints} onCheckedChange={(v) => updateConfig('useTypeHints', v)} id="typehints" />
                            <Label htmlFor="typehints" className="text-xs text-muted-foreground">Type Hints</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-rust') {
            const conf = config as RustConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Visibility</Label>
                        <Select value={conf.visibility} onValueChange={(v) => updateConfig('visibility', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">pub</SelectItem>
                                <SelectItem value="crate">pub(crate)</SelectItem>
                                <SelectItem value="private">private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.deriveDebug} onCheckedChange={(v) => updateConfig('deriveDebug', v)} id="debug" />
                            <Label htmlFor="debug" className="text-xs text-muted-foreground">Derive Debug</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.deriveClone} onCheckedChange={(v) => updateConfig('deriveClone', v)} id="clone" />
                            <Label htmlFor="clone" className="text-xs text-muted-foreground">Derive Clone</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-php') {
            const conf = config as PHPConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 w-full">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Namespace</Label>
                        <Input
                            value={conf.namespace}
                            onChange={(e) => updateConfig('namespace', e.target.value)}
                            className="h-8 text-xs bg-accent border-input text-foreground w-full"
                        />
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.strictTypes} onCheckedChange={(v) => updateConfig('strictTypes', v)} id="strict" />
                            <Label htmlFor="strict" className="text-xs text-muted-foreground">Strict Types</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useGettersSetters} onCheckedChange={(v) => updateConfig('useGettersSetters', v)} id="phpgetters" />
                            <Label htmlFor="phpgetters" className="text-xs text-muted-foreground">Getters/Setters</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/code/json-to-go') {
            const conf = config as GoConfig;
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Package Name</Label>
                        <Input
                            value={conf.packageName}
                            onChange={(e) => updateConfig('packageName', e.target.value)}
                            className="h-8 text-xs bg-accent border-input text-foreground"
                        />
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.useOmitEmpty} onCheckedChange={(v) => updateConfig('useOmitEmpty', v)} id="omitempty" />
                            <Label htmlFor="omitempty" className="text-xs text-muted-foreground">Omit Empty</Label>
                        </div>
                    </div>
                </div>
            );
        }

        // --- JSON Editor (Formatter, Minifier, etc.) ---
        const jsonTools = [
            '/tools/json/formatter', '/tools/json/minifier',
            '/tools/json/validator', '/tools/json/normalize'
        ];

        if (jsonTools.includes(pathname)) {
            const conf = config as JSONFormatterConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-4">
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Indentation</Label>
                        <Select value={conf.indentation} onValueChange={(v) => updateConfig('indentation', v)}>
                            <SelectTrigger className="h-8 text-xs bg-[var(--input-background)] border-[var(--input)] text-[var(--foreground)] w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Spaces</SelectItem>
                                <SelectItem value="4">4 Spaces</SelectItem>
                                <SelectItem value="tab">Tabs</SelectItem>
                                <SelectItem value="0">Minify (No Spaces)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Sort Keys</Label>
                        <Select value={conf.keySorting} onValueChange={(v) => updateConfig('keySorting', v)}>
                            <SelectTrigger className="h-8 text-xs bg-[var(--input-background)] border-[var(--input)] text-[var(--foreground)] w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                                <SelectItem value="desc">Descending (Z-A)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Quote Style</Label>
                        <Select value={conf.quoteStyle} onValueChange={(v) => updateConfig('quoteStyle', v)}>
                            <SelectTrigger className="h-8 text-xs bg-[var(--input-background)] border-[var(--input)] text-[var(--foreground)] w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="double">Double Quote (")</SelectItem>
                                <SelectItem value="single">Single Quote (')</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={conf.stripComments}
                                onCheckedChange={(v) => updateConfig('stripComments', v)}
                                id="stripComments"
                                disabled={true}
                            />
                            <Label htmlFor="stripComments" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Comments</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.removeNull} onCheckedChange={(v) => updateConfig('removeNull', v)} id="removeNull" />
                            <Label htmlFor="removeNull" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Nulls</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={conf.trailingCommas}
                                onCheckedChange={(v) => updateConfig('trailingCommas', v)}
                                id="trailingCommas"
                            />
                            <Label htmlFor="trailingCommas" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Trailing</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/json/json5') {
            const conf = config as JSON5ConverterConfig;
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-x-4 gap-y-4">
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Indentation</Label>
                        <Select value={conf.indentation} onValueChange={(v) => updateConfig('indentation', v)}>
                            <SelectTrigger className="h-8 text-xs bg-[var(--input-background)] border-[var(--input)] text-[var(--foreground)] w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Spaces</SelectItem>
                                <SelectItem value="4">4 Spaces</SelectItem>
                                <SelectItem value="tab">Tabs</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Quotes</Label>
                        <Select value={conf.quoteStyle} onValueChange={(v) => updateConfig('quoteStyle', v)} disabled={true}>
                            <SelectTrigger className="h-8 text-xs bg-[var(--input-background)] border-[var(--input)] text-[var(--foreground-muted)] w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single (')</SelectItem>
                                <SelectItem value="double">Double (")</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.stripComments} onCheckedChange={(v) => updateConfig('stripComments', v)} id="stripComments" />
                            <Label htmlFor="stripComments" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Comments</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.trailingCommas} onCheckedChange={(v) => updateConfig('trailingCommas', v)} id="trailingCommas" disabled={true} />
                            <Label htmlFor="trailingCommas" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Trailing</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.unquotedKeys} onCheckedChange={(v) => updateConfig('unquotedKeys', v)} id="unquotedKeys" disabled={true} />
                            <Label htmlFor="unquotedKeys" className="text-xs text-[var(--foreground-muted)] whitespace-nowrap">Unquoted</Label>
                        </div>
                    </div>
                </div>
            );
        }

        if (pathname === '/tools/json/diff') {
            const conf = config as JsonDiffConfig & { diffStrategy: string };
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-4">
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider truncate">Strategy</Label>
                        <Select value={conf.diffStrategy} onValueChange={(v) => updateConfig('diffStrategy', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="json-patch-6902">RFC 6902</SelectItem>
                                <SelectItem value="merge-patch-7396">RFC 7396</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 min-w-0 flex flex-col">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Arrays</Label>
                        <Select value={conf.arrayStrategy} onValueChange={(v) => updateConfig('arrayStrategy', v)}>
                            <SelectTrigger className="h-8 text-xs bg-accent border-input text-foreground w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="index">Index Based</SelectItem>
                                <SelectItem value="replace">Replace All</SelectItem>
                                <SelectItem value="append">Append Only</SelectItem>
                                <SelectItem value="key">Key Identification</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {conf.arrayStrategy === 'key' && (
                        <div className="space-y-1.5 min-w-0 flex flex-col animate-in fade-in slide-in-from-top-1 duration-200">
                            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate">Match Key</Label>
                            <Input
                                value={conf.arrayMatchKey}
                                onChange={(e) => updateConfig('arrayMatchKey', e.target.value)}
                                className="h-8 text-xs bg-accent border-input text-foreground w-full"
                                placeholder="id, uuid, etc..."
                            />
                        </div>
                    )}
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.allowComments} onCheckedChange={(v) => updateConfig('allowComments', v)} id="allowComments" />
                            <Label htmlFor="allowComments" className="text-xs text-muted-foreground whitespace-nowrap">Allow JSON5</Label>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col justify-end pb-1 w-full">
                        <div className="flex items-center gap-2">
                            <Switch checked={conf.showUnchanged} onCheckedChange={(v) => updateConfig('showUnchanged', v)} id="showUnchanged" />
                            <Label htmlFor="showUnchanged" className="text-xs text-muted-foreground whitespace-nowrap">Unchanged</Label>
                        </div>
                    </div>
                </div>
            );
        }

        // Default / Fallback for other tools (generic message or specific implementation)
        return (
            <div className="text-xs text-muted-foreground italic">
                Configuration for {currentTool?.name}
            </div>
        );
    };

    const handleReset = () => {
        if (pathname === '/tools/code/json-to-csharp') setConfig(defaultCSharpConfig);
        else if (pathname === '/tools/code/json-to-typescript') setConfig(defaultTypeScriptConfig);
        else if (pathname === '/tools/code/json-to-java') setConfig(defaultJavaConfig);
        else if (pathname === '/tools/code/json-to-kotlin') setConfig(defaultKotlinConfig);
        else if (pathname === '/tools/code/json-to-dart') setConfig(defaultDartConfig);
        else if (pathname === '/tools/code/json-to-swift') setConfig(defaultSwiftConfig);
        else if (pathname === '/tools/code/json-to-python') setConfig(defaultPythonConfig);
        else if (pathname === '/tools/code/json-to-rust') setConfig(defaultRustConfig);
        else if (pathname === '/tools/code/json-to-php') setConfig(defaultPHPConfig);
        else if (pathname === '/tools/code/json-to-go') setConfig(defaultGoConfig);
        else if (pathname === '/tools/json/viewer') setConfig(defaultViewerConfig);
        else if (['/tools/json/formatter', '/tools/json/minifier', '/tools/json/validator', '/tools/json/normalize'].includes(pathname)) setConfig(defaultFormatterConfig);
        else if (pathname === '/tools/json/json5') setConfig(defaultJSON5Config);
        else if (pathname === '/tools/json/diff') setConfig({ ...defaultDiffConfig, diffStrategy: 'json-patch-6902' });
        // Add other resets here...
    };

    return (
        <div className="border-t border-border bg-popover shadow-[0_-8px_30px_-10px_color-mix(in_srgb,var(--foreground)_5%,transparent)] z-40 relative">
            <div
                className="min-h-9 py-2 px-2 flex flex-row items-start md:items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors gap-3"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                    {/* Language Dropdown (Navigation) */}
                    <div className="relative group w-full sm:min-w-[240px]" onClick={(e) => e.stopPropagation()}>
                        <Select value={pathname} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="h-8 text-[12px] bg-primary border-none text-white tracking-tight focus:ring-1 focus:ring-primary shadow-sm">
                                <SelectValue placeholder="Select Language/Tool" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {toolsConfig.filter(group => {
                                    if (mode === 'json') return group.id === 'json-tools';
                                    if (mode === 'code') return group.id === 'code-generators';
                                    return true;
                                }).map(group => (
                                    <div key={group.id}>
                                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30">{group.name}</div>
                                        {group.tools.map(tool => (
                                            <SelectItem key={tool.id} value={tool.path} className="text-[13px] pl-4">
                                                {tool.name}
                                            </SelectItem>
                                        ))}
                                    </div>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-auto md:ml-0">
                    <div className="flex items-center gap-2 shrink-0">
                        {/* <span className="text-[14px] text-foreground tracking-tighter font-medium sm:d-none ">Configuration</span> */}
                        <span className="material-symbols-outlined text-sm text-secondary">settings</span>
                    </div>
                </div>
            </div>

            {/* Configuration Content */}
            {isExpanded && (
                <div className="flex flex-col animate-in slide-in-from-bottom-2 duration-200">
                    <div className="p-1 pl-2 pr-2 max-h-[50vh] md:max-h-60 overflow-y-auto custom-scroll bg-background">
                        {renderSettings()}
                    </div>

                    <div className="px-2 py-1.5 bg-muted border-t border-border flex justify-between items-center sm:px-6">
                        <span className="text-[10px] text-muted-foreground italic font-medium">Syncing with source in real-time</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleReset();
                            }}
                            className="text-[11px] text-secondary font-bold hover:text-primary/90 flex items-center gap-1.5 cursor-pointer bg-primary/5 
                            px-3 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined !text-[16px]">restart_alt</span>
                            Reset Defaults
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
