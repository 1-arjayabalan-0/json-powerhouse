"use client"

import { useState, useEffect } from "react";
import { JsonTreeViewerConfig, defaultViewerConfig } from "@/core/types/json-viewer-config";
import { useConfig } from "@/app/context/ConfigContext";
import { toast } from "sonner";
import JsonTreeNode from "./JsonTreeNode";
import TreeControls from "./TreeControls";
import { Button } from "@/app/components/ui/button";
import CodeEditor from "@/app/components/CodeEditor";
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel";
import KeyboardShortcuts from "@/app/components/KeyboardShortcuts";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";
import { useAutoRepair } from "@/app/hooks/useAutoRepair";
import { useJsonWorker } from "@/app/hooks/useJsonWorker";

export default function JsonTreeViewer() {
    const [input, setInput] = useState("");
    const { config, setConfig } = useConfig();
    const [treeKey, setTreeKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Auto-repair broken JSON before tree building
    const { repaired, repairCount, isValid, error: repairError } = useAutoRepair(input);

    // Parse JSON using Web Worker for large files, sync fallback for small ones
    const {
        data: parsedJson,
        isParsing,
        error: parseError,
        parseTimeMs,
        sizeBytes,
        usedWorker
    } = useJsonWorker(repaired);

    const error = parseError || repairError;

    // Initialize config if needed
    useEffect(() => {
        if (!('showDataTypes' in config)) {
            setConfig(defaultViewerConfig);
        }
    }, []);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInput(text);
            toast.success("Pasted from clipboard");
        } catch (err) {
            toast.error("Failed to read clipboard");
        }
    };

    const handleExpandAll = () => {
        setConfig({ ...config, autoExpandDepth: 100 });
        setTreeKey(prev => prev + 1);
    };

    const handleCollapseAll = () => {
        setConfig({ ...config, autoExpandDepth: 0 });
        setTreeKey(prev => prev + 1);
    };

    // Cast config to JsonTreeViewerConfig for type safety in render
    const viewerConfig = config as JsonTreeViewerConfig;

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">
            <KeyboardShortcuts
                onCopyOutput={() => {
                    if (parsedJson) {
                        navigator.clipboard.writeText(JSON.stringify(parsedJson, null, 2));
                        toast.success("JSON copied!");
                    }
                }}
            />
            {/* Left Section: Input Editor */}
            <section className="flex-none lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background h-[45vh] lg:h-full min-h-[300px] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input Editor</span>
                    <div className="ml-auto flex gap-2 items-center">
                        {error && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">error</span>
                                <span className="hidden sm:inline">Invalid JSON</span>
                                <span className="sm:hidden">Error</span>
                            </span>
                        )}
                        {!error && input.trim() && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_20%,transparent)] flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">check</span>
                                Valid
                            </span>
                        )}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                onClick={() => {
                                    setInput(JSON.stringify(COMPLEX_JSON_SAMPLE, null, 2));
                                    toast.success('Sample JSON loaded');
                                }}
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-primary hover:opacity-90 text-primary-foreground rounded border 
                                border-[color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center gap-1 transition-colors"
                                title="Load Sample JSON"
                            >
                                <span className="material-symbols-outlined !text-[12px]">auto_fix_high</span>
                                <span>Sample</span>
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const text = await navigator.clipboard.readText();
                                        if (text) {
                                            setInput(text);
                                            toast.success('Pasted from clipboard');
                                        }
                                    } catch (err) {
                                        toast.error('Failed to paste');
                                    }
                                }}
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-secondary hover:opacity-80 text-secondary-foreground rounded border 
                                border-border flex items-center gap-1 transition-colors"
                                title="Paste from clipboard"
                            >
                                <span className="material-symbols-outlined !text-[12px]">content_paste</span>
                                <span>Paste</span>
                            </button>
                            <button
                                onClick={() => {
                                    setInput("");
                                }}
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] rounded transition-all 
                                flex items-center justify-center gap-1"
                                title="Clear Input"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                <span>Clear</span>
                            </button>

                        </div>
                    </div>
                </div>
                <div className="flex flex-1 h-full overflow-hidden relative">
                    <CodeEditor
                        value={input}
                        language="json"
                        onChange={(val) => setInput(val || '')}
                        placeholder="Paste JSON here..."
                        className="rounded-none border-none bg-transparent"
                    />
                </div>
            </section>

            {/* Right Section: Output Workspace */}
            <section className="flex-none lg:flex-[1.5] flex flex-col bg-background w-full h-[55vh] lg:h-full min-h-[400px] lg:min-h-0">
                <div className="flex flex-col border-b border-border shrink-0">
                    <div className="h-10 px-4 flex items-center justify-between bg-card border-b border-border">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Workspace</span>
                        <div className="flex items-center gap-3">
                            {repairCount > 0 && (
                                <div className="flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--warning)_20%,transparent)]" title={`${repairCount} auto-repairs applied`}>
                                    <span className="material-symbols-outlined !text-[12px] text-warning">build</span>
                                    <span className="text-[10px] text-warning font-medium">Repaired {repairCount}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--success)_5%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_10%,transparent)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                <span className="text-[9px] text-success font-bold uppercase">Live</span>
                            </div>
                            {parsedJson && (
                                <button
                                    onClick={() => {
                                        const text = JSON.stringify(parsedJson, null, 2);
                                        navigator.clipboard.writeText(text);
                                        toast.success("JSON copied to clipboard!");
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm"
                                    title="Copy JSON"
                                >
                                    <span className="material-symbols-outlined !text-[12px]">content_copy</span>
                                    <span>Copy</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Secondary Toolbar for Tree Controls */}
                    <div className="h-auto sm:h-10 flex items-center px-1 sm:px-2 bg-accent border-b border-border overflow-x-auto scrollbar-none">
                        <TreeControls
                            config={viewerConfig}
                            setConfig={setConfig}
                            onExpandAll={handleExpandAll}
                            onCollapseAll={handleCollapseAll}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-auto custom-scroll p-4 bg-background">
                    {parsedJson ? (
                        <div className="text-foreground">
                            {/* File size + stats bar */}
                            <div className="flex items-center gap-4 mb-3 px-2 py-1.5 bg-muted/30 rounded text-[10px] text-muted-foreground border border-border">
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[12px]">data_usage</span>
                                    Size: {formatBytes(sizeBytes || new Blob([input]).size)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[12px]">account_tree</span>
                                    Depth: {getJsonDepth(parsedJson)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="material-symbols-outlined !text-[12px]">tag</span>
                                    Type: {Array.isArray(parsedJson) ? `Array[${parsedJson.length}]` : `Object{${Object.keys(parsedJson).length}}`}
                                </span>
                                {parseTimeMs > 0 && (
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined !text-[12px]">timer</span>
                                        {parseTimeMs < 1 ? '<1ms' : `${Math.round(parseTimeMs)}ms`}
                                        {usedWorker && <span className="text-primary ml-1">(worker)</span>}
                                    </span>
                                )}
                                {isParsing && (
                                    <span className="flex items-center gap-1 text-primary">
                                        <span className="material-symbols-outlined !text-[12px] animate-spin">progress_activity</span>
                                        Parsing...
                                    </span>
                                )}
                                {repairCount > 0 && (
                                    <span className="flex items-center gap-1 text-warning">
                                        <span className="material-symbols-outlined !text-[12px]">build</span>
                                        {repairCount} repaired
                                    </span>
                                )}
                            </div>
                            <JsonTreeNode
                                key={treeKey}
                                value={parsedJson}
                                path=""
                                depth={0}
                                config={viewerConfig}
                                isLast={true}
                                searchTerm={searchTerm}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            {error ? "Fix JSON errors to view tree" : "Enter valid JSON to view tree"}
                        </div>
                    )}
                </div>
                <BottomConfigurationPanel />
            </section>
        </main>
    );
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getJsonDepth(obj: any): number {
    if (obj === null || typeof obj !== 'object') return 0;
    const values = Array.isArray(obj) ? obj : Object.values(obj);
    if (values.length === 0) return 1;
    return 1 + Math.max(...values.map(getJsonDepth));
}
