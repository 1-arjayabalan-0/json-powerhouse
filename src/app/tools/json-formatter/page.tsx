"use client"

import JSONFormatter from "./JSONFormatter";
import { useConfig } from "@/app/context/ConfigContext";
import { useValidation } from "@/app/context/ValidationContext";
import { useState, useEffect } from "react";
import { validateJson } from "@/core/lib/converters/validateJson";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

export default function JSONFormatterPage() {
    const { config } = useConfig();
    const { setErrors, setWarnings, setOnErrorClick } = useValidation();
    const [input, setInput] = useState("");
    const [formatted, setFormatted] = useState("");

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
                    <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">JSON Formatter</h1>
                    <p className="text-white/60 text-sm font-normal leading-normal">Paste your JSON below to format it instantly.</p>
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
                    <Button
                        onClick={handleClear}
                        variant="secondary"
                        className="h-10 px-4 bg-white/10 text-white hover:bg-white/20"
                    >
                        <span className="material-symbols-outlined text-xl mr-2">delete</span>
                        <span className="truncate">Clear</span>
                    </Button>
                </div>
            </div>
        </>
    );
}