"use client"

import { useState, useEffect } from "react";
import { JsonTreeViewerConfig, defaultViewerConfig } from "@/core/types/json-viewer-config";
import { useConfig } from "@/app/context/ConfigContext";
import { useValidation } from "@/app/context/ValidationContext";
import { validateJson } from "@/core/lib/converters/validateJson";
import { toast } from "sonner";
import JsonTreeNode from "./JsonTreeNode";
import TreeControls from "./TreeControls";
import { Button } from "@/app/components/ui/button";
import CodeEditor from "../../../components/CodeEditor";

export default function JsonTreeViewer() {
    const [input, setInput] = useState("");
    const [parsedJson, setParsedJson] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { config, setConfig } = useConfig();
    const { setErrors, setWarnings, setOnErrorClick } = useValidation();
    const [treeKey, setTreeKey] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    // Update validation results when input changes
    useEffect(() => {
        const validation = validateJson(input);
        setErrors(validation.errors);
        setWarnings(validation.warnings);
    }, [input, setErrors, setWarnings]);

    // Set up error click handler
    useEffect(() => {
        setOnErrorClick((error) => {
            toast.info(`Error on line ${error?.line}`);
        });
    }, [setOnErrorClick]);

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

    const handleCopy = async () => {
        try {
            if (input && !error) {
                await navigator.clipboard.writeText(input);
                toast.success("Copied to clipboard!");
            }
        } catch (err) {
            console.error('Failed to copy!', err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        try {
            if (input && !error) {
                const blob = new Blob([input], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'json-viewer.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Downloaded successfully!");
            }
        } catch (err) {
            console.error('Download failed', err);
            toast.error("Download failed");
        }
    };

    // Cast config to JsonTreeViewerConfig for type safety in render
    const viewerConfig = config as JsonTreeViewerConfig;

    return (
        <div className="flex h-full gap-4 p-4 w-full">
            {/* Left Pane: Input */}
            <div className="flex-1 flex flex-col gap-2 min-w-[300px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold">Input JSON</h2>
                    <Button
                        onClick={handlePaste}
                        variant="secondary"
                        size="sm"
                        className="h-6 px-2 text-xs bg-white/10 hover:bg-white/20 text-white"
                    >
                        Paste
                    </Button>
                </div>
                <CodeEditor
                    value={input}
                    language="json"
                    onChange={(val) => setInput(val || '')}
                    placeholder="Paste JSON here..."
                    className="flex-1 bg-black/20 border-white/10 rounded-lg"
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
                        <Button
                            onClick={handleCopy}
                            disabled={!input || !!error}
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 text-white hover:bg-white/20 h-7 text-xs"
                        >
                            Copy
                        </Button>
                        <Button
                            onClick={handleDownload}
                            disabled={!input || !!error}
                            variant="secondary"
                            size="sm"
                            className="bg-white/10 text-white hover:bg-white/20 h-7 text-xs"
                        >
                            Download
                        </Button>
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
