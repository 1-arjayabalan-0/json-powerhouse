"use client"

import { useState, useEffect } from "react";
import { useConfig } from "@/app/context/ConfigContext";
import { JSON5ConverterConfig, defaultJSON5Config } from "@/app/types/json5-converter-config";
import JSON5 from "json5";
import { toast } from "sonner";

type ConversionDirection = 'json-to-json5' | 'json5-to-json';

export default function JSON5ConverterPage() {
    const { config, setConfig } = useConfig();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [direction, setDirection] = useState<ConversionDirection>('json-to-json5');
    const [error, setError] = useState<string | null>(null);

    // Initialize config
    useEffect(() => {
        if (!('useJSON5' in config)) {
            setConfig(defaultJSON5Config);
        }
    }, []);

    const converterConfig = config as JSON5ConverterConfig;

    // Perform conversion
    useEffect(() => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        try {
            if (direction === 'json-to-json5') {
                // Parse as JSON, output as JSON5
                const parsed = JSON.parse(input);
                const json5Output = JSON5.stringify(parsed, null,
                    converterConfig.indentation === 'tab' ? '\t' :
                        converterConfig.indentation === '2' ? 2 : 4
                );
                setOutput(json5Output);
            } else {
                // Parse as JSON5, output as JSON
                const parsed = JSON5.parse(input);
                const jsonOutput = JSON.stringify(parsed, null,
                    converterConfig.indentation === 'tab' ? '\t' :
                        converterConfig.indentation === '2' ? 2 : 4
                );
                setOutput(jsonOutput);
            }
            setError(null);
        } catch (err: any) {
            setError(err.message || "Invalid input");
            setOutput("");
        }
    }, [input, direction, converterConfig]);

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success("Copied to clipboard!");
        }
    };

    const handleDownload = () => {
        if (!output) return;

        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = direction === 'json-to-json5' ? 'output.json5' : 'output.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Downloaded successfully!");
    };

    const toggleDirection = () => {
        setDirection(prev =>
            prev === 'json-to-json5' ? 'json5-to-json' : 'json-to-json5'
        );
        // Swap input and output
        const temp = input;
        setInput(output);
        setOutput(temp);
    };

    return (
        <div className="flex h-full gap-4 p-4 w-full">
            {/* Left Pane: Input */}
            <div className="flex-1 flex flex-col gap-2 min-w-[300px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold">
                        {direction === 'json-to-json5' ? 'JSON Input' : 'JSON5 Input'}
                    </h2>
                    <button
                        onClick={toggleDirection}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-600/90 transition-colors"
                        title="Swap conversion direction"
                    >
                        <span className="material-symbols-outlined text-base">swap_horiz</span>
                        Swap
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={direction === 'json-to-json5'
                        ? 'Paste your JSON here...'
                        : 'Paste your JSON5 here...'
                    }
                    className="flex-1 p-4 rounded-lg bg-white/5 text-white font-mono text-sm border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
            </div>

            {/* Right Pane: Output */}
            <div className="flex-1 flex flex-col gap-2 min-w-[300px]">
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-lg font-bold">
                        {direction === 'json-to-json5' ? 'JSON5 Output' : 'JSON Output'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-base">content_copy</span>
                            Copy
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!output}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-base">download</span>
                            Download
                        </button>
                    </div>
                </div>
                {error ? (
                    <div className="flex-1 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 text-xl">error</span>
                            <div>
                                <h3 className="text-red-500 font-semibold mb-1">Conversion Error</h3>
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Converted output will appear here..."
                        className="flex-1 p-4 rounded-lg bg-white/5 text-white font-mono text-sm border border-white/10 resize-none"
                    />
                )}
            </div>
        </div>
    );
}
