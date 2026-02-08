"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';
import BottomConfigurationPanel from './BottomConfigurationPanel';
import { COMPLEX_JSON_SAMPLE } from '@/core/config/samples';

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

    // Auto-generate when input changes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (input.trim()) {
                try {
                    setIsGenerating(true);
                    setError(null);
                    // Basic JSON validation
                    try {
                        JSON.parse(input);
                    } catch (e) {
                        setError("Invalid JSON");
                        throw e; // rethrow to be caught below
                    }

                    const code = await generateCode(input);
                    setOutput(code);
                } catch (error: any) {
                    // setOutput(`// Error: ${error.message || 'Invalid JSON'}`);
                    // Keep previous output or clear? Maybe keep previous if valid?
                    // For now, let's just show error in the UI badge
                } finally {
                    setIsGenerating(false);
                }
            } else {
                setOutput('');
                setError(null);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [input, generateCode]);

    const router = useRouter();

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success('Code copied to clipboard!');
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">
            {/* Left Section: Input Editor */}
            <section className="flex-none lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background h-[45vh] lg:h-full min-h-[300px] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-muted/50 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input Editor</span>
                    <div className="ml-auto flex gap-2 items-center">
                        {error && (
                            <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/20 flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">error</span>
                                <span className="hidden sm:inline">{error}</span>
                                <span className="sm:hidden">Error</span>
                            </span>
                        )}
                        {!error && input.trim() && (
                            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded border border-success/20 flex items-center gap-1">
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
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-primary hover:bg-primary/90 text-primary-foreground rounded border 
                                border-primary/30 flex items-center gap-1 transition-colors"
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
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-secondary hover:bg-secondary/80 text-muted-foreground rounded border 
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
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/60 rounded transition-all 
                                flex items-center justify-center gap-1"
                                title="Clear Input"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                <span className="hidden xs:inline">Clear</span>
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
            <section className="flex-none lg:flex-1 flex flex-col bg-background w-full h-[55vh] lg:h-full min-h-[400px] lg:min-h-0">
                <div className="flex flex-col border-b border-border shrink-0">
                    <div className="h-10 px-4 flex items-center justify-between bg-card border-b border-border overflow-x-auto whitespace-nowrap scrollbar-none">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Workspace</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="hidden xs:flex items-center gap-1.5 bg-success/5 px-2 py-0.5 rounded border border-success/10">
                                <span className={`w-1.5 h-1.5 rounded-full bg-success ${isGenerating ? 'animate-pulse' : ''}`}></span>
                                <span className="text-[9px] text-success font-bold uppercase">Live</span>
                            </div>
                            <button
                                onClick={() => router.push('/tools/json/formatter')}
                                className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors shadow-sm"
                                title="Back to JSON Editor"
                            >
                                <span className="material-symbols-outlined !text-[12px] sm:text-sm">arrow_back</span>
                                <span className="hidden sm:inline">JSON Editor</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined !text-[12px] sm:text-sm">content_copy</span>
                                <span>Copy</span>
                            </button>
                            <button
                                onClick={() => {
                                    setOutput("");
                                }}
                                className="px-2 py-1 text-[11px] sm:text-[12px] bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/60 rounded transition-all 
                                flex items-center justify-center gap-1"
                                title="Clear Output"
                            >
                                <span className="material-symbols-outlined !text-[12px]">delete</span>
                                <span className="hidden xs:inline">Clear</span>
                            </button>
                        </div>
                    </div>
                    <div className="h-10 flex bg-muted/50 overflow-x-auto scrollbar-none">
                        <button className="flex-1 min-w-[80px] text-[10px] font-bold text-muted-foreground hover:text-foreground border-b-2 border-transparent uppercase tracking-wider transition-colors">Structure</button>
                        <button className="flex-1 min-w-[80px] text-[10px] font-bold text-muted-foreground hover:text-foreground border-b-2 border-transparent uppercase tracking-wider transition-colors">Transform</button>
                        <button className="flex-1 min-w-[80px] text-[10px] font-bold text-primary border-b-2 border-primary bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] uppercase tracking-wider transition-colors">Code</button>
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
