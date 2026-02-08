import { JsonIssue } from "@/core/types/diagnostics";
import { cn } from "@/app/lib/utils";
import { useState } from "react";

interface DiagnosticsPanelProps {
    issues: JsonIssue[];
    appliedFixIds: Set<string>;
    onApplyFix: (issueId: string) => void;
    onApplyAll: () => void;
    onSelectIssue?: (issue: JsonIssue) => void;
}

export default function DiagnosticsPanel({ issues, appliedFixIds, onApplyFix, onApplyAll, onSelectIssue }: DiagnosticsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (issues.length === 0) return null;

    const recoverable = issues.filter(i => i.type !== 'SYNTAX_FATAL');
    const allIssues = issues;

    return (
        <div className={cn(
            "flex flex-col bg-card border-t sm:border-t-0 sm:border-l border-border shadow-2xl z-20 transition-all duration-300 ease-in-out h-auto sm:h-full shrink-0",
            isExpanded ? "w-full sm:w-[320px]" : "w-full sm:w-12 h-10 sm:h-full"
        )}>
            {/* Header */}
            <div
                className={cn(
                    "flex items-center bg-muted/80 border-b border-border cursor-pointer hover:bg-muted transition-colors shrink-0 backdrop-blur-sm",
                    isExpanded ? "justify-between px-4 h-10" : "flex-row sm:flex-col justify-center h-full sm:h-auto sm:py-4 gap-4"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-muted-foreground !text-lg">
                                chevron_right
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Diagnostics</span>
                            <div className="flex gap-2">
                                {issues.length > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-secondary border border-input text-[12px] text-white font-mono flex items-center gap-1 font-bold">
                                        {issues.length}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            {recoverable.length > 0 && (
                                <button
                                    onClick={onApplyAll}
                                    className="px-2 py-0.5 text-[10px] font-medium bg-success hover:bg-success/90 text-success-foreground rounded transition-colors flex items-center gap-1"
                                    title="Apply All Safe Fixes"
                                >
                                    <span className="material-symbols-outlined !text-[12px]">done_all</span>
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-muted-foreground !text-lg">
                            chevron_left
                        </span>
                        <div
                            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:rotate-180 whitespace-nowrap sm:[writing-mode:vertical-rl]"
                        >
                            Diagnostics
                        </div>
                        {issues.length > 0 && (
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-secondary border border-[color-mix(in_srgb,var(--secondary),transparent)] text-[12px] text-white font-mono">
                                {issues.length}
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="flex-1 overflow-y-auto divide-y divide-border bg-card/90">
                    {allIssues.map((issue, idx) => {
                        const isApplied = appliedFixIds.has(issue.id);
                        return (
                            <div
                                key={`${issue.id}-${idx}`}
                                onClick={() => onSelectIssue?.(issue)}
                                className={cn(
                                    "px-4 py-2 flex items-start gap-3 group transition-colors border-l-2 cursor-pointer",
                                    isApplied
                                        ? "bg-[color-mix(in_srgb,var(--success)_5%,transparent)] hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)] border-[color-mix(in_srgb,var(--success)_50%,transparent)]"
                                        : "hover:bg-[color-mix(in_srgb,var(--muted)_5%,transparent)] border-transparent"
                                )}
                            >
                                <div className="pt-0.5 shrink-0">
                                    {isApplied ? (
                                        <span className="material-symbols-outlined !text-[16px] text-success">check_circle</span>
                                    ) : issue.type === 'SYNTAX_FATAL' ? (
                                        <span className="material-symbols-outlined !text-[16px] text-destructive">cancel</span>
                                    ) : issue.resolution.mode === 'suggestion' ? (
                                        <span className="material-symbols-outlined !text-[16px] text-warning">lightbulb</span>
                                    ) : (
                                        <span className="material-symbols-outlined !text-[16px] text-primary">construction</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={cn(
                                            "text-[11px] font-mono",
                                            isApplied ? "text-success line-through opacity-70" :
                                                issue.type === 'SYNTAX_FATAL' ? "text-destructive" : "text-muted-foreground"
                                        )}>
                                            Line {issue.location.line}, Col {issue.location.column}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] px-1.5 rounded border uppercase",
                                            isApplied
                                                ? "bg-[color-mix(in_srgb,var(--success)_10%,transparent)] border-[color-mix(in_srgb,var(--success)_20%,transparent)] text-success"
                                                : issue.type === 'SYNTAX_FATAL'
                                                    ? "bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive"
                                                    : "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border-[color-mix(in_srgb,var(--primary)_20%,transparent)] text-primary"
                                        )}>
                                            {isApplied ? "Fixed" : issue.type === 'SYNTAX_FATAL' ? "Error" : "Issue"}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {issue.message}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {issue.type !== 'SYNTAX_FATAL' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onApplyFix(issue.id);
                                            }}
                                            className={cn(
                                                "p-1.5 rounded transition-colors",
                                                isApplied
                                                    ? "bg-[color-mix(in_srgb,var(--success)_20%,transparent)] text-success hover:bg-[color-mix(in_srgb,var(--success)_30%,transparent)]"
                                                    : "bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] text-primary hover:bg-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
                                            )}
                                            title={isApplied ? "Undo fix" : "Apply fix"}
                                        >
                                            <span className="material-symbols-outlined !text-[16px]">
                                                {isApplied ? 'undo' : 'auto_fix'}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
