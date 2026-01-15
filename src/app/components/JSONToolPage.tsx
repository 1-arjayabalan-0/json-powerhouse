"use client"

import JSONFormatter from "../tools/json-formatter/JSONFormatter";
import { useConfig } from "@/app/context/ConfigContext";
import { useValidation } from "@/app/context/ValidationContext";
import { useEffect, useState } from "react";
import { toolPresets, toolMetadata } from "@/app/config/tool-presets";
import { JSONFormatterConfig } from "../types/json-formatter-config";
import { validateJson } from "@/core/lib/converters/validateJson";
import { toast } from "sonner";

interface JSONToolPageProps {
    toolId: string;
}

export default function JSONToolPage({ toolId }: JSONToolPageProps) {
    const { config, setConfig } = useConfig();
    const { setErrors, setWarnings, setOnErrorClick } = useValidation();
    const metadata = toolMetadata[toolId] || toolMetadata['json-formatter'];
    const preset = toolPresets[toolId] || {};

    const [input, setInput] = useState("");
    const [formatted, setFormatted] = useState("");

    // Update validation results when input changes
    useEffect(() => {
        const validation = validateJson(input);
        setErrors(validation.errors);
        setWarnings(validation.warnings);
    }, [input, setErrors, setWarnings]);

    // Set up error click handler (could navigate to line in editor)
    useEffect(() => {
        setOnErrorClick((error) => {
            // This could be enhanced to scroll to the line in the editor
            console.log('Navigate to line', error.line);
            toast.info(`Error on line ${error.line}`);
        });
    }, [setOnErrorClick]);

    // Apply preset configuration when tool loads
    useEffect(() => {
        if (Object.keys(preset).length > 0) {
            setConfig((prevConfig: JSONFormatterConfig) => ({
                ...prevConfig,
                ...preset,
            }));
        }
    }, [toolId, preset, setConfig]);



    const handleCopy = async () => {
        try {
            if (formatted && formatted !== "❌ Invalid JSON") {
                await navigator.clipboard.writeText(formatted);
                toast.success("Copied to clipboard!");
            }
        } catch (err) {
            console.error('Failed to copy!', err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        try {
            if (formatted && formatted !== "❌ Invalid JSON") {
                const blob = new Blob([formatted], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'formatted.json';
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
    const handleClear = () => {
        setInput("");
        setFormatted("");
    };

    return (
        <>
            {/* <!-- PageHeading --> */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-1 pl-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary">{metadata.icon}</span>
                        <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">{metadata.title}</h1>
                    </div>
                    <p className="text-white/60 text-sm font-normal leading-normal">{metadata.description}</p>
                </div>
            </div>

            {/* <!-- Dual Pane Editor --> */}
            <JSONFormatter
                config={config}
                input={input}
                setInput={setInput}
                formatted={formatted}
                setFormatted={setFormatted}
                onCopy={handleCopy}
                onDownload={handleDownload}
            />

            {/* <!-- Bottom Action Bar --> */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 bg-background-dark/80 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClear}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        <span className="truncate">Clear</span>
                    </button>
                </div>
            </div>
        </>
    );
}
