"use client"

import { useState, useEffect } from "react";
import { toast } from "sonner";
import CodeEditor from "@/app/components/CodeEditor";
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel";
import KeyboardShortcuts from "@/app/components/KeyboardShortcuts";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useAutoRepair } from "@/app/hooks/useAutoRepair";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";
import { cn } from "@/app/lib/utils";
import {
    TransformOperation,
    TransformOperationType,
    CaseType,
    generateOpId,
} from "@/core/lib/transformations/types";
import { transformJson } from "@/core/lib/transformations/engine";

const OPERATION_LABELS: Record<TransformOperationType, string> = {
    'rename-key': 'Rename Key',
    'remove-key': 'Remove Key',
    'case-convert': 'Convert Case',
    'extract-subtree': 'Extract Subtree',
    'flatten': 'Flatten',
    'unflatten': 'Unflatten',
};

const OPERATION_ICONS: Record<TransformOperationType, string> = {
    'rename-key': 'edit',
    'remove-key': 'delete',
    'case-convert': 'text_fields',
    'extract-subtree': 'content_cut',
    'flatten': 'layers',
    'unflatten': 'account_tree',
};

export default function JSONTransformClient() {
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [operations, setOperations] = useState<TransformOperation[]>([]);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [undoStack, setUndoStack] = useState<string[]>([]);

    const { repaired, repairCount } = useAutoRepair(input);

    // Apply transformations when input or operations change
    useEffect(() => {
        const jsonToUse = repaired || input;
        if (!jsonToUse.trim()) {
            setOutput("");
            setError(null);
            return;
        }

        const result = transformJson(jsonToUse, operations);
        if (result.error) {
            setError(result.error);
            setOutput("");
        } else {
            setError(null);
            setOutput(result.output);
        }
    }, [input, repaired, operations]);

    const addOperation = (type: TransformOperationType) => {
        const op: TransformOperation = {
            id: generateOpId(),
            type,
            enabled: true,
            separator: '.',
            scope: 'keys',
        };
        setOperations(prev => [...prev, op]);
    };

    const updateOperation = (id: string, updates: Partial<TransformOperation>) => {
        setOperations(prev =>
            prev.map(op => op.id === id ? { ...op, ...updates } : op)
        );
    };

    const removeOperation = (id: string) => {
        setOperations(prev => prev.filter(op => op.id !== id));
    };

    const moveOperation = (id: string, direction: 'up' | 'down') => {
        setOperations(prev => {
            const idx = prev.findIndex(op => op.id === id);
            if (idx === -1) return prev;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= prev.length) return prev;
            const arr = [...prev];
            [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
            return arr;
        });
    };

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success("Copied to clipboard!");
        }
    };

    const handleApplyToInput = () => {
        if (output) {
            setUndoStack(prev => [...prev.slice(-10), input]);
            setInput(output);
            setOperations([]);
            toast.success("Output applied to input");
        }
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            const prev = undoStack[undoStack.length - 1];
            setUndoStack(stack => stack.slice(0, -1));
            setInput(prev);
            toast.success("Undone");
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
            <KeyboardShortcuts onCopyOutput={handleCopy} />

            {/* Left: Input Editor */}
            <section className="flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background flex-1 min-h-[30vh] lg:w-[35%] lg:flex-[0.6] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-muted shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input</span>
                    <div className="ml-auto flex gap-2 items-center">
                        {repairCount > 0 && (
                            <div className="hidden sm:flex items-center gap-1 bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--warning)_20%,transparent)]">
                                <span className="material-symbols-outlined !text-[10px] text-warning">build</span>
                                <span className="text-[10px] text-warning font-medium">Repaired {repairCount}</span>
                            </div>
                        )}
                        <button
                            onClick={() => { setInput(JSON.stringify(COMPLEX_JSON_SAMPLE, null, 2)); toast.success('Sample loaded'); }}
                            className="px-2 py-1 text-[11px] sm:text-[12px] bg-primary hover:opacity-90 text-primary-foreground rounded border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined !text-[12px]">auto_fix_high</span> Sample
                        </button>
                        <button
                            onClick={async () => {
                                try { const t = await navigator.clipboard.readText(); if (t) { setInput(t); toast.success('Pasted'); } }
                                catch { toast.error('Failed to paste'); }
                            }}
                            className="px-2 py-1 text-[11px] sm:text-[12px] bg-secondary hover:opacity-90 text-secondary-foreground rounded border border-border flex items-center gap-1 transition-colors"
                        >
                            <span className="material-symbols-outlined !text-[12px]">content_paste</span> Paste
                        </button>
                        <button onClick={() => setInput("")} className="px-2 py-1 text-[11px] sm:text-[12px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] rounded flex items-center gap-1">
                            <span className="material-symbols-outlined !text-[12px]">delete</span> Clear
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <CodeEditor
                        value={input}
                        language="json"
                        onChange={(val) => setInput(val || '')}
                        placeholder='{ "paste": "your json here" }'
                        className="rounded-none border-none bg-transparent"
                        minimal
                    />
                </div>
            </section>

            {/* Center: Operation Builder */}
            <section className="flex flex-col border-b lg:border-b-0 lg:border-r border-border bg-card lg:w-[30%] lg:flex-[0.4] min-h-[25vh] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-muted shrink-0 justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Operations</span>
                    <div className="flex items-center gap-1">
                        {undoStack.length > 0 && (
                            <button onClick={handleUndo} className="px-2 py-1 text-[10px] bg-secondary hover:opacity-80 text-secondary-foreground rounded border border-border" title="Undo last apply">
                                <span className="material-symbols-outlined !text-[12px]">undo</span>
                            </button>
                        )}
                        {output && (
                            <button onClick={handleApplyToInput} className="px-2 py-1 text-[10px] bg-primary hover:opacity-90 text-primary-foreground rounded" title="Apply output to input for chaining">
                                <span className="material-symbols-outlined !text-[12px]">arrow_forward</span> Apply
                            </button>
                        )}
                    </div>
                </div>

                {/* Operation List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {operations.map((op, idx) => (
                        <OperationCard
                            key={op.id}
                            op={op}
                            index={idx}
                            total={operations.length}
                            onUpdate={(updates) => updateOperation(op.id, updates)}
                            onRemove={() => removeOperation(op.id)}
                            onMoveUp={() => moveOperation(op.id, 'up')}
                            onMoveDown={() => moveOperation(op.id, 'down')}
                        />
                    ))}

                    {/* Add Operation Dropdown */}
                    <div className="border border-dashed border-border rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground mb-2 font-bold uppercase">Add Operation</p>
                        <div className="grid grid-cols-2 gap-1.5">
                            {(Object.keys(OPERATION_LABELS) as TransformOperationType[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => addOperation(type)}
                                    className="flex items-center gap-1.5 px-2 py-1.5 text-[11px] bg-muted/50 hover:bg-muted rounded border border-border transition-colors text-left"
                                >
                                    <span className="material-symbols-outlined !text-[14px] text-primary">{OPERATION_ICONS[type]}</span>
                                    {OPERATION_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Right: Output */}
            <section className="flex flex-col bg-background flex-1 min-h-[30vh] lg:w-[35%] lg:flex-[0.6] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center justify-between bg-card shrink-0">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Output</span>
                    <div className="flex items-center gap-2">
                        {operations.length > 0 && operations.filter(o => o.enabled).length > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                {operations.filter(o => o.enabled).length} ops
                            </span>
                        )}
                        {error && (
                            <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded border border-destructive/20 flex items-center gap-1">
                                <span className="material-symbols-outlined !text-[10px]">error</span>
                                Error
                            </span>
                        )}
                        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-[12px] font-medium bg-primary hover:opacity-90 text-primary-foreground rounded transition-colors shadow-sm">
                            <span className="material-symbols-outlined !text-[12px] sm:text-sm">content_copy</span> Copy
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <CodeEditor
                        value={output}
                        language="json"
                        readOnly
                        placeholder="// Transformed output will appear here..."
                        className="rounded-none border-none"
                    />
                </div>
                <BottomConfigurationPanel />
            </section>
        </main>
    );
}

