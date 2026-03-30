"use client"

import { prettifyJson } from "@/core/lib/converters/prettifyJson";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JSONFormatterConfig } from "@/core/types/json-formatter-config";
import CodeEditor from "../../../components/CodeEditor";
import { toast } from "sonner";
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel";
import { diagnoseJson } from "@/core/lib/diagnostics/engine";
import { JsonIssue } from "@/core/types/diagnostics";
import DiagnosticsPanel from "@/app/components/DiagnosticsPanel";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";

interface JSONFormatterProps {
    config: JSONFormatterConfig;
    input: string;
    setInput: (value: string) => void;
    formatted: string;
    setFormatted: (value: string) => void;
}

export default function JSONFormatter({ config, input, setInput, formatted, setFormatted }: JSONFormatterProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [issues, setIssues] = useState<JsonIssue[]>([]);
    const [appliedFixIds, setAppliedFixIds] = useState<Set<string>>(new Set());
    const [inputSelection, setInputSelection] = useState<{ startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number } | null>(null);
    const [outputSelection, setOutputSelection] = useState<{ startLineNumber: number; startColumn: number; endLineNumber: number; endColumn: number } | null>(null);

    // 1. Diagnosis Effect: Runs when input changes
    useEffect(() => {
        if (!input.trim()) {
            setIssues([]);
            setAppliedFixIds(new Set());
            return;
        }

        const report = diagnoseJson(input, {
            allowComments: config.useJSON5,
            allowTrailingCommas: config.trailingCommas || config.useJSON5,
            allowSingleQuotes: config.quoteStyle === 'single' || config.useJSON5,
            allowUnquotedKeys: config.useJSON5,
            attemptLogStripping: true,
            attemptUnescaping: true,
            attemptPartialRepair: true
        });
        setIssues(report.issues);

        // Initialize with auto-applied fixes
        // We want to aggressively auto-repair in the preview for a "Paste -> Usable JSON" experience
        const autoFixes = new Set(report.issues
            .filter(i =>
                i.resolution.autoApplied ||
                i.type === 'FORMAT_ONLY' ||
                (i.type === 'SYNTAX_RECOVERABLE' && i.resolution.suggestedFixes.length > 0)
            )
            .map(i => i.id)
        );
        setAppliedFixIds(autoFixes);
    }, [input, config]);

    // 2. Output Generation Effect: Runs when input, issues, appliedFixIds, or config changes
    useEffect(() => {
        if (!input.trim()) {
            setFormatted("");
            setError(null);
            return;
        }

        // Apply patches based on appliedFixIds
        let patched = input;

        // Filter issues that are APPLIED and have a replacement
        const fixesToApply = issues.filter(i =>
            appliedFixIds.has(i.id) &&
            i.range &&
            i.resolution.suggestedFixes[0]?.replacement !== undefined
        );

        // Sort fixes by range start (descending) to avoid index shifts
        fixesToApply.sort((a, b) => (b.range?.start || 0) - (a.range?.start || 0));

        // Apply patches
        for (const fix of fixesToApply) {
            if (!fix.range) continue;
            const replacement = fix.resolution.suggestedFixes[0].replacement!;
            patched = patched.substring(0, fix.range.start) + replacement + patched.substring(fix.range.end);
        }

        // Try to format the patched JSON
        try {
            // prettifyJson uses JSON.stringify, so it requires valid JSON
            // If patches didn't fix everything (e.g. comments remain), this might fail
            const result = prettifyJson(patched, config);

            if (result) {
                setFormatted(result);
                setError(null);
            } else {
                // If prettify returns null (invalid JSON), show the patched source
                setFormatted(patched);
                // Determine if we have fatal errors remaining
                const remainingErrors = issues.filter(i => !appliedFixIds.has(i.id) && i.type === 'SYNTAX_FATAL');
                if (remainingErrors.length > 0) {
                    setError(remainingErrors[0].message);
                } else {
                    setError("Invalid JSON (Check syntax)");
                }
            }
        } catch (e) {
            setFormatted(patched);
            setError("Formatting Failed");
        }
    }, [input, issues, appliedFixIds, config, setFormatted]);

    const handleApplyFix = (issueId: string) => {
        setAppliedFixIds(prev => {
            const next = new Set(prev);
            if (next.has(issueId)) {
                next.delete(issueId);
                toast.info("Reverted the fix");
            } else {
                next.add(issueId);
                toast.success("Applied the fix");
            }
            return next;
        });
    };

    const handleApplyAllFixes = () => {
        const allRecoverable = issues.filter(i => i.type !== 'SYNTAX_FATAL').map(i => i.id);
        setAppliedFixIds(new Set(allRecoverable));
        toast.success("All safe fixes applied");
    };

    const handleSelectIssue = (issue: JsonIssue) => {
        if (issue.location) {
            const sel = {
                startLineNumber: issue.location.line,
                startColumn: issue.location.column,
                endLineNumber: issue.location.line,
                endColumn: issue.location.column + 1
            };
            setInputSelection(sel);
            setOutputSelection(sel);
        }
    };

    const handleQuickFix = () => {
        handleApplyAllFixes();
    };

    const handleCopy = () => {
        if (formatted) {
            navigator.clipboard.writeText(formatted);
            toast.success('Formatted JSON copied!');
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
            {/* Left Section: Input Editor */}
            <section className="flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background flex-1 min-h-[40vh] lg:w-[40%] lg:flex-[0.7] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-muted shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input Editor</span>

                    <div className="ml-auto flex gap-2 items-center">
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
                                    setFormatted("");
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
                        language={config.useJSON5 ? 'javascript' : 'json'}
                        onChange={(val) => {
                            setInput(val || '');
                        }}
                        onGenerate={() => { }} // Auto-generated via effect
                        onFix={handleQuickFix}
                        selection={inputSelection}
                        placeholder='{ "paste": "your json here" }'
                        className="rounded-none border-none bg-transparent"
                        minimal={true}
                    />
                </div>
            </section>

            {/* Right Section: Output Workspace */}
            <section className="flex flex-col bg-background w-full flex-1 min-h-[40vh] lg:w-[60%] lg:flex-[1.3] lg:min-h-0">
                <div className="flex flex-col border-b border-border shrink-0">
                    <div className="h-10 px-4 flex items-center justify-between bg-card border-b border-border overflow-x-auto whitespace-nowrap scrollbar-none">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Workspace</span>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {appliedFixIds.size > 0 && (
                                <div className="hidden sm:flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--warning)_20%,transparent)]" title={`${appliedFixIds.size} auto-repairs applied`}>
                                    <span className="material-symbols-outlined !text-[12px] text-warning">build</span>
                                    <span className="text-[10px] text-warning font-medium">Repaired {appliedFixIds.size}</span>
                                </div>
                            )}
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined !text-[12px] sm:text-sm">content_copy</span>
                                <span>Copy</span>
                            </button>
                            <button
                                onClick={() => {
                                    setFormatted("");
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
                <div className="flex-1 overflow-hidden relative bg-background flex flex-col sm:flex-row">
                    <div className="flex-1 relative overflow-hidden h-full w-full">
                        <CodeEditor
                            value={formatted}
                            language={config.useJSON5 ? 'javascript' : 'json'}
                            readOnly={true}
                            onGenerate={() => { }}
                            placeholder="// Formatted output will appear here..."
                            className="rounded-none border-none h-full"
                            selection={outputSelection}
                            focusOnSelection={false}
                        />
                    </div>
                    {/* Diagnostics Panel Overlay in Output - will be absolute in DiagnosticsPanel anyway */}
                    <DiagnosticsPanel
                        issues={issues}
                        appliedFixIds={appliedFixIds}
                        onApplyFix={handleApplyFix}
                        onApplyAll={handleApplyAllFixes}
                        onSelectIssue={handleSelectIssue}
                    />
                </div>
                <BottomConfigurationPanel />
            </section>
        </main>
    )
}
