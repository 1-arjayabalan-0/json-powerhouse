"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';
import BottomConfigurationPanel from './BottomConfigurationPanel';
import KeyboardShortcuts from './KeyboardShortcuts';
import { COMPLEX_JSON_SAMPLE } from '@/core/config/samples';
import { useAutoRepair } from '@/app/hooks/useAutoRepair';

interface CodeGeneratorBaseProps {
    language: string;
    languageDisplayName: string;
    fileExtension: string;
    input: string;
    setInput: (value: string) => void;
    output: string;
    setOutput: (value: string) => void;
    generateCode: (json: string) => Promise<string>;
}

export default function CodeGeneratorBase({
    language,
    languageDisplayName,
    fileExtension,
    input,
    setInput,
    output,
    setOutput,
    generateCode,
}: CodeGeneratorBaseProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('code');

    // Auto-repair broken JSON before code generation
    const { repaired, repairCount, isValid, error: repairError } = useAutoRepair(input);

    // Auto-generate when input changes (using repaired JSON)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (input.trim()) {
                try {
                    setIsGenerating(true);
                    setError(null);

                    // Use auto-repaired JSON instead of raw input
                    const jsonToUse = repaired;
                    if (!jsonToUse.trim()) {
                        setOutput('');
                        return;
                    }

                    // Validate the repaired JSON
                    try {
                        JSON.parse(jsonToUse);
                    } catch (e) {
                        setError(repairError || "Invalid JSON");
                        setOutput('');
                        return;
                    }

                    const code = await generateCode(jsonToUse);
                    setOutput(code);
                } catch (error: any) {
                    // Keep previous output on generation error
                } finally {
                    setIsGenerating(false);
                }
            } else {
                setOutput('');
                setError(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [input, repaired, generateCode]);

    const router = useRouter();

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success('Code copied to clipboard!');
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">
            <KeyboardShortcuts
                onCopyOutput={handleCopy}
            />
            {/* Left Section: Input Editor */}
            <section className="flex-none lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background min-h-[300px] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-muted shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input Editor</span>
                    <div className="ml-auto flex gap-1.5 sm:gap-2 items-center">
                        {error && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">error</span>
                                <span className="hidden sm:inline">{error}</span>
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
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-secondary hover:opacity-90 text-secondary-foreground rounded border 
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
                <div className="flex-1 overflow-hidden relative">
                    <CodeEditor
                        value={input}
                        onChange={(value) => setInput(value ?? '')}
                        language="json"
                        className="rounded-none border-none bg-transparent"
                    />
                </div>
            </section>

            {/* Right Section: Output Workspace */}
            <section className="flex-none lg:flex-1 flex flex-col bg-background w-full min-h-[400px] lg:min-h-0">
                <div className="flex flex-col border-b border-border shrink-0">
                    <div className="h-10 px-4 flex items-center justify-between bg-card border-b border-border overflow-x-auto whitespace-nowrap scrollbar-none">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Workspace</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {repairCount > 0 && (
                                <div className="hidden sm:flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--warning)_20%,transparent)]" title={`${repairCount} auto-repairs applied`}>
                                    <span className="material-symbols-outlined !text-[12px] text-warning">build</span>
                                    <span className="text-[10px] text-warning font-medium">Repaired {repairCount}</span>
                                </div>
                            )}
                            <div className="hidden xs:flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--success)_5%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--success)_10%,transparent)]">
                                <span className={`w-1.5 h-1.5 rounded-full bg-success ${isGenerating ? 'animate-pulse' : ''}`}></span>
                                <span className="text-[9px] text-success font-bold uppercase">Live</span>
                            </div>
                            <button
                                onClick={() => router.push('/tools/json/formatter')}
                                className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm"
                                title="Back to JSON Editor"
                            >
                                <span className="material-symbols-outlined !text-[12px] sm:text-sm">arrow_back</span>
                                <span className="hidden sm:inline">JSON Editor</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined !text-[12px] sm:text-sm">content_copy</span>
                                <span>Copy</span>
                            </button>
                            <button
                                onClick={() => {
                                    setOutput("");
                                }}
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] rounded transition-all 
                                flex items-center justify-center gap-1"
                                title="Clear Output"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                <span className="hidden xs:inline">Clear</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative bg-background">
                    <CodeEditor
                        value={output}
                        language={language}
                        readOnly={true}
                        placeholder={`// Generated ${languageDisplayName} code will appear here...`}
                        className="rounded-none border-none"
                    />
                </div>
                <BottomConfigurationPanel />
            </section>
        </main>
    );
}
