"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { JSONFormatterConfig, IndentationType, QuoteStyle, KeyCase, ArrayFormatting, KeySorting } from "@/app/types/json-formatter-config";
import { JsonTreeViewerConfig } from "@/app/types/json-viewer-config";
import { JSON5ConverterConfig } from "@/app/types/json5-converter-config";
import { toast } from "sonner";

interface SettingsSidenavProps {
    config: any;
    onConfigChange: (config: any) => void;
}

export default function SettingsSidenav({ config, onConfigChange }: SettingsSidenavProps) {
    const pathname = usePathname();
    const isTreeViewer = pathname === '/tools/json-viewer';
    const isJSON5Converter = pathname === '/tools/json-json5';
    const [isCollapsed, setIsCollapsed] = useState(false);

    const updateConfig = (key: string, value: any) => {
        onConfigChange({ ...config, [key]: value });
        // toast.info(`Updated ${key} setting`); // Optional: reduce noise
    };

    // ----------------------------------------------------------------------
    // JSON5 Converter Settings
    // ----------------------------------------------------------------------
    if (isJSON5Converter) {
        const json5Config = config as JSON5ConverterConfig;

        return (
            <div className={`bg-background-dark border-l border-white/10 flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
                <div className="flex items-center justify-between border-b border-white/10 p-1">
                    {!isCollapsed && <h2 className="text-white text-lg font-bold">JSON5 Settings</h2>}
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

                        {/* Reset Button */}
                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    const { defaultJSON5Config } = require('@/app/types/json5-converter-config');
                                    onConfigChange(defaultJSON5Config);
                                }}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // JSON Tree Viewer Settings
    // ----------------------------------------------------------------------
    if (isTreeViewer) {
        const treeConfig = config as JsonTreeViewerConfig;

        return (
            <div className={`bg-background-dark border-l border-white/10 flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
                <div className="flex items-center justify-between border-b border-white/10 p-1">
                    {!isCollapsed && <h2 className="text-white text-lg font-bold">Tree Settings</h2>}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors ml-auto"
                        title={isCollapsed ? "Expand settings" : "Collapse settings"}
                    >
                        <span className={`material-symbols-outlined text-xl transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
                            chevron_right
                        </span>
                    </button>
                </div>
                {!isCollapsed && (
                    <div className="overflow-y-auto flex-1 p-4 space-y-6">
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

                        {/* Reset Button */}
                        <div className="pt-4 border-t border-white/10">
                            <button
                                onClick={() => {
                                    const { defaultViewerConfig } = require('@/app/types/json-viewer-config');
                                    onConfigChange(defaultViewerConfig);
                                }}
                                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // Default JSON Formatter Settings
    // ----------------------------------------------------------------------
    const formatterConfig = config as JSONFormatterConfig;

    return (
        <div className={`bg-background-dark border-l border-white/10 flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-1">
                {!isCollapsed && <h2 className="text-white text-lg font-bold">Settings</h2>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-md text-white/70 hover:bg-white/10 hover:text-white transition-colors ml-auto"
                    title={isCollapsed ? "Expand settings" : "Collapse settings"}
                >
                    <span className={`material-symbols-outlined text-xl transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
                        chevron_right
                    </span>
                </button>
            </div>

            {/* Settings Content */}
            {!isCollapsed && (
                <div className="overflow-y-auto flex-1 p-4 space-y-6">

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

                    {/* Reset Button */}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={() => {
                                const { defaultConfig } = require('@/app/types/json-formatter-config');
                                onConfigChange(defaultConfig);
                            }}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            )}
        </div>
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
