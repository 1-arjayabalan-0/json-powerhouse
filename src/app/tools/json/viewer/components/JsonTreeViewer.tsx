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
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";

export default function JsonTreeViewer() {
    const [input, setInput] = useState("");
    const [parsedJson, setParsedJson] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { config, setConfig } = useConfig();
    const [treeKey, setTreeKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Initialize config if needed
    useEffect(() => {
        // Simple check to see if we have the right config shape, otherwise reset
        if (!('showDataTypes' in config)) {
            setConfig(defaultViewerConfig);
        }
    }, []);

    // Parse JSON when input changes
    useEffect(() => {
        if (!input.trim()) {
            setParsedJson(null);
            setError(null);
            return;
        }

        try {
            const parsed = JSON.parse(input);
            setParsedJson(parsed);
            setError(null);
        } catch (e: any) {
            setParsedJson(null);
            setError(e.message);
        }
    }, [input]);

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
                                <span className="hidden xs:inline">Sample</span>
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
                                <span className="hidden xs:inline">Paste</span>
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
                                <span className="hidden xs:inline">Clear</span>
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
                            <div className="flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--success)_5%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_10%,transparent)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                <span className="text-[9px] text-success font-bold uppercase">Live</span>
                            </div>
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
