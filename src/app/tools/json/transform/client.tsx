"use client"

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeftToLine, CircleAlert, ClipboardPaste, Copy, Layers, Sparkles, Trash2, Undo2, Wrench } from "lucide-react";
import CodeEditor from "@/app/components/CodeEditor";
import KeyboardShortcuts from "@/app/components/KeyboardShortcuts";
import EditorPane, { StatusBadge } from "@/app/components/shell/EditorPane";
import PaneButton from "@/app/components/shell/PaneButton";
import type { TransformConfig } from "@/app/components/settings/TransformSettings";
import { useConfig } from "@/app/context/ConfigContext";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useAutoRepair } from "@/app/hooks/useAutoRepair";
import { COMPLEX_JSON_SAMPLE } from "@/core/config/samples";
import { transformJson } from "@/core/lib/transformations/engine";

export default function JSONTransformClient() {
    const { config, setConfig } = useConfig();
    const operations = useMemo(() => (config as TransformConfig).operations ?? [], [config]);
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [undoStack, setUndoStack] = useState<string[]>([]);

    const { repaired, repairCount } = useAutoRepair(input);

    // Operations come from the per-tool config, edited in the right-hand panel.
    const { output, error } = useMemo(() => {
        const jsonToUse = repaired || input;
        if (!jsonToUse.trim()) return { output: "", error: null as string | null };
        const result = transformJson(jsonToUse, operations);
        return result.error ? { output: "", error: result.error } : { output: result.output, error: null };
    }, [input, repaired, operations]);

    const activeCount = operations.filter(op => op.enabled).length;

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
            setConfig((prev: TransformConfig) => ({ ...prev, operations: [] }));
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
        <div className="flex h-full min-h-0 w-full flex-col md:flex-row">
            <KeyboardShortcuts onCopyOutput={handleCopy} />

            <EditorPane
                label="Input"
                className="min-h-[45vh] border-border md:min-h-0 md:w-1/2 md:border-r"
                status={repairCount > 0 ? <StatusBadge tone="warn"><Wrench className="size-3" />Repaired {repairCount}</StatusBadge> : null}
                actions={<>
                    <PaneButton icon={Sparkles} label="Sample" onClick={() => { setInput(JSON.stringify(COMPLEX_JSON_SAMPLE, null, 2)); toast.success('Sample loaded'); }} />
                    <PaneButton
                        icon={ClipboardPaste}
                        label="Paste"
                        onClick={async () => {
                            try { const t = await navigator.clipboard.readText(); if (t) { setInput(t); toast.success('Pasted'); } }
                            catch { toast.error('Failed to paste'); }
                        }}
                    />
                    {undoStack.length > 0 && <PaneButton icon={Undo2} label="Undo" onClick={handleUndo} />}
                    <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={() => setInput("")} />
                </>}
            >
                <CodeEditor
                    value={input}
                    language="json"
                    onChange={(val) => setInput(val || '')}
                    placeholder='{ "paste": "your json here" }'
                    className="rounded-none border-none bg-transparent"
                    minimal
                />
            </EditorPane>

            <EditorPane
                label="Output"
                className="min-h-[45vh] md:min-h-0 md:w-1/2"
                status={error
                    ? <StatusBadge tone="error"><CircleAlert className="size-3" /><span className="hidden max-w-[220px] truncate sm:inline">{error}</span></StatusBadge>
                    : activeCount > 0 ? <StatusBadge tone="ok"><Layers className="size-3" />{activeCount} {activeCount === 1 ? 'operation' : 'operations'}</StatusBadge> : null}
                actions={<>
                    <PaneButton icon={ArrowLeftToLine} label="Use as input" onClick={handleApplyToInput} disabled={!output} />
                    <PaneButton icon={Copy} label="Copy" variant="primary" onClick={handleCopy} hideLabelOnMobile={false} />
                </>}
            >
                {operations.length === 0 && !error && (
                    <p className="pointer-events-none absolute inset-x-0 bottom-4 z-10 mx-auto w-fit rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm">
                        Add operations in Settings to transform the input.
                    </p>
                )}
                <CodeEditor
                    value={output}
                    language="json"
                    readOnly
                    placeholder="// Transformed output will appear here..."
                    className="rounded-none border-none"
                />
            </EditorPane>
        </div>
    );
}
