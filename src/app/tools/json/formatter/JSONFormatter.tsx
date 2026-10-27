"use client"

import { prettifyJson } from "@/core/lib/converters/prettifyJson";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JSONFormatterConfig } from "@/core/types/json-formatter-config";
import CodeEditor from "../../../components/CodeEditor";
import { toast } from "sonner";
import { diagnoseJson } from "@/core/lib/diagnostics/engine";
import { JsonIssue } from "@/core/types/diagnostics";
import DiagnosticsPanel from "@/app/components/DiagnosticsPanel";
import KeyboardShortcuts from "@/app/components/KeyboardShortcuts";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";
import EditorPane, { StatusBadge } from "@/app/components/shell/EditorPane";
import PaneButton from "@/app/components/shell/PaneButton";
import { CircleAlert, Check, Sparkles, ClipboardPaste, Trash2, Wrench, Copy, Download } from "lucide-react";

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

    const handleDownload = () => {
        if (!formatted) return;
        const blob = new Blob([formatted], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
            <KeyboardShortcuts
                onProcess={() => {
                    // Ctrl+Enter: Apply all fixes + reformat
                    handleApplyAllFixes();
                }}
                onCopyOutput={handleCopy}
            />
            {/* Left Section: Input Editor */}
            <EditorPane
                label="Input"
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
                        setFormatted("");
                    }} />
                </>}
            >
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
            </EditorPane>

            {/* Right Section: Output Workspace */}
            <EditorPane
                label="Output"
                className="md:w-1/2 min-h-[45vh] md:min-h-0"
                status={appliedFixIds.size > 0 ? <StatusBadge tone="warn"><Wrench className="size-3" />Repaired {appliedFixIds.size}</StatusBadge> : null}
                actions={<>
                    <PaneButton icon={Copy} label="Copy" variant="primary" onClick={handleCopy} hideLabelOnMobile={false} />
                    <PaneButton icon={Download} label="Download" onClick={handleDownload} />
                    <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={() => {
                        setFormatted("");
                    }} />
                </>}
            >
                <div className="flex h-full flex-col sm:flex-row">
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
            </EditorPane>
        </div>
    )
}
