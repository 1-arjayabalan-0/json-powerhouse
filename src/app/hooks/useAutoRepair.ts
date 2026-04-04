"use client"

import { useState, useEffect, useCallback } from "react";
import { diagnoseJson } from "@/core/lib/diagnostics/engine";
import { JsonIssue } from "@/core/types/diagnostics";

export interface AutoRepairOptions {
    allowComments?: boolean;
    allowTrailingCommas?: boolean;
    allowSingleQuotes?: boolean;
    allowUnquotedKeys?: boolean;
}

export interface AutoRepairResult {
    /** Issues found in the input */
    issues: JsonIssue[];
    /** Set of issue IDs that were auto-applied */
    appliedFixIds: Set<string>;
    /** The repaired JSON string (with auto-fixes applied) */
    repaired: string;
    /** Number of issues that were auto-repaired */
    repairCount: number;
    /** Whether the input was valid (no issues or all fixed) */
    isValid: boolean;
    /** Error message if JSON is still invalid after repair */
    error: string | null;
    /** Apply or revert a specific fix */
    toggleFix: (issueId: string) => void;
    /** Apply all safe fixes */
    applyAllFixes: () => void;
}

/**
 * Shared hook for auto-repairing broken JSON.
 * Used by ALL tools that accept JSON input.
 *
 * Core principle: "Paste anything -> get usable JSON"
 */
export function useAutoRepair(input: string, options: AutoRepairOptions = {}): AutoRepairResult {
    const [issues, setIssues] = useState<JsonIssue[]>([]);
    const [appliedFixIds, setAppliedFixIds] = useState<Set<string>>(new Set());

    // Run diagnostics when input or options change
    useEffect(() => {
        if (!input.trim()) {
            setIssues([]);
            setAppliedFixIds(new Set());
            return;
        }

        const report = diagnoseJson(input, {
            allowComments: options.allowComments ?? false,
            allowTrailingCommas: options.allowTrailingCommas ?? false,
            allowSingleQuotes: options.allowSingleQuotes ?? false,
            allowUnquotedKeys: options.allowUnquotedKeys ?? false,
            attemptLogStripping: true,
            attemptUnescaping: true,
            attemptPartialRepair: true,
        });

        setIssues(report.issues);

        // Aggressively auto-repair: apply auto-applied, FORMAT_ONLY, and SYNTAX_RECOVERABLE fixes
        const autoFixes = new Set(
            report.issues
                .filter(
                    (i) =>
                        i.resolution.autoApplied ||
                        i.type === "FORMAT_ONLY" ||
                        (i.type === "SYNTAX_RECOVERABLE" && i.resolution.suggestedFixes.length > 0)
                )
                .map((i) => i.id)
        );
        setAppliedFixIds(autoFixes);
    }, [input, options.allowComments, options.allowTrailingCommas, options.allowSingleQuotes, options.allowUnquotedKeys]);

    // Compute the repaired string
    const getRepaired = useCallback((): string => {
        if (!input.trim()) return "";

        let patched = input;

        const fixesToApply = issues
            .filter(
                (i) =>
                    appliedFixIds.has(i.id) &&
                    i.range &&
                    i.resolution.suggestedFixes[0]?.replacement !== undefined
            )
            .sort((a, b) => (b.range?.start || 0) - (a.range?.start || 0));

        for (const fix of fixesToApply) {
            if (!fix.range) continue;
            const replacement = fix.resolution.suggestedFixes[0].replacement!;
            patched = patched.substring(0, fix.range.start) + replacement + patched.substring(fix.range.end);
        }

        return patched;
    }, [input, issues, appliedFixIds]);

    const repaired = getRepaired();
    const repairCount = appliedFixIds.size;

    // Validate the repaired string
    let isValid = false;
    let error: string | null = null;

    if (input.trim()) {
        try {
            JSON.parse(repaired);
            isValid = true;
        } catch (e: any) {
            error = e.message || "Invalid JSON";
            // Check if we used JSON5/global fix
            const remainingFatal = issues.filter(
                (i) => !appliedFixIds.has(i.id) && i.type === "SYNTAX_FATAL"
            );
            if (remainingFatal.length === 0 && repairCount > 0) {
                // All fatal issues were fixed, likely JSON5-only issues remain
                isValid = false;
                error = "JSON has non-standard syntax (try JSON5 mode)";
            }
        }
    }

    const toggleFix = useCallback(
        (issueId: string) => {
            setAppliedFixIds((prev) => {
                const next = new Set(prev);
                if (next.has(issueId)) {
                    next.delete(issueId);
                } else {
                    next.add(issueId);
                }
                return next;
            });
        },
        []
    );

    const applyAllFixes = useCallback(() => {
        const allSafe = issues.filter((i) => i.type !== "SYNTAX_FATAL").map((i) => i.id);
        setAppliedFixIds(new Set(allSafe));
    }, [issues]);

    return {
        issues,
        appliedFixIds,
        repaired,
        repairCount,
        isValid,
        error,
        toggleFix,
        applyAllFixes,
    };
}
