"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { parseTree, findNodeAtLocation, modify, applyEdits } from "jsonc-parser"
import { toast } from "sonner"
import {
    Download,
    FileJson,
    RotateCcw,
    RotateCw,
    Copy,
    LayoutList,
    Network,
    ArrowBigLeft,
    ArrowBigRight,
    ChevronRight,
    ChevronLeft,
    Database,
    ClipboardPaste,
    Trash2,
    ClipboardList,
    History,
    ListFilter,
    ArrowRightLeft,
    CheckCircle2,
    Info,
    ArrowRight,
    MoveRight,
    MoveLeft
} from "lucide-react"

import CodeEditor from "@/app/components/CodeEditor"
import { cn } from "@/app/lib/utils"
import { JsonDiffConfig, DiffNode } from "@/core/types/diff-config"
import { DiffStrategy } from "@/core/lib/diff/types"
import { parseAndDiff, DiffResult } from "@/core/lib/diff/engine"
import { Button } from "@/app/components/ui/button"
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel"
import { useConfig } from "@/app/context/ConfigContext"
import { DIFF_SAMPLES } from "@/core/config/samples"
import DiffNodeRenderer from "./DiffNodeRenderer"
import ChangeLogList from "./ChangeLogList"

// --- Types ---

type Change =
    | { id: string; kind: "add"; path: string; value: any; included: boolean }
    | { id: string; kind: "remove"; path: string; oldValue: any; included: boolean }
    | { id: string; kind: "replace"; path: string; oldValue: any; newValue: any; included: boolean }

type HistoryEntry = {
    originalInput: string;
    modifiedInput: string;
    label: string;
}

// --- Helpers ---

function getLocation(text: string, offset: number) {
    let line = 0;
    let column = 0;
    for (let i = 0; i < offset; i++) {
        if (text[i] === '\n') {
            line++;
            column = 0;
        } else {
            column++;
        }
    }
    return { line, column };
}

function flattenDiffNodes(node: DiffNode): DiffNode[] {
    const nodes: DiffNode[] = []
    const traverse = (n: DiffNode) => {
        if (n.changeType !== 'unchanged') {
            nodes.push(n)
        } else if (n.children) {
            n.children.forEach(traverse)
        }
    }
    traverse(node)
    return nodes
}

function flattenDiffTree(node: DiffNode): Change[] {
    const changes: Change[] = []

    const traverse = (n: DiffNode) => {
        if (n.changeType === "added") {
            changes.push({
                id: `add-${n.path}`,
                kind: "add",
                path: n.path,
                value: n.newValue,
                included: true
            })
        } else if (n.changeType === "removed") {
            changes.push({
                id: `remove-${n.path}`,
                kind: "remove",
                path: n.path,
                oldValue: n.oldValue,
                included: true
            })
        } else if (n.changeType === "modified" || n.changeType === "type-changed") {
            if (n.children && n.children.length > 0) {
                n.children.forEach(traverse)
            } else {
                changes.push({
                    id: `replace-${n.path}`,
                    kind: "replace",
                    path: n.path,
                    oldValue: n.oldValue,
                    newValue: n.newValue,
                    included: true
                })
            }
        } else if (n.children) {
            n.children.forEach(traverse)
        }
    }

    traverse(node)
    return changes
}

