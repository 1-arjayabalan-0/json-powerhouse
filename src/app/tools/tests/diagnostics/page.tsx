
"use client"

import { useState, useEffect } from "react";
import { TEST_CASES, TestCase } from "@/core/lib/diagnostics/tests/cases";
import { runDiagnosticsTests, TestResult } from "@/core/lib/diagnostics/tests/runner";
import { toast } from "sonner";

export default function DiagnosticsTestPage() {
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedCase, setSelectedCase] = useState<TestCase | null>(null);
    const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

    const runTests = () => {
        setIsRunning(true);
        try {
            const results = runDiagnosticsTests(TEST_CASES);
            setResults(results);
            const passed = results.filter(r => r.passed).length;
            toast.success(`Ran ${results.length} tests. ${passed} passed.`);
        } catch (e) {
            toast.error("Failed to run tests");
            console.error(e);
        } finally {
            setIsRunning(false);
        }
    };

    // Auto-run on mount
    useEffect(() => {
        runTests();
    }, []);

    const handleSelect = (result: TestResult) => {
        const testCase = TEST_CASES.find(c => c.id === result.caseId) || null;
        setSelectedCase(testCase);
        setSelectedResult(result);
    };

    return (
        <div className="flex h-full flex-col bg-background text-muted-foreground">
            <header className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-foreground">JSON Diagnostics Test Suite</h1>
                    <p className="text-sm text-muted-foreground">Validation of the parsing, healing, and fixing engine.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={runTests}
                        disabled={isRunning}
                        className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded font-medium flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">play_arrow</span>
                        Rerun Tests
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Results List */}
                <div className="w-1/2 border-r border-border overflow-y-auto p-4">
                    <div className="space-y-2">
                        {results.map((res) => {
                            const testCase = TEST_CASES.find(c => c.id === res.caseId);
                            return (
                                <div 
                                    key={res.caseId}
                                    onClick={() => handleSelect(res)}
                                    className={`p-3 rounded border cursor-pointer transition-colors ${
                                        selectedResult?.caseId === res.caseId 
                                            ? 'bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border-[color-mix(in_srgb,var(--primary)_50%,transparent)]' 
                                            : 'bg-card border-border hover:border-border'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-foreground">{testCase?.name || res.caseId}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                            res.passed 
                                                ? 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success border border-[color-mix(in_srgb,var(--success)_20%,transparent)]' 
                                                : 'bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)]'
                                        }`}>
                                            {res.passed ? 'PASS' : 'FAIL'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{testCase?.description}</p>
                                    <div className="text-[10px] flex gap-2 text-muted-foreground">
                                        <span>Issues: {res.issuesFound}</span>
                                        <span>Status: {res.actualStatus}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Details View */}
                <div className="w-1/2 flex flex-col h-full">
                    {selectedCase && selectedResult ? (
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-border bg-muted/50">
                                <h2 className="font-bold text-foreground mb-1">{selectedCase.name}</h2>
                                <p className="text-sm text-muted-foreground">{selectedResult.message}</p>
                            </div>
                            
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 p-4 border-b border-border overflow-auto">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Input</label>
                                    <pre className="text-xs font-mono bg-muted/30 p-3 rounded border border-border overflow-auto whitespace-pre-wrap">
                                        {selectedCase.input}
                                    </pre>
                                </div>
                                <div className="flex-1 p-4 overflow-auto bg-background">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                                        Output (Fixed JSON)
                                    </label>
                                    {selectedResult.actualFixedJson ? (
                                        <pre className="text-xs font-mono text-success bg-muted/30 p-3 rounded border border-border overflow-auto whitespace-pre-wrap">
                                            {selectedResult.actualFixedJson}
                                        </pre>
                                    ) : (
                                        <div className="text-xs text-muted-foreground italic p-3">No fixed output generated.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <p>Select a test case to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
