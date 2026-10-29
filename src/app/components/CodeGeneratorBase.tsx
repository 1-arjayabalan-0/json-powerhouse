"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CodeEditor from './CodeEditor';
import KeyboardShortcuts from './KeyboardShortcuts';
import { COMPLEX_JSON_SAMPLE } from '@/core/config/samples';
import { useAutoRepair } from '@/app/hooks/useAutoRepair';
import EditorPane, { StatusBadge } from '@/app/components/shell/EditorPane';
import PaneButton from '@/app/components/shell/PaneButton';
import { CircleAlert, Check, Sparkles, ClipboardPaste, Trash2, Wrench, Copy, Download, ArrowLeft } from 'lucide-react';

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

    const handleDownload = () => {
        if (!output) return;
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `model.${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
            <KeyboardShortcuts
                onCopyOutput={handleCopy}
            />
            {/* Left Section: Input Editor */}
            <EditorPane
                label="JSON input"
                className="md:border-r border-border md:w-1/2 min-h-[45vh] md:min-h-0"
                status={error
                    ? <StatusBadge tone="error"><CircleAlert className="size-3" /><span className="hidden sm:inline max-w-[240px] truncate">{error}</span><span className="sm:hidden">Error</span></StatusBadge>
                    : input.trim() ? <StatusBadge tone="ok"><Check className="size-3" />Valid</StatusBadge> : null}
                actions={<>
                    <PaneButton icon={Sparkles} label="Sample" onClick={() => {
                        setInput(JSON.stringify(COMPLEX_JSON_SAMPLE, null, 2));
                        toast.success('Sample JSON loaded');
                    }} />
                    <PaneButton icon={ClipboardPaste} label="Paste" onClick={async () => {
                        try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                                setInput(text);
                                toast.success('Pasted from clipboard');
                            }
                        } catch (err) {
                            toast.error('Failed to paste');
                        }
                    }} />
                    <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={() => {
                        setInput("");
                    }} />
                </>}
            >
                <CodeEditor
                    value={input}
                    onChange={(value) => setInput(value ?? '')}
                    language="json"
                    className="rounded-none border-none bg-transparent"
                />
            </EditorPane>

            {/* Right Section: Output Workspace */}
            <EditorPane
                label={`${languageDisplayName} output`}
                className="md:w-1/2 min-h-[45vh] md:min-h-0"
                status={<>
                    {repairCount > 0 && <StatusBadge tone="warn"><Wrench className="size-3" />Repaired {repairCount}</StatusBadge>}
                    <StatusBadge tone="ok"><span className={`size-1.5 rounded-full bg-success ${isGenerating ? 'animate-pulse' : ''}`}></span>Live</StatusBadge>
                </>}
                actions={<>
                    <PaneButton icon={ArrowLeft} label="JSON Editor" onClick={() => router.push('/tools/json/formatter')} />
                    <PaneButton icon={Copy} label="Copy" variant="primary" onClick={handleCopy} hideLabelOnMobile={false} />
                    <PaneButton icon={Download} label="Download" onClick={handleDownload} />
                    <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={() => {
                        setOutput("");
                    }} />
                </>}
            >
                <CodeEditor
                    value={output}
                    language={language}
                    readOnly={true}
                    placeholder={`// Generated ${languageDisplayName} code will appear here...`}
                    className="rounded-none border-none"
                />
            </EditorPane>
        </div>
    );
}