export function UnifiedJsonDiffMerge() {
    const { config } = useConfig();

    // -- State --
    const [originalInput, setOriginalInput] = useState<string>("")
    const [modifiedInput, setModifiedInput] = useState<string>("")

    const [diffResult, setDiffResult] = useState<DiffResult | null>(null)
    const [changes, setChanges] = useState<Change[]>([])
    const [isComputing, setIsComputing] = useState(false)
    const [isChangelogExpanded, setIsChangelogExpanded] = useState(true)
    const [activeSidebarTab, setActiveSidebarTab] = useState<'structure' | 'changes'>('changes')

    const [undoStack, setUndoStack] = useState<HistoryEntry[]>([])
    const [redoStack, setRedoStack] = useState<HistoryEntry[]>([])

    // Editor Refs & Alignment
    const leftEditorRef = useRef<any>(null)
    const rightEditorRef = useRef<any>(null)
    const leftViewZones = useRef<string[]>([])
    const rightViewZones = useRef<string[]>([])
    const isSyncingScroll = useRef(false)

    // Selection State
    const [leftSelection, setLeftSelection] = useState<any | null>(null)
    const [rightSelection, setRightSelection] = useState<any | null>(null)

    // Decoration State
    const [leftDecorations, setLeftDecorations] = useState<any[]>([])
    const [rightDecorations, setRightDecorations] = useState<any[]>([])

    const leftNodeMap = useRef<Map<number, DiffNode>>(new Map())
    const rightNodeMap = useRef<Map<number, DiffNode>>(new Map())
    const leftHighlightedLines = useRef<Set<number>>(new Set())
    const rightHighlightedLines = useRef<Set<number>>(new Set())

    // Gutter types for multi-action rows
    type GutterAction = {
        type: 'leftToRight' | 'rightToLeft';
        node: DiffNode;
    }
    type GutterZone = {
        top: number;
        actions: GutterAction[];
    }

    const [gutterZones, setGutterZones] = useState<GutterZone[]>([])
    const gutterUpdateTimer = useRef<any>(null)

    // Derived strategy from global config
    const strategy = config.diffStrategy === 'merge-patch-7396'
        ? DiffStrategy.MERGE_PATCH_7396
        : DiffStrategy.JSON_PATCH_6902;

    const canUndo = undoStack.length > 0
    const canRedo = redoStack.length > 0

    const pushUndo = (label: string) => {
        setUndoStack(prev => [...prev, { originalInput, modifiedInput, label }]);
        setRedoStack([]);
    }

    const handleUndo = () => {
        setUndoStack(prev => {
            if (prev.length === 0) {
                toast.info("Nothing to undo");
                return prev;
            }
            const last = prev[prev.length - 1];
            setRedoStack(rprev => [...rprev, { originalInput, modifiedInput, label: last.label }]);
            setOriginalInput(last.originalInput);
            setModifiedInput(last.modifiedInput);
            return prev.slice(0, -1);
        });
    }

    const handleRedo = () => {
        setRedoStack(prev => {
            if (prev.length === 0) {
                toast.info("Nothing to redo");
                return prev;
            }
            const last = prev[prev.length - 1];
            setUndoStack(uprev => [...uprev, { originalInput, modifiedInput, label: last.label }]);
            setOriginalInput(last.originalInput);
            setModifiedInput(last.modifiedInput);
            return prev.slice(0, -1);
        });
    }

    // -- JSON Patch Result Logic --
    const resultJson = useMemo(() => {
        const includedChanges = changes.filter(c => c.included)
        const patch = includedChanges.map(c => ({
            op: c.kind === "replace" ? "replace" : c.kind === "add" ? "add" : "remove",
            path: c.path,
            ...(c.kind !== "remove" ? { value: (c as any).newValue || (c as any).value } : {})
        }))
        return JSON.stringify(patch, null, 2)
    }, [changes])

    // -- Handlers --

    const handleCompare = () => {
        if (!originalInput && !modifiedInput) {
            setDiffResult(null);
            setChanges([]);
            setLeftDecorations([]);
            setRightDecorations([]);
            return;
        }

        setIsComputing(true)
        setTimeout(() => {
            try {
                const result = parseAndDiff(originalInput, modifiedInput, config)
                setDiffResult(result)

                if (!result.error) {
                    const flatChanges = flattenDiffTree(result.root)
                    setChanges(flatChanges)
                    generateDecorations(result, originalInput, modifiedInput)
                } else {
                    setLeftDecorations([]);
                    setRightDecorations([]);
                }
            } catch (e) {
                console.error(e);
                toast.error("Diff failed")
            } finally {
                setIsComputing(false)
            }
        }, 10)
    }

    // Auto-compare
    useEffect(() => {
        const timer = setTimeout(handleCompare, 600)
        return () => clearTimeout(timer)
    }, [originalInput, modifiedInput, config])

    // Central Gutter & Scroll/Layout Sync
    useEffect(() => {
        const updateGutter = () => {
            const leftEditor = leftEditorRef.current;
            const rightEditor = rightEditorRef.current;
            if (!leftEditor || !rightEditor || !diffResult) return;

            const zoneMap = new Map<number, GutterAction[]>();
            const leftScroll = leftEditor.getScrollTop();
            const lineHeight = (leftEditor as any).getOption?.(66) || 20;

            const visibleRanges = leftEditor.getVisibleRanges();
            if (!visibleRanges || visibleRanges.length === 0) return;

            const startLine = visibleRanges[0].startLineNumber;
            const endLine = visibleRanges[0].endLineNumber;

            for (let lineNum = startLine; lineNum <= endLine; lineNum++) {
                const isLeftHighlighted = leftHighlightedLines.current.has(lineNum);
                const isRightHighlighted = rightHighlightedLines.current.has(lineNum);

                if (isLeftHighlighted || isRightHighlighted) {
                    const leftNode = leftNodeMap.current.get(lineNum);
                    const rightNode = rightNodeMap.current.get(lineNum);
                    const node = leftNode || rightNode;
                    if (!node) continue;

                    const actions: GutterAction[] = [];

                    if (isLeftHighlighted && (node.changeType === 'removed' || node.changeType === 'modified' || node.changeType === 'type-changed')) {
                        actions.push({ type: 'leftToRight', node });
                    }
                    if (isRightHighlighted && (node.changeType === 'added' || node.changeType === 'modified' || node.changeType === 'type-changed')) {
                        actions.push({ type: 'rightToLeft', node });
                    }

                    if (actions.length > 0) {
                        const top = leftEditor.getTopForLineNumber(lineNum);
                        // 24 is the height of .merge-arrow-row defined in CSS
                        const y = top - leftScroll + (lineHeight - 24) / 2 + 7;

                        // Merge actions if they land on the same visual line (common for modifications)
                        const existing = zoneMap.get(y) || [];
                        zoneMap.set(y, [...existing, ...actions]);
                    }
                }
            }

            const zones: GutterZone[] = Array.from(zoneMap.entries()).map(([top, actions]) => ({
                top,
                actions
            }));

            setGutterZones(zones);
        };

        const syncScroll = (source: any, target: any) => {
            if (isSyncingScroll.current) return;
            isSyncingScroll.current = true;
            target.setScrollTop(source.getScrollTop());
            target.setScrollLeft(source.getScrollLeft());

            if (gutterUpdateTimer.current) cancelAnimationFrame(gutterUpdateTimer.current);
            gutterUpdateTimer.current = requestAnimationFrame(updateGutter);

            setTimeout(() => { isSyncingScroll.current = false; }, 10);
        };

        const leftEditor = leftEditorRef.current;
        const rightEditor = rightEditorRef.current;
        if (!leftEditor || !rightEditor) return;

        const disposableLeft = leftEditor.onDidScrollChange(() => syncScroll(leftEditor, rightEditor));
        const disposableRight = rightEditor.onDidScrollChange(() => syncScroll(rightEditor, leftEditor));
        const disposableLeftLayout = leftEditor.onDidLayoutChange(updateGutter);
        const disposableRightLayout = rightEditor.onDidLayoutChange(updateGutter);

        updateGutter();

        return () => {
            disposableLeft.dispose();
            disposableRight.dispose();
            disposableLeftLayout.dispose();
            disposableRightLayout.dispose();
        };
    }, [diffResult, originalInput, modifiedInput]);

    const generateDecorations = (result: DiffResult, leftTxt: string, rightTxt: string) => {
        if (result.error) return;

        const leftDecs: any[] = [];
        const rightDecs: any[] = [];

        leftNodeMap.current.clear();
        rightNodeMap.current.clear();
        leftHighlightedLines.current.clear();
        rightHighlightedLines.current.clear();

        const leftTree = parseTree(leftTxt);
        const rightTree = parseTree(rightTxt);

        const processNode = (node: DiffNode) => {
            if (node.changeType === 'unchanged' && !node.children) return;

            const isContainerChange = node.children && node.children.length > 0;

            if (!isContainerChange) {
                // Left Side
                if (node.leftPathSegments && leftTree && (node.changeType === 'removed' || node.changeType === 'modified' || node.changeType === 'type-changed')) {
                    const jsonNode = findNodeAtLocation(leftTree, node.leftPathSegments);
                    if (jsonNode) {
                        const start = getLocation(leftTxt, jsonNode.offset);
                        const end = getLocation(leftTxt, jsonNode.offset + jsonNode.length);
                        const range = {
                            startLineNumber: start.line + 1,
                            startColumn: start.column + 1,
                            endLineNumber: end.line + 1,
                            endColumn: end.column + 1
                        };

                        const leftLines = leftTxt.split('\n');
                        const rightLines = rightTxt.split('\n');

                        for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
                            leftNodeMap.current.set(i, node);

                            const currentLineText = leftLines[i - 1]?.trim();

                            // If it's a structural line (brace, comma-only) and exists on the other side, skip it
                            // Or if the exact text exists anywhere in the other side's local range
                            // For simplicity and performance, we check if it's identical to the line at the same index
                            // which is a good heuristic for formatted JSON.
                            const isIdentical = currentLineText === (rightLines[i - 1] || "").trim();

                            if (isIdentical && currentLineText.length > 0) continue;

                            leftHighlightedLines.current.add(i);
                            leftDecs.push({
                                range: {
                                    startLineNumber: i,
                                    startColumn: 1,
                                    endLineNumber: i,
                                    endColumn: 1
                                },
                                options: {
                                    className: node.changeType === 'removed' ? 'diff-removed-line' : 'diff-modified-line',
                                    isWholeLine: true,
                                    linesDecorationsClassName: node.changeType === 'removed' ? 'diff-removed-gutter' : 'diff-modified-gutter'
                                }
                            });
                        }
                    }
                }

                // Right Side
                if (node.rightPathSegments && rightTree && (node.changeType === 'added' || node.changeType === 'modified' || node.changeType === 'type-changed')) {
                    const jsonNode = findNodeAtLocation(rightTree, node.rightPathSegments);
                    if (jsonNode) {
                        const start = getLocation(rightTxt, jsonNode.offset);
                        const end = getLocation(rightTxt, jsonNode.offset + jsonNode.length);
                        const range = {
                            startLineNumber: start.line + 1,
                            startColumn: start.column + 1,
                            endLineNumber: end.line + 1,
                            endColumn: end.column + 1
                        };

                        const leftLines = leftTxt.split('\n');
                        const rightLines = rightTxt.split('\n');

                        for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
                            rightNodeMap.current.set(i, node);

                            const currentLineText = rightLines[i - 1]?.trim();
                            const isIdentical = currentLineText === (leftLines[i - 1] || "").trim();

                            if (isIdentical && currentLineText.length > 0) continue;

                            rightHighlightedLines.current.add(i);
                            rightDecs.push({
                                range: {
                                    startLineNumber: i,
                                    startColumn: 1,
                                    endLineNumber: i,
                                    endColumn: 1
                                },
                                options: {
                                    className: node.changeType === 'added' ? 'diff-added-line' : 'diff-modified-line',
                                    isWholeLine: true,
                                    linesDecorationsClassName: node.changeType === 'added' ? 'diff-added-gutter' : 'diff-modified-gutter'
                                }
                            });
                        }
                    }
                }
            }

            if (node.children) node.children.forEach(processNode);
        };

        processNode(result.root);
        setLeftDecorations(leftDecs);
        setRightDecorations(rightDecs);

        // Calculate Alignment Gaps (View Zones)
        alignEditors(result, leftTxt, rightTxt, leftTree, rightTree);
    }

    const alignEditors = (result: DiffResult, leftTxt: string, rightTxt: string, leftTree: any, rightTree: any) => {
        if (!leftEditorRef.current || !rightEditorRef.current || !leftTree || !rightTree) return;

        leftEditorRef.current.changeViewZones((accessor: any) => {
            leftViewZones.current.forEach(id => accessor.removeZone(id));
            leftViewZones.current = [];
        });
        rightEditorRef.current.changeViewZones((accessor: any) => {
            rightViewZones.current.forEach(id => accessor.removeZone(id));
            rightViewZones.current = [];
        });

        // Step 1: Collect "Sync Points" (Nodes that exist on both sides)
        const syncPoints: { l: number, r: number }[] = [];
        syncPoints.push({ l: 0, r: 0 }); // Virtual start

        const traverse = (node: DiffNode) => {
            if (node.changeType !== 'added' && node.changeType !== 'removed') {
                if (node.leftPathSegments && node.rightPathSegments) {
                    const lNode = findNodeAtLocation(leftTree, node.leftPathSegments);
                    const rNode = findNodeAtLocation(rightTree, node.rightPathSegments);
                    if (lNode && rNode) {
                        const lLine = getLocation(leftTxt, lNode.offset).line + 1;
                        const rLine = getLocation(rightTxt, rNode.offset).line + 1;
                        syncPoints.push({ l: lLine, r: rLine });
                    }
                }
                if (node.children) node.children.forEach(traverse);
            }
        };
        traverse(result.root);

        // Add virtual end
        const leftTotal = leftTxt.split('\n').length;
        const rightTotal = rightTxt.split('\n').length;
        syncPoints.push({ l: leftTotal + 1, r: rightTotal + 1 });

        // Step 2: Ensure monotonicity and remove duplicates to prevent "crossing" gaps
        syncPoints.sort((a, b) => a.l - b.l || a.r - b.r);

        const cleanPoints: { l: number, r: number }[] = [];
        let lastL = -1;
        let lastR = -1;
        for (const p of syncPoints) {
            // Only keep points that strictly increase on both sides
            if (p.l > lastL && p.r > lastR) {
                cleanPoints.push(p);
                lastL = p.l;
                lastR = p.r;
            }
        }

        const leftGaps = new Map<number, number>();
        const rightGaps = new Map<number, number>();

        // Step 3: Align regions between sync points
        for (let i = 0; i < cleanPoints.length - 1; i++) {
            const start = cleanPoints[i];
            const end = cleanPoints[i + 1];

            // Number of lines *between* these two sync points
            const regionLeftHeight = end.l - start.l - 1;
            const regionRightHeight = end.r - start.r - 1;

            if (regionRightHeight > regionLeftHeight) {
                // Right is taller, add gap to Left
                const gap = regionRightHeight - regionLeftHeight;
                // Add gap at the end of the left region to push the NEXT sync point down
                const pivot = Math.max(0, end.l - 1);
                leftGaps.set(pivot, (leftGaps.get(pivot) || 0) + gap);
            } else if (regionLeftHeight > regionRightHeight) {
                // Left is taller, add gap to Right
                const gap = regionLeftHeight - regionRightHeight;
                const pivot = Math.max(0, end.r - 1);
                rightGaps.set(pivot, (rightGaps.get(pivot) || 0) + gap);
            }
        }

        // Step 4: Apply zones (descending order)
        leftEditorRef.current.changeViewZones((accessor: any) => {
            Array.from(leftGaps.entries())
                .sort((a, b) => b[0] - a[0])
                .forEach(([line, height]) => {
                    leftViewZones.current.push(accessor.addZone({
                        afterLineNumber: line,
                        heightInLines: height,
                        domNode: document.createElement('div'),
                        className: 'diff-view-zone-gap'
                    }));
                });
        });

        rightEditorRef.current.changeViewZones((accessor: any) => {
            Array.from(rightGaps.entries())
                .sort((a, b) => b[0] - a[0])
                .forEach(([line, height]) => {
                    rightViewZones.current.push(accessor.addZone({
                        afterLineNumber: line,
                        heightInLines: height,
                        domNode: document.createElement('div'),
                        className: 'diff-view-zone-gap'
                    }));
                });
        });
    };

    const handleNodeClick = (node: DiffNode) => {
        // Highlight logic for clicking tree nodes
        if (node.leftPathSegments && originalInput) {
            const tree = parseTree(originalInput);
            if (tree) {
                const jsonNode = findNodeAtLocation(tree, node.leftPathSegments);
                if (jsonNode) {
                    const start = getLocation(originalInput, jsonNode.offset);
                    const end = getLocation(originalInput, jsonNode.offset + jsonNode.length);
                    setLeftSelection({
                        startLineNumber: start.line + 1,
                        startColumn: start.column + 1,
                        endLineNumber: end.line + 1,
                        endColumn: end.column + 1
                    });
                }
            }
        }
        if (node.rightPathSegments && modifiedInput) {
            const tree = parseTree(modifiedInput);
            if (tree) {
                const jsonNode = findNodeAtLocation(tree, node.rightPathSegments);
                if (jsonNode) {
                    const start = getLocation(modifiedInput, jsonNode.offset);
                    const end = getLocation(modifiedInput, jsonNode.offset + jsonNode.length);
                    setRightSelection({
                        startLineNumber: start.line + 1,
                        startColumn: start.column + 1,
                        endLineNumber: end.line + 1,
                        endColumn: end.column + 1
                    });
                }
            }
        }
    }

    const handleMerge = (node: DiffNode, direction: 'leftToRight' | 'rightToLeft') => {
        const options = { formattingOptions: { insertSpaces: true, tabSize: 2 } };

        try {
            if (direction === 'leftToRight') {
                pushUndo(`Merge A → B: ${node.path}`);
                // Determine target text and path
                const targetText = modifiedInput;
                const path = node.rightPathSegments || node.leftPathSegments;
                if (!path) {
                    toast.error("Could not resolve path for merge");
                    return;
                }

                let valueToSet: any;
                if (node.changeType === 'added') {
                    // It's added in Right, so to sync Left->Right we must revert it (remove it)
                    valueToSet = undefined;
                } else if (node.changeType === 'removed') {
                    // It's removed in Right, we restore it from Left
                    valueToSet = node.oldValue;
                } else {
                    // Modified or Type-changed, set to Left's value
                    valueToSet = node.oldValue;
                }

                // Apply edit surgically
                const edits = modify(targetText, path, valueToSet, options);
                const updatedContent = applyEdits(targetText, edits);

                // Atomic update to prevent race conditions with auto-compare
                setModifiedInput(updatedContent);

                // Immediately update tree locally for responsiveness if possible, 
                // but handleCompare will catch it anyway.
                toast.success("Synchronized Right side");
            } else {
                pushUndo(`Merge B → A: ${node.path}`);
                // Copy Right -> Left (Apply Right's changes to Left)
                const targetText = originalInput;
                const path = node.leftPathSegments || node.rightPathSegments;
                if (!path) {
                    toast.error("Could not resolve path for merge");
                    return;
                }

                let valueToSet: any;
                if (node.changeType === 'removed') {
                    // It's removed in Left relative to Right, so remove it from Left too
                    valueToSet = undefined;
                } else if (node.changeType === 'added') {
                    // It's added in Right, so push it to Left
                    valueToSet = node.newValue;
                } else {
                    // Modified or Type-changed, set to Right's value
                    valueToSet = node.newValue;
                }

                const edits = modify(targetText, path, valueToSet, options);
                const updatedContent = applyEdits(targetText, edits);

                setOriginalInput(updatedContent);
                toast.success("Synchronized Left side");
            }
        } catch (e) {
            console.error("Merge failed", e);
            toast.error("Structural mismatch: Please format both JSONs first");
        }
    };


    const handleBatchMerge = (nodes: DiffNode[], direction: 'leftToRight' | 'rightToLeft') => {
        const options = { formattingOptions: { insertSpaces: true, tabSize: 2 } };
        let currentContent = direction === 'leftToRight' ? modifiedInput : originalInput;

        try {
            pushUndo(direction === 'leftToRight'
                ? `Batch merge A → B (${nodes.length})`
                : `Batch merge B → A (${nodes.length})`);
            // Sort nodes by path length (deepest first) to avoid invalidating parent paths
            // though jsonc-parser.modify is path-based, this is a safer heuristic for sequential edits.
            const sortedNodes = [...nodes].sort((a, b) =>
                (b.path?.split('.').length || 0) - (a.path?.split('.').length || 0)
            );

            sortedNodes.forEach(node => {
                const path = direction === 'leftToRight'
                    ? (node.rightPathSegments || node.leftPathSegments)
                    : (node.leftPathSegments || node.rightPathSegments);

                if (!path) return;

                let valueToSet: any;
                if (direction === 'leftToRight') {
                    // Sync A -> B: Use A's value. If B added it, remove it.
                    valueToSet = node.changeType === 'added' ? undefined : node.oldValue;
                } else {
                    // Apply B -> A: Use B's value. If A removed it, add it back.
                    valueToSet = node.changeType === 'removed' ? undefined : node.newValue;
                }

                const edits = modify(currentContent, path, valueToSet, options);
                currentContent = applyEdits(currentContent, edits);
            });

            if (direction === 'leftToRight') setModifiedInput(currentContent);
            else setOriginalInput(currentContent);

            toast.success(`Synchronized ${nodes.length} items`);
        } catch (e) {
            console.error("Batch sync failed", e);
            toast.error("Structural sync failed. Please compare again.");
        }
    };

    const handleExport = () => {
        let content = ""
        const included = changes.filter(c => c.included)
        if (strategy === DiffStrategy.JSON_PATCH_6902) {
            content = JSON.stringify(included.map(c => ({
                op: c.kind === "replace" ? "replace" : c.kind === "add" ? "add" : "remove",
                path: c.path,
                ...(c.kind !== "remove" ? { value: (c as any).newValue || (c as any).value } : {})
            })), null, 2)
        } else {
            const patch: any = {}
            included.forEach(c => {
                const parts = c.path.split("/").filter(Boolean)
                let o = patch
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!o[parts[i]]) o[parts[i]] = {}
                    o = o[parts[i]]
                }
                o[parts[parts.length - 1]] = c.kind === "remove" ? null : (c as any).newValue || (c as any).value
            })
            content = JSON.stringify(patch, null, 2)
        }
        const blob = new Blob([content], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `json-diff-merge-patch.json`
        a.click()
        toast.success("Strategic Patch Exported")
    }

    const handleCopyResult = () => {
        if (resultJson) {
            navigator.clipboard.writeText(resultJson);
            toast.success("Patch result copied to clipboard!");
        }
    }

    const handleCopySummary = () => {
        const included = changes.filter(c => c.included);
        if (included.length === 0) {
            toast.error("No changes included in the summary");
            return;
        }

        const stats = {
            added: included.filter((c: any) => c.kind === 'add').length,
            removed: included.filter((c: any) => c.kind === 'remove').length,
            modified: included.filter((c: any) => c.kind === 'replace').length,
        };

        const summaryText = [
            "📋 JSON MODIFICATION SUMMARY",
            "============================",
            `✅ Selected Changes: ${included.length}`,
            `➕ Added: ${stats.added}`,
            `➖ Removed: ${stats.removed}`,
            `📝 Modified: ${stats.modified}`,
            "",
            "Affected Paths (First 25):",
            ...included.slice(0, 25).map(c => `• [${c.kind.toUpperCase()}] ${c.path || '(root)'}`),
            included.length > 25 ? `... and ${included.length - 25} more.` : "",
            "",
            "Generated by JSON PowerHouse"
        ].filter(line => line !== null).join("\n");

        navigator.clipboard.writeText(summaryText);
        toast.success("Change summary copied!");
    }

    const handleLoadSample = () => {
        pushUndo("Load sample data");
        setOriginalInput(JSON.stringify(DIFF_SAMPLES.baseline, null, 2))
        setModifiedInput(JSON.stringify(DIFF_SAMPLES.modified, null, 2))
        toast.success("Sample diff data loaded")
    }

    const handlePasteA = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                pushUndo("Paste Baseline A");
                setOriginalInput(text);
                toast.success('Pasted to Baseline A');
            }
        } catch (err) {
            toast.error('Failed to paste');
        }
    }

    const handlePasteB = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                pushUndo("Paste Modified B");
                setModifiedInput(text);
                toast.success('Pasted to Modified B');
            }
        } catch (err) {
            toast.error('Failed to paste');
        }
    }

    return (
        <main className="flex-1 flex flex-col overflow-hidden w-full bg-background h-full pb-12 lg:pb-0">
            <style jsx global>{`
                .diff-removed-line { background-color: color-mix(in srgb, var(--destructive), transparent 85%); }
                .diff-added-line { background-color: color-mix(in srgb, var(--success), transparent 85%); }
                .diff-modified-line { background-color: color-mix(in srgb, var(--warning), transparent 85%); }
                
                .diff-removed-gutter { background-color: color-mix(in srgb, var(--destructive), transparent 60%); width: 5px !important; margin-left: 0px; }
                .diff-added-gutter { background-color: color-mix(in srgb, var(--success), transparent 60%); width: 5px !important; margin-left: 0px; }
                .diff-modified-gutter { background-color: color-mix(in srgb, var(--warning), transparent 60%); width: 5px !important; margin-left: 0px; }

                .merge-gutter-btn {
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    cursor: pointer;
                    z-index: 30;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                .merge-gutter-btn:hover {
                    transform: translateX(-50%) scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    z-index: 31;
                }
                .merge-gutter-btn.success { background-color: var(--success); color: white; }
                .merge-gutter-btn.warning { background-color: var(--warning); color: #000; }
                .merge-gutter-btn.success:hover { background-color: color-mix(in srgb, var(--success), #fff 20%); }
                .merge-gutter-btn.warning:hover { background-color: color-mix(in srgb, var(--warning), #fff 20%); }
            `}</style>
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full bg-background h-full">
                {/* A Side (Left) */}
                <div className="flex-none lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border h-[50vh] lg:h-full min-w-0">
                    <div className="h-10 px-4 border-b border-border flex items-center bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] shrink-0 justify-between">
                        <div className="flex items-center gap-2">
                            <FileJson className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Original (A)</span>
                            <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
                                <button onClick={handlePasteA} className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-primary transition-colors" title="Paste to A">
                                    <ClipboardPaste className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => {
                                        pushUndo("Clear Baseline A");
                                        setOriginalInput("");
                                    }}
                                    className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-destructive transition-colors"
                                    title="Clear A"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLoadSample}
                                className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20"
                            >
                                Load Sample
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    pushUndo("Clear both sides");
                                    setOriginalInput("");
                                    setModifiedInput("");
                                    setDiffResult(null);
                                }}
                                className="h-6 text-[10px] px-2 text-muted-foreground hover:text-destructive"
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden flex flex-col">
                        <div className="flex-1 relative">
                            <CodeEditor
                                value={originalInput}
                                language={config.allowComments ? 'javascript' : 'json'}
                                onChange={(val) => setOriginalInput(val || '')}
                                placeholder='{ "id": 1, "name": "Original" }'
                                className="rounded-none border-none bg-transparent"
                                minimal
                                selection={leftSelection}
                                decorations={leftDecorations}
                                onMount={(editor) => { leftEditorRef.current = editor; }}
                            />
                        </div>
                    </div>
                </div>

                {/* Central Action Gutter */}
                <div className="hidden lg:flex w-12 shrink-0 bg-muted/30 border-x border-border relative overflow-hidden flex-col h-full">
                    {/* Gutter Header Actions */}
                    <div className="h-10 border-b border-border flex items-center justify-center gap-1 bg-muted/50 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-success hover:bg-success/10"
                            title="Apply All from Modified to Original (B → A)"
                            onClick={() => {
                                pushUndo("Apply all B → A");
                                setOriginalInput(modifiedInput);
                                toast.success("Applied all changes to Baseline (A)");
                            }}
                        >
                            <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-primary/10"
                            title="Sync All from Original to Modified (A → B)"
                            onClick={() => {
                                pushUndo("Sync all A → B");
                                setModifiedInput(originalInput);
                                toast.success("Synced all changes to Modified (B)");
                            }}
                        >
                            <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                        </Button>
                    </div>

                    {/* Arrows Layer */}
                    <div className="flex-1 relative overflow-hidden">
                        {gutterZones.map((zone, idx) => {
                            const y = zone.top;
                            if (y < -30 || y > 2000) return null;

                            return (
                                <div
                                    key={`zone-${idx}`}
                                    className="merge-arrow-row"
                                    style={{ top: `${y}px` }}
                                >
                                    {zone.actions.map((action, aidx) => {
                                        const { node, type } = action;
                                        const isLTR = type === 'leftToRight';
                                        const colorClass = node.changeType === 'added' ? 'merge-arrow-add' :
                                            node.changeType === 'removed' ? 'merge-arrow-remove' :
                                                'merge-arrow-modify';

                                        return (
                                            <button
                                                key={`${node.path}-${aidx}`}
                                                className={cn("merge-arrow", colorClass)}
                                                onClick={() => handleMerge(node, type)}
                                                title={isLTR ? `Push to Right: ${node.path}` : `Apply to Left: ${node.path}`}
                                            >
                                                {isLTR ? (
                                                    <MoveRight className="w-3.5 h-3.5" />
                                                ) : (
                                                    <MoveLeft className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* B Side (Right) - Contains Editor, Sidebar, Bottom Config */}
                <div className="flex-none lg:flex-1 flex flex-col md:h-[50vh] lg:h-[50vh] h-[30vh] lg:h-full relative min-w-0">
                    {/* Header B */}
                    <div className="h-10 px-4 border-b border-border flex items-center bg-muted/50 shrink-0 justify-between">
                        <div className="flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-secondary" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Modified (B)</span>
                            <div className="flex items-center gap-1 ml-2 border-l border-border pl-2">
                                <button onClick={handlePasteB} className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-secondary transition-colors" title="Paste to B">
                                    <ClipboardPaste className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => {
                                        pushUndo("Clear Modified B");
                                        setModifiedInput("");
                                    }}
                                    className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-destructive transition-colors"
                                    title="Clear B"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Resulting Changes Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                onClick={handleUndo}
                                disabled={!canUndo}
                                className={cn(
                                    "flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium rounded transition-colors",
                                    canUndo
                                        ? "bg-muted hover:bg-muted/80 text-foreground"
                                        : "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                                )}
                                title="Undo last change"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Undo</span>
                            </button>
                            <button
                                onClick={handleRedo}
                                disabled={!canRedo}
                                className={cn(
                                    "flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium rounded transition-colors",
                                    canRedo
                                        ? "bg-muted hover:bg-muted/80 text-foreground"
                                        : "bg-muted text-muted-foreground opacity-60 cursor-not-allowed"
                                )}
                                title="Redo last change"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Redo</span>
                            </button>
                            <button
                                onClick={handleCopyResult}
                                className="flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors shadow-sm"
                                title="Copy JSON Patch result to clipboard"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Copy Patch</span>
                                <span className="md:hidden">Copy</span>
                            </button>
                            <button
                                onClick={handleCopySummary}
                                className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium bg-accent hover:bg-accent/80 text-foreground rounded transition-colors"
                                title="Copy human-readable summary"
                            >
                                <ClipboardList className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Summary</span>
                            </button>
                            <button
                                onClick={handleExport}
                                className="hidden sm:flex items-center gap-1 px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-medium bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded transition-colors"
                                title="Download patch file"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area: Editor + Sidebar */}
                    <div className="flex-1 flex overflow-hidden relative">
                        {/* Editor B */}
                        <div className="flex-1 relative overflow-hidden">
                            <CodeEditor
                                value={modifiedInput}
                                language={config.allowComments ? 'javascript' : 'json'}
                                onChange={(val) => setModifiedInput(val || '')}
                                placeholder='{ "id": 1, "name": "Modified" }'
                                className="rounded-none border-none bg-transparent"
                                minimal
                                selection={rightSelection}
                                decorations={rightDecorations}
                                onMount={(editor) => { rightEditorRef.current = editor; }}
                            />
                        </div>

                        {/* Comparison Sidebar */}
                        {diffResult && (
                            <>
                                {isChangelogExpanded && (
                                    <div
                                        className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
                                        onClick={() => setIsChangelogExpanded(false)}
                                    />
                                )}
                                <aside
                                    className={cn(
                                        "border-l border-border bg-background flex flex-col shadow-[-10px_0_20px_-5px_rgba(0,0,0,0.1)]",
                                        isChangelogExpanded
                                            ? "fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-[400px] lg:absolute lg:top-0 lg:bottom-0 lg:w-80 lg:z-20 shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.3)] lg:shadow-[-10px_0_20px_-5px_rgba(0,0,0,0.1)]"
                                            : "absolute right-0 top-1/2 -translate-y-1/2 bottom-auto w-10 h-10 z-20 bg-muted hover:bg-primary/80 rounded-l-lg"
                                    )}
                                >
                                    {/* Toggle Button */}
                                    <div
                                        className={cn(
                                            "flex items-center cursor-pointer shrink-0",
                                            isChangelogExpanded
                                                ? "h-10 px-3 border-b border-border justify-between bg-muted/40"
                                                : "h-full w-full justify-center px-2 gap-2"
                                        )}
                                        onClick={() => setIsChangelogExpanded(!isChangelogExpanded)}
                                    >
                                        {isChangelogExpanded ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    {/* <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                                                    <History className="w-3.5 h-3.5 text-primary" />
                                                </div> */}
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">Comparison Result</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform hover:text-foreground" />
                                            </>
                                        ) : (
                                            <>
                                                {/* <History className="w-4 h-4 text-primary" /> */}
                                                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                                            </>
                                        )}
                                    </div>

                                    {isChangelogExpanded && (
                                        <>
                                            {/* Summary Stats Cards */}
                                            {/* <div className="p-3 grid grid-cols-3 gap-2 bg-muted/20 border-b border-border">
                                        <div className="bg-background border border-border/50 rounded-lg p-2 text-center shadow-sm">
                                            <div className="text-[10px] text-muted-foreground mb-1">Added</div>
                                            <div className="text-sm font-bold text-success">{diffResult.summary.added}</div>
                                        </div>
                                        <div className="bg-background border border-border/50 rounded-lg p-2 text-center shadow-sm">
                                            <div className="text-[10px] text-muted-foreground mb-1">Removed</div>
                                            <div className="text-sm font-bold text-destructive">{diffResult.summary.removed}</div>
                                        </div>
                                        <div className="bg-background border border-border/50 rounded-lg p-2 text-center shadow-sm">
                                            <div className="text-[10px] text-muted-foreground mb-1">Modified</div>
                                            <div className="text-sm font-bold text-warning">{diffResult.summary.modified}</div>
                                        </div>
                                    </div> */}

                                            {/* Sidebar Navigation Tabs */}
                                            <div className="flex border-b border-border bg-muted/10 shrink-0">
                                                {/* <button
                                                    onClick={() => setActiveSidebarTab('structure')}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase transition-all border-b-2",
                                                        activeSidebarTab === 'structure' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <Network className="w-3 h-3" />
                                                    Structure
                                                </button> */}
                                                <button
                                                    onClick={() => setActiveSidebarTab('changes')}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase transition-all border-b-2",
                                                        activeSidebarTab === 'changes' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <LayoutList className="w-3 h-3" />
                                                    Changes Log
                                                </button>
                                            </div>

                                            {/* Tab Content */}
                                            <div className="flex-1 overflow-hidden">
                                                {activeSidebarTab === 'structure' ? (
                                                    <div className="h-full overflow-auto p-2 scrollbar-thin">
                                                        <DiffNodeRenderer
                                                            node={diffResult.root}
                                                            showUnchanged={config.showUnchanged}
                                                            expandAll={false}
                                                            onNodeClick={handleNodeClick}
                                                            onMerge={handleMerge}
                                                        />
                                                    </div>
                                                ) : (
                                                    <ChangeLogList
                                                        root={diffResult.root}
                                                        onNodeClick={handleNodeClick}
                                                        onMerge={handleMerge}
                                                        onBatchMerge={handleBatchMerge}
                                                        diffResult={diffResult}
                                                    />
                                                )}
                                            </div>

                                            {/* Footer Action */}
                                            {/* <div className="p-3 border-t border-border bg-muted/10 flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground opacity-70 mb-1">
                                                <Info className="w-3 h-3" />
                                                Use the central gutter arrows to merge.
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const allNodes: DiffNode[] = [];
                                                        const traverse = (n: DiffNode) => {
                                                            if (n.changeType !== 'unchanged' && !(n.children && n.children.length > 0)) {
                                                                allNodes.push(n);
                                                            }
                                                            if (n.children) n.children.forEach(traverse);
                                                        };
                                                        traverse(diffResult.root);
                                                        handleBatchMerge(allNodes, 'rightToLeft');
                                                    }}
                                                    className="flex-1 h-7 text-[10px] gap-1"
                                                >
                                                    <ArrowRightLeft className="w-3 h-3" />
                                                    Merge All (B→A)
                                                </Button>
                                            </div>
                                        </div> */}
                                        </>
                                    )}
                                </aside>
                            </>
                        )}
                    </div>

                </div>
            </div>

            <BottomConfigurationPanel />
        </main >
    )
}
