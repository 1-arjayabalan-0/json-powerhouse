"use client"

import { useState, useEffect } from "react";
import { useConfig } from "@/app/context/ConfigContext";
import { JSON5ConverterConfig, defaultJSON5Config } from "@/core/types/json5-converter-config";
import JSON5 from "json5";
import { toast } from "sonner";
import CodeEditor from "@/app/components/CodeEditor";
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";

type ConversionDirection = 'json-to-json5' | 'json5-to-json';

export default function JSON5ConverterClient() {
    const { config, setConfig } = useConfig();
    // Use persistent state for input, just like other tools
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
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

    // Helper to convert JSON to JSON5 while preserving comments
    const convertWithComments = (text: string, conf: JSON5ConverterConfig): string => {
        const tokens: { type: 'string' | 'comment' | 'text'; value: string }[] = [];
        const tokenRegex = /("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm;

        let lastIndex = 0;
        let match;

        while ((match = tokenRegex.exec(text)) !== null) {
            // Text before match
            if (match.index > lastIndex) {
                tokens.push({ type: 'text', value: text.substring(lastIndex, match.index) });
            }

            const fullMatch = match[0];
            if (match[1]) tokens.push({ type: 'string', value: fullMatch }); // Double quoted
            else if (match[2]) tokens.push({ type: 'string', value: fullMatch }); // Single quoted
            else if (match[3]) tokens.push({ type: 'comment', value: fullMatch }); // Block comment
            else if (match[4]) tokens.push({ type: 'comment', value: fullMatch }); // Line comment

            lastIndex = tokenRegex.lastIndex;
        }
        // Remaining text
        if (lastIndex < text.length) {
            tokens.push({ type: 'text', value: text.substring(lastIndex) });
        }

        // Process tokens
        let result = '';
        let pendingWhitespace = '';
        let lastSignificantChar: string | null = null;

        const flushWhitespace = () => {
            result += pendingWhitespace;
            pendingWhitespace = '';
        };

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token.type === 'comment') {
                flushWhitespace();
                result += token.value;
                continue;
            }

            if (token.type === 'string') {
                flushWhitespace();
                // Check if it's a key
                // Look ahead for colon in text tokens, skipping comments/whitespace
                let isKey = false;
                for (let j = i + 1; j < tokens.length; j++) {
                    const next = tokens[j];
                    if (next.type === 'comment') continue;
                    if (next.type === 'text') {
                        if (next.value.trim().startsWith(':')) {
                            isKey = true;
                        }
                        // Only check the first non-comment/non-empty text
                        if (next.value.trim().length > 0) break;
                    } else {
                        break; // Found another string before colon -> not a key
                    }
                }

                let content = token.value.substring(1, token.value.length - 1);
                let formattedString = token.value;

                // Handle unquoting keys
                if (isKey && conf.unquotedKeys) {
                    // Check validity
                    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(content)) {
                        formattedString = content;
                    } else if (conf.quoteStyle === 'single') {
                        // Fallback to single quotes if unquoting is not safe but single quotes requested
                        content = content.replace(/\\"/g, '"');
                        content = content.replace(/'/g, "\\'");
                        formattedString = `'${content}'`;
                    }
                } else if (conf.quoteStyle === 'single') {
                    // Convert to single quotes
                    content = content.replace(/\\"/g, '"');
                    content = content.replace(/'/g, "\\'");
                    formattedString = `'${content}'`;
                }

                result += formattedString;
                if (formattedString.length > 0) {
                    lastSignificantChar = formattedString[formattedString.length - 1];
                }
            } else if (token.type === 'text') {
                const chars = token.value.split('');
                for (const char of chars) {
                    if (/\s/.test(char)) {
                        pendingWhitespace += char;
                        continue;
                    }

                    if (char === '}' || char === ']') {
                        // Insert trailing comma if needed
                        if (conf.trailingCommas &&
                            lastSignificantChar &&
                            lastSignificantChar !== '{' &&
                            lastSignificantChar !== '[' &&
                            lastSignificantChar !== ',') {
                            result += ',';
                        }
                    }

                    flushWhitespace();
                    result += char;
                    lastSignificantChar = char;
                }
            }
        }

        flushWhitespace();
        return result;
    };

    const transformKeyCase = (key: string, caseType: JSON5ConverterConfig['keyCase']): string => {
        switch (caseType) {
            case 'camelCase':
                return key.replace(/[-_\s](.)/g, (_, char) => String(char).toUpperCase());
            case 'snake_case':
                return key
                    .replace(/[A-Z]/g, letter => `_${String(letter).toLowerCase()}`)
                    .replace(/[-\s]/g, '_');
            case 'kebab-case':
                return key
                    .replace(/[A-Z]/g, letter => `-${String(letter).toLowerCase()}`)
                    .replace(/[_\s]/g, '-');
            case 'PascalCase': {
                const camel = key.replace(/[-_\s](.)/g, (_, char) => String(char).toUpperCase());
                return camel.charAt(0).toUpperCase() + camel.slice(1);
            }
            default:
                return key;
        }
    };

    const transformValueKeys = (value: any, caseType: JSON5ConverterConfig['keyCase']): any => {
        if (caseType === 'none') return value;
        if (Array.isArray(value)) {
            return value.map(item => transformValueKeys(item, caseType));
        }
        if (value && typeof value === 'object') {
            const result: any = {};
            for (const [key, val] of Object.entries(value)) {
                const transformedKey = transformKeyCase(key, caseType);
                result[transformedKey] = transformValueKeys(val, caseType);
            }
            return result;
        }
        return value;
    };

    // Perform conversion
    useEffect(() => {
        if (!input.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        try {
            if (direction === 'json-to-json5') {
                if (converterConfig.stripComments) {
                    console.log("converterConfig", converterConfig);

                    const parsed = JSON5.parse(input);
                    const transformed = transformValueKeys(parsed, converterConfig.keyCase);
                    const space = converterConfig.indentation === 'tab' ? '\t' :
                        converterConfig.indentation === '2' ? 2 : 4;
                    const json5Output = JSON5.stringify(transformed, null, space);
                    console.log("json5Output", json5Output);

                    setOutput(json5Output);
                } else {
                    // Custom conversion to preserve comments
                    // We first validate the input using JSON5.parse to ensure it's valid
                    console.log("converterConfig:Else", converterConfig);

                    JSON5.parse(input);
                    const converted = convertWithComments(input, converterConfig);
                    setOutput(converted);
                }
            } else {
                const parsed = JSON5.parse(input);
                const transformed = transformValueKeys(parsed, converterConfig.keyCase);
                const space = converterConfig.indentation === 'tab' ? '\t' :
                    converterConfig.indentation === '2' ? 2 : 4;
                const jsonOutput = JSON.stringify(transformed, null, space);
                setOutput(jsonOutput);
            }
            setError(null);
        } catch (err: any) {
            setError(err.message || "Invalid input");
        }
    }, [input, direction, converterConfig]);

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success("Copied to clipboard!");
        }
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
        <main className="flex-1 flex overflow-hidden w-full">
            {/* Left Section: Input Editor */}
            <section className="flex-0.7 lg:w-[40%] flex flex-col border-r border-border">
                <div className="h-10 px-4 flex items-center justify-between bg-muted border-b border-border shrink-0">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        {direction === 'json-to-json5' ? 'JSON Input' : 'JSON5 Input'}
                    </span>
                    <div className="ml-auto flex gap-2">
                        {error && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">error</span>
                                Invalid
                            </span>
                        )}
                        {!error && input.trim() && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_20%,transparent)] flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">check</span>
                                Valid
                            </span>
                        )}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setInput(JSON.stringify(COMPLEX_JSON_SAMPLE, null, 2));
                                    toast.success('Sample JSON loaded');
                                }}
                                className="px-2 py-1 text-[12px] bg-primary hover:opacity-90 text-primary-foreground rounded border 
                                border-[color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center gap-1 transition-colors"
                                title="Load Sample JSON"
                            >
                                <span className="material-symbols-outlined !text-[12px]">auto_fix_high</span>
                                Sample
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
                                        toast.error('Failed to paste from clipboard');
                                    }
                                }}
                                className="ml-4 px-2 py-1 text-[12px] bg-secondary hover:opacity-90 text-secondary-foreground rounded border 
                                border-[color-mix(in_srgb,var(--secondary)_30%,transparent)] flex items-center gap-1 transition-colors"
                                title="Paste from clipboard"
                            >
                                <span className="material-symbols-outlined !text-[12px]">content_paste</span>
                                Paste
                            </button>
                            <button
                                onClick={() => {
                                    setInput("");
                                }}
                                className="px-2 py-1 text-[12px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] rounded text-xs transition-all 
                                flex items-center justify-center"
                                title="Clear Input"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                Clear
                            </button>

                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative h-full">
                    <CodeEditor
                        value={input}
                        language={direction === 'json-to-json5' ? 'json' : 'javascript'}
                        onChange={(val) => setInput(val || '')}
                        placeholder={direction === 'json-to-json5' ? 'Paste JSON here...' : 'Paste JSON5 here...'}
                        className="rounded-none border-none bg-transparent"
                    />
                </div>
                {/* Footer for Input */}
                <div className="p-3 border-t border-border bg-card">
                    <button
                        onClick={toggleDirection}
                        className="w-full py-2 px-3 bg-secondary hover:opacity-90 text-secondary-foreground rounded text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined !text-sm">swap_horiz</span>
                        Swap Direction ({direction === 'json-to-json5' ? 'JSON → JSON5' : 'JSON5 → JSON'})
                    </button>
                </div>
            </section>

            {/* Right Section: Output Workspace */}
            <section className="flex-1.3 lg:w-[60%] flex flex-col bg-background w-full">
                <div className="flex flex-col border-b border-border shrink-0">
                    <div className="h-10 px-4 flex items-center justify-between bg-muted border-b border-border">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Workspace</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--success)_5%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_10%,transparent)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                <span className="text-[9px] text-success font-bold uppercase">Live</span>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-1 text-xs font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm shadow-[color-mix(in_srgb,var(--primary)_20%,transparent)]"
                            >
                                <span className="material-symbols-outlined !text-sm">content_copy</span>
                                Copy
                            </button>
                            <button
                                onClick={() => {
                                    setOutput("");
                                }}
                                className="px-2 py-1 text-[12px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_60%,transparent)] rounded text-xs transition-all 
                                flex items-center justify-center"
                                title="Clear Output"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative bg-background">
                    <CodeEditor
                        value={output}
                        language={direction === 'json-to-json5' ? 'javascript' : 'json'}
                        readOnly={true}
                        className="rounded-none border-none bg-transparent"
                    />
                </div>
                <BottomConfigurationPanel />
            </section>
        </main>
    );
}