// Operation Card Component
function OperationCard({
    op,
    index,
    total,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown,
}: {
    op: TransformOperation;
    index: number;
    total: number;
    onUpdate: (updates: Partial<TransformOperation>) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    return (
        <div className={cn(
            "border rounded-lg p-3 transition-opacity",
            op.enabled ? "border-border bg-card" : "border-border/50 bg-card/50 opacity-60"
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined !text-[16px] text-primary">{OPERATION_ICONS[op.type]}</span>
                    <span className="text-xs font-bold">{OPERATION_LABELS[op.type]}</span>
                    <span className="text-[9px] text-muted-foreground">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onMoveUp} disabled={index === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <span className="material-symbols-outlined !text-[14px]">arrow_upward</span>
                    </button>
                    <button onClick={onMoveDown} disabled={index === total - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <span className="material-symbols-outlined !text-[14px]">arrow_downward</span>
                    </button>
                    <button onClick={() => onUpdate({ enabled: !op.enabled })} className={cn("p-0.5", op.enabled ? "text-success" : "text-muted-foreground")}>
                        <span className="material-symbols-outlined !text-[14px]">{op.enabled ? 'check_circle' : 'cancel'}</span>
                    </button>
                    <button onClick={onRemove} className="p-0.5 text-destructive hover:text-destructive/80">
                        <span className="material-symbols-outlined !text-[14px]">close</span>
                    </button>
                </div>
            </div>

            {/* Operation-specific fields */}
            <div className="space-y-1.5">
                {(op.type === 'rename-key' || op.type === 'remove-key' || op.type === 'extract-subtree') && (
                    <input
                        type="text"
                        value={op.path || ''}
                        onChange={(e) => onUpdate({ path: e.target.value })}
                        placeholder="Path (e.g. user.address)"
                        className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
                    />
                )}
                {op.type === 'rename-key' && (
                    <input
                        type="text"
                        value={op.newKey || ''}
                        onChange={(e) => onUpdate({ newKey: e.target.value })}
                        placeholder="New key name"
                        className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
                    />
                )}
                {op.type === 'remove-key' && (
                    <input
                        type="text"
                        value={op.pattern || ''}
                        onChange={(e) => onUpdate({ pattern: e.target.value })}
                        placeholder="Or regex pattern (e.g. ^_)"
                        className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
                    />
                )}
                {op.type === 'case-convert' && (
                    <div className="flex gap-1.5">
                        <select
                            value={op.caseType || 'camelCase'}
                            onChange={(e) => onUpdate({ caseType: e.target.value as CaseType })}
                            className="flex-1 bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                        >
                            <option value="camelCase">camelCase</option>
                            <option value="snake_case">snake_case</option>
                            <option value="kebab-case">kebab-case</option>
                            <option value="PascalCase">PascalCase</option>
                        </select>
                        <select
                            value={op.scope || 'keys'}
                            onChange={(e) => onUpdate({ scope: e.target.value as 'keys' | 'values' | 'both' })}
                            className="w-24 bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                        >
                            <option value="keys">Keys</option>
                            <option value="values">Values</option>
                            <option value="both">Both</option>
                        </select>
                    </div>
                )}
                {(op.type === 'flatten' || op.type === 'unflatten') && (
                    <input
                        type="text"
                        value={op.separator || '.'}
                        onChange={(e) => onUpdate({ separator: e.target.value })}
                        placeholder="Separator (default: .)"
                        className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary/50"
                    />
                )}
            </div>
        </div>
    );
}
