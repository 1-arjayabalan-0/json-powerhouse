"use client"

import { useState, useEffect, useRef } from "react";
import CodeEditor from "@/app/components/CodeEditor";
import { JsonDiffConfig, defaultDiffConfig, DiffNode } from "@/core/types/diff-config";
import { parseAndDiff, DiffResult } from "@/core/lib/diff/engine";
import DiffNodeRenderer from "./DiffNodeRenderer";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import { useConfig } from "@/app/context/ConfigContext";
import { parseTree, findNodeAtLocation, getLocation, modify, applyEdits } from 'jsonc-parser';
import BottomConfigurationPanel from "@/app/components/BottomConfigurationPanel";
import { cn } from "@/app/lib/utils";

export default function JsonDiffViewer() {
    const { config, setConfig } = useConfig();
    const diffConfig = (config as JsonDiffConfig) || defaultDiffConfig;
    
    const [leftInput, setLeftInput] = useState("");
    const [rightInput, setRightInput] = useState("");
    const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
    const [isComputing, setIsComputing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const [leftSelection, setLeftSelection] = useState<{
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    } | null>(null);

    const [rightSelection, setRightSelection] = useState<{
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    } | null>(null);

    const [leftDecorations, setLeftDecorations] = useState<any[]>([]);
    const [rightDecorations, setRightDecorations] = useState<any[]>([]);

    const leftNodeMap = useRef<Map<number, DiffNode>>(new Map());
    const rightNodeMap = useRef<Map<number, DiffNode>>(new Map());

    // Auto-compare when inputs stop changing (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (leftInput && rightInput) {
                handleCompare();
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [leftInput, rightInput, diffConfig]);

    const handleCompare = async () => {
        setIsComputing(true);
        // Small delay to let UI render loading state
        setTimeout(() => {
            const result = parseAndDiff(leftInput, rightInput, diffConfig);
            setDiffResult(result);
            setIsComputing(false);
            
            // Generate Decorations
            generateDecorations(result, leftInput, rightInput);
            
            // Auto-open sidebar on new results
            setIsSidebarOpen(true);
        }, 10);
    };

    const generateDecorations = (result: DiffResult, leftTxt: string, rightTxt: string) => {
        if (result.error) {
            setLeftDecorations([]);
            setRightDecorations([]);
            leftNodeMap.current.clear();
            rightNodeMap.current.clear();
            return;
        }

        const leftDecs: any[] = [];
        const rightDecs: any[] = [];
        
        // Clear maps
        leftNodeMap.current.clear();
        rightNodeMap.current.clear();

        const leftTree = parseTree(leftTxt);
        const rightTree = parseTree(rightTxt);

        // Helper to process nodes recursively
        const processNode = (node: DiffNode) => {
            if (node.changeType === 'unchanged' && !node.children) return;

            // Skip highlighting "Modified" containers (Objects/Arrays) that just contain changed children.
            // We only want to highlight the specific changes (Leaves or Added/Removed blocks).
            const isContainerChange = node.children && node.children.length > 0 && node.changeType === 'modified';

            if (!isContainerChange) {
                // Left Side Decorations (Removed, Modified, Type-Changed)
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

                        // Map lines to node for click handling
                        for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
                            // Only overwrite if not already set (prefer deeper/more specific nodes)
                            if (!leftNodeMap.current.has(i)) {
                                leftNodeMap.current.set(i, node);
                            }
                        }

                        // Highlight Background
                        leftDecs.push({
                            range,
                            options: {
                                className: node.changeType === 'removed' ? 'diff-removed-line' : 'diff-modified-line',
                                isWholeLine: true,
                                linesDecorationsClassName: node.changeType === 'removed' ? 'diff-removed-gutter' : 'diff-modified-gutter'
                            }
                        });

                        // Glyph Margin (Arrow)
                        leftDecs.push({
                            range,
                            options: {
                                glyphMarginClassName: 'codicon-arrow-right diff-action-glyph',
                                glyphMarginHoverMessage: { value: 'Push to Right' }
                            }
                        });
                    }
                }

                // Right Side Decorations (Added, Modified, Type-Changed)
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

                        // Map lines to node for click handling
                        for (let i = range.startLineNumber; i <= range.endLineNumber; i++) {
                             if (!rightNodeMap.current.has(i)) {
                                rightNodeMap.current.set(i, node);
                            }
                        }

                        // Highlight Background
                        rightDecs.push({
                            range,
                            options: {
                                className: node.changeType === 'added' ? 'diff-added-line' : 'diff-modified-line',
                                isWholeLine: true,
                                linesDecorationsClassName: node.changeType === 'added' ? 'diff-added-gutter' : 'diff-modified-gutter'
                            }
                        });

                         // Glyph Margin (Arrow)
                         rightDecs.push({
                            range,
                            options: {
                                glyphMarginClassName: 'codicon-arrow-left diff-action-glyph',
                                glyphMarginHoverMessage: { value: 'Push to Left' }
                            }
                        });
                    }
                }
            }

            if (node.children) {
                node.children.forEach(processNode);
            }
        };

        processNode(result.root);
        setLeftDecorations(leftDecs);
        setRightDecorations(rightDecs);
    };

    const handleNodeClick = (node: DiffNode) => {
        // Handle Left Selection
        if (node.leftPathSegments && leftInput) {
            const tree = parseTree(leftInput);
            if (tree) {
                const jsonNode = findNodeAtLocation(tree, node.leftPathSegments);
                if (jsonNode) {
                    const start = getLocation(leftInput, jsonNode.offset);
                    const end = getLocation(leftInput, jsonNode.offset + jsonNode.length);
                    setLeftSelection({
                        startLineNumber: start.line + 1,
                        startColumn: start.column + 1,
                        endLineNumber: end.line + 1,
                        endColumn: end.column + 1
                    });
                }
            }
        } else {
            setLeftSelection(null);
        }

        // Handle Right Selection
        if (node.rightPathSegments && rightInput) {
            const tree = parseTree(rightInput);
            if (tree) {
                const jsonNode = findNodeAtLocation(tree, node.rightPathSegments);
                if (jsonNode) {
                    const start = getLocation(rightInput, jsonNode.offset);
                    const end = getLocation(rightInput, jsonNode.offset + jsonNode.length);
                    setRightSelection({
                        startLineNumber: start.line + 1,
                        startColumn: start.column + 1,
                        endLineNumber: end.line + 1,
                        endColumn: end.column + 1
                    });
                }
            }
        } else {
            setRightSelection(null);
        }
    };

    const handleMerge = (node: DiffNode, direction: 'leftToRight' | 'rightToLeft') => {
        const options = { formattingOptions: { insertSpaces: true, tabSize: 2 } };

        if (direction === 'leftToRight') {
            // Copy Left -> Right
            if (node.changeType === 'removed') {
                toast.error("Restoring removed items not yet supported");
                return;
            }

            const path = node.rightPathSegments;
            if (!path) return;

            // If added (in Right), we remove it (make it like Left where it doesn't exist)
            // If modified/type-changed, we set it to oldValue (Left value)
            const valueToSet = node.changeType === 'added' ? undefined : node.oldValue;
            
            const edits = modify(rightInput, path, valueToSet, options);
            const newContent = applyEdits(rightInput, edits);
            setRightInput(newContent);
            
        } else {
            // Copy Right -> Left
            if (node.changeType === 'added') {
                toast.error("Copying added items not yet supported");
                return;
            }

            const path = node.leftPathSegments;
            if (!path) return;

            // If removed (in Left), we remove it (make it like Right where it doesn't exist)
            // If modified/type-changed, we set it to newValue (Right value)
            const valueToSet = node.changeType === 'removed' ? undefined : node.newValue;

            const edits = modify(leftInput, path, valueToSet, options);
            const newContent = applyEdits(leftInput, edits);
            setLeftInput(newContent);
        }
    };

    const handleGlyphClick = (line: number, side: 'left' | 'right') => {
        if (side === 'left') {
            const node = leftNodeMap.current.get(line);
            if (node) {
                // Left side click -> Push to Right (Left -> Right)
                handleMerge(node, 'leftToRight');
            }
        } else {
            const node = rightNodeMap.current.get(line);
            if (node) {
                // Right side click -> Push to Left (Right -> Left)
                handleMerge(node, 'rightToLeft');
            }
        }
    };

    return (
        <main className="flex-1 flex overflow-hidden h-full">
            <style jsx global>{`
                .diff-removed-line { background-color: color-mix(in srgb, var(--destructive), transparent 85%); }
                .diff-added-line { background-color: color-mix(in srgb, var(--success), transparent 85%); }
                .diff-modified-line { background-color: color-mix(in srgb, var(--warning), transparent 85%); }
                
                .diff-removed-gutter { background-color: color-mix(in srgb, var(--destructive), transparent 60%); width: 5px !important; margin-left: 0px; }
                .diff-added-gutter { background-color: color-mix(in srgb, var(--success), transparent 60%); width: 5px !important; margin-left: 0px; }
                .diff-modified-gutter { background-color: color-mix(in srgb, var(--warning), transparent 60%); width: 5px !important; margin-left: 0px; }

                .diff-action-glyph {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .codicon-arrow-right::before { content: '→'; font-weight: bold; color: var(--muted-foreground); }
                .codicon-arrow-left::before { content: '←'; font-weight: bold; color: var(--muted-foreground); }
                .codicon-arrow-right:hover::before { color: var(--foreground); }
                .codicon-arrow-left:hover::before { color: var(--foreground); }
            `}</style>

            {/* Left Input (A Side) */}
            <div className="w-1/2 flex flex-col border-r border-border bg-background">
                <div className="h-8 px-3 border-b border-border flex items-center bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] shrink-0 justify-between">
                    <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary text-sm">difference</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Original (Left)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => { setLeftInput(""); setRightInput(""); setDiffResult(null); }}
                            className="h-5 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                        >
                            Clear All
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <CodeEditor
                        value={leftInput}
                        language={diffConfig.allowComments ? 'javascript' : 'json'}
                        onChange={(val) => setLeftInput(val || '')}
                        placeholder='{ "id": 1, "name": "Old" }'
                        className="rounded-none border-none bg-transparent"
                        minimal
                        selection={leftSelection}
                        decorations={leftDecorations}
                        onGlyphMarginClick={(line) => handleGlyphClick(line, 'left')}
                    />
                </div>
            </div>

            {/* Right Input (B Side) + Sidebar + Bottom Config */}
            <div className="w-1/2 flex flex-col bg-background relative">
                {/* Header */}
                <div className="h-8 px-3 border-b border-border flex items-center bg-muted/50 shrink-0 justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Modified (Right)</span>
                    <div className="flex items-center gap-2">
                        <Button 
                            size="sm" 
                            onClick={handleCompare}
                            disabled={isComputing || !leftInput || !rightInput}
                            className="h-6 text-[10px] bg-primary hover:opacity-90 text-primary-foreground"
                        >
                            {isComputing ? "Computing..." : "Compare Now"}
                        </Button>
                    </div>
                </div>

                {/* Main Content Area: Editor + ChangeLog Sidebar */}
                <div className="flex-1 flex overflow-hidden relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <CodeEditor
                            value={rightInput}
                            language={diffConfig.allowComments ? 'javascript' : 'json'}
                            onChange={(val) => setRightInput(val || '')}
                            placeholder='{ "id": 1, "name": "New" }'
                            className="rounded-none border-none bg-transparent"
                            minimal
                            selection={rightSelection}
                            decorations={rightDecorations}
                            onGlyphMarginClick={(line) => handleGlyphClick(line, 'right')}
                        />
                    </div>
                    
                    {/* ChangeLog Sidebar (Absolute) */}
                    {diffResult && (
                         <div 
                            className={cn(
                                "absolute right-0 top-0 bottom-0 border-l border-border bg-background transition-all duration-300 ease-in-out z-10 flex flex-col",
                                isSidebarOpen ? "w-80 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]" : "w-8 bg-muted/30 hover:bg-muted/50"
                            )}
                         >
                            {/* Header / Toggle */}
                            <div 
                                className={cn(
                                    "flex items-center cursor-pointer transition-colors shrink-0",
                                    isSidebarOpen ? "h-8 px-2 border-b border-border justify-between bg-muted/30" : "h-full w-full flex-col py-2 gap-2"
                                )}
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                title={isSidebarOpen ? "Collapse Changes" : "Expand Changes"}
                            >
                                {isSidebarOpen ? (
                                    <>
                                        <span className="text-xs font-bold flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">history</span>
                                            Changes
                                        </span>
                                        
                                        {/* Stats Mini */}
                                        <div className="flex items-center gap-2 text-[10px] mr-2">
                                            <span className="text-success flex items-center gap-0.5" title="Added">
                                                <span className="w-1.5 h-1.5 rounded-full bg-success"/>
                                                {rightDecorations.filter(d => d.options.className === 'diff-added-line').length}
                                            </span>
                                            <span className="text-destructive flex items-center gap-0.5" title="Removed">
                                                <span className="w-1.5 h-1.5 rounded-full bg-destructive"/>
                                                {leftDecorations.filter(d => d.options.className === 'diff-removed-line').length}
                                            </span>
                                            <span className="text-warning flex items-center gap-0.5" title="Modified">
                                                <span className="w-1.5 h-1.5 rounded-full bg-warning"/>
                                                {rightDecorations.filter(d => d.options.className === 'diff-modified-line').length}
                                            </span>
                                        </div>

                                        <span className="material-symbols-outlined text-[14px] text-muted-foreground hover:text-foreground">chevron_right</span>
                                    </>
                                ) : (
                                     <>
                                        <span className="material-symbols-outlined text-[14px] text-muted-foreground">chevron_left</span>
                                        <div className="flex-1 flex items-center justify-center">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground rotate-180 whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
                                                Changes
                                            </span>
                                        </div>
                                     </>
                                )}
                            </div>

                            {/* Content */}
                            {isSidebarOpen && (
                                <div className="flex-1 overflow-auto p-2">
                                     <DiffNodeRenderer 
                                        node={diffResult.root} 
                                        showUnchanged={diffConfig.showUnchanged} 
                                        expandAll={false}
                                        onNodeClick={handleNodeClick}
                                        onMerge={handleMerge}
                                     />
                                </div>
                            )}
                         </div>
                    )}
                </div>

                {/* Bottom Configuration Panel */}
                <BottomConfigurationPanel />
            </div>
        </main>
    );
}
