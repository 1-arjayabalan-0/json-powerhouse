"use client"

import { useState, useEffect } from "react";
import { JsonTreeViewerConfig, defaultViewerConfig } from "@/app/types/json-viewer-config";
import { useConfig } from "@/app/context/ConfigContext";
import { toast } from "sonner";
import JsonTreeNode from "./JsonTreeNode";
import TreeControls from "./TreeControls";

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
        <div className="flex h-full gap-4 p-4 w-full">
            {/* Left Pane: Input */}
            <div className="flex-1 flex flex-col gap-2 min-w-[300px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold">Input JSON</h2>
                    <button
                        onClick={handlePaste}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors"
                    >
                        Paste
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste JSON here..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-4 text-sm font-mono text-white/80 resize-none focus:outline-none focus:border-primary/50"
                    spellCheck={false}
                />
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-mono break-all">
                        {error}
                    </div>
                )}
            </div>

            {/* Right Pane: Tree Viewer */}
            <div className="flex-[2] flex flex-col gap-2 bg-black/20 border border-white/10 rounded-lg overflow-hidden relative">
                <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                    <h2 className="text-white text-lg font-bold">Tree View</h2>
                    <div className="flex items-center gap-2">
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

                <div className="flex-1 overflow-auto p-4">
                    {parsedJson ? (
                        <div className="text-white">
                            {/* Tree Component */}
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
                        <div className="flex items-center justify-center h-full text-white/30 text-sm">
                            {error ? "Fix JSON errors to view tree" : "Enter valid JSON to view tree"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
