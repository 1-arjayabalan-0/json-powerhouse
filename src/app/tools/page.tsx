"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toolsConfig } from "@/app/config/tools-config";
import CodeEditor from "@/app/components/CodeEditor";
import { validateJson } from "@/core/lib/converters/validateJson";
import { useValidation } from "@/app/context/ValidationContext";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export default function ToolsHomePage() {
    const router = useRouter();
    const { setErrors, setWarnings, setOnErrorClick } = useValidation();
    const [input, setInput] = useState("");
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const validationResult = validateJson(input);

    // Update validation results when input changes
    useEffect(() => {
        setErrors(validationResult.errors);
        setWarnings(validationResult.warnings);
    }, [input, validationResult, setErrors, setWarnings]);

    // Set up error click handler
    useEffect(() => {
        setOnErrorClick((error) => {
            toast.info(`Error on line ${error?.line}`);
        });
    }, [setOnErrorClick]);

    const jsonTools = toolsConfig.find(cat => cat.id === 'json-tools')?.tools || [];

    const handleToolSelect = (toolPath: string) => {
        setSelectedTool(toolPath);
        router.push(toolPath);
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setInput(text);
            toast.success("Pasted from clipboard");
        } catch (err) {
            toast.error("Failed to read clipboard");
        }
    };

    const handleClear = () => {
        setInput("");
        setSelectedTool(null);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">
                        JSON PowerHouse
                    </h1>
                    <p className="text-white/60 text-sm font-normal leading-normal">
                        Select a tool or start editing JSON
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handlePaste}
                        variant="secondary"
                        className="bg-white/10 text-white hover:bg-white/20"
                    >
                        <span className="material-symbols-outlined text-lg mr-2">content_paste</span>
                        Paste
                    </Button>
                    <Button
                        onClick={handleClear}
                        variant="secondary"
                        className="bg-white/10 text-white hover:bg-white/20"
                    >
                        <span className="material-symbols-outlined text-lg mr-2">delete</span>
                        Clear
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: JSON Editor */}
                <div className="flex flex-1 flex-col border-r border-white/10">
                    <div className="border-b border-white/10 p-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-white text-sm font-semibold">Input.json</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60">
                                    {(input.length / 1024).toFixed(1)} KB
                                </span>
                                {validationResult.isValid ? (
                                    <span className="flex items-center gap-1 text-xs text-green-400">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Valid
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-red-400">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        Invalid
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <CodeEditor
                            value={input}
                            language="json"
                            onChange={(val) => setInput(val || '')}
                            placeholder='{ "paste": "your json here" }'
                        />
                    </div>
                </div>

                {/* Right: Tool Selector */}
                <div className="w-80 border-l border-white/10 flex flex-col">
                    <div className="border-b border-white/10 p-4">
                        <h2 className="text-white text-lg font-bold mb-1">JSON TOOLS</h2>
                        <p className="text-white/60 text-xs">Select a tool to process your JSON</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {jsonTools.map((tool) => (
                            <button
                                key={tool.id}
                                onClick={() => handleToolSelect(tool.path)}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-colors text-left"
                            >
                                {tool.icon && (
                                    <span className="material-symbols-outlined text-xl text-blue-400">
                                        {tool.icon}
                                    </span>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white text-sm font-semibold">{tool.name}</h3>
                                    {tool.description && (
                                        <p className="text-white/60 text-xs mt-0.5">{tool.description}</p>
                                    )}
                                </div>
                                <span className="material-symbols-outlined text-white/40 text-lg">
                                    chevron_right
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

