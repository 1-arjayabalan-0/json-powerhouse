"use client"

import { useMemo, useState } from "react";
import { DiffNode, DiffChangeType } from "@/core/types/diff-config";
import { cn } from "@/app/lib/utils";
import { Search, ChevronRight, ArrowRight, X, ArrowLeft, CheckSquare, Square, Check, Trash2, Copy, Download, Share2, Info, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface ChangeLogListProps {
    root: DiffNode;
    diffResult: any;
    onNodeClick?: (node: DiffNode) => void;
    onMerge?: (node: DiffNode, direction: 'leftToRight' | 'rightToLeft') => void;
    onBatchMerge?: (nodes: DiffNode[], direction: 'leftToRight' | 'rightToLeft') => void;
}

interface FlatChange {
    id: string;
    path: string;
    key: string;
    type: DiffChangeType;
    oldValue: any;
    newValue: any;
    node: DiffNode;
}

export default function ChangeLogList({ root, diffResult, onNodeClick, onMerge, onBatchMerge }: ChangeLogListProps) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<DiffChangeType | 'all'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const flatChanges = useMemo(() => {
        const pathMap = new Map<string, FlatChange>();
        let idCounter = 0;

        const traverse = (node: DiffNode) => {
            const isLeaf = !node.children || node.children.length === 0;
            const isContainerModified = node.changeType === 'modified' && !isLeaf;

            if (node.changeType !== 'unchanged' && !isContainerModified) {
                const path = node.path || '/';
                const existing = pathMap.get(path);

                if (existing) {
                    // Merge logic: If we already have a change at this path, update it to be a broader 'modified'
                    existing.type = 'modified';
                    if (node.changeType === 'added' || node.changeType === 'modified') {
                        existing.newValue = node.newValue;
                    }
                    if (node.changeType === 'removed' || node.changeType === 'modified') {
                        existing.oldValue = node.oldValue;
                    }
                } else {
                    pathMap.set(path, {
                        id: `change-${idCounter++}`,
                        path: path,
                        key: node.key,
                        type: node.changeType,
                        oldValue: node.oldValue,
                        newValue: node.newValue,
                        node: node
                    });
                }

                // For Add/Remove of containers, we don't need to see every single child change separately
                if (node.changeType === 'added' || node.changeType === 'removed') {
                    return;
                }
            }

            if (node.children) {
                node.children.forEach(traverse);
            }
        };

        traverse(root);
        return Array.from(pathMap.values());
    }, [root]);

    const filteredChanges = useMemo(() => {
        return flatChanges.filter(c => {
            const matchesSearch = c.path.toLowerCase().includes(search.toLowerCase()) ||
                String(c.oldValue).toLowerCase().includes(search.toLowerCase()) ||
                String(c.newValue).toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || c.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [flatChanges, search, filter]);

    const formatValue = (val: any) => {
        if (val === undefined) return "";
        if (val === null) return "null";
        if (typeof val === 'object') {
            try {
                const str = JSON.stringify(val);
                if (str.length <= 120) return str;

                // Provide a more insightful preview for large objects/arrays
                if (Array.isArray(val)) {
                    return `Array[${val.length}] [${str.substring(1, 80)}...]`;
                }
                const keys = Object.keys(val);
                return `{ ${keys.slice(0, 3).map(k => `"${k}"`).join(", ")}${keys.length > 3 ? ", ..." : ""} }`;
            } catch {
                return Array.isArray(val) ? `Array[${val.length}]` : "{ ... }";
            }
        }
        if (typeof val === 'string') return `"${val}"`;
        return String(val);
    };

    const formatPath = (path: string) => {
        if (!path || path === "/" || path === "") return "$";
        // Convert /foo/0/bar to $.foo[0].bar
        const segments = path.split('/').filter(Boolean);
        return "$" + segments.map(s => {
            const isIdx = /^\d+$/.test(s);
            return isIdx ? `[${s}]` : `.${s}`;
        }).join("");
    };

    const getTypeColor = (type: DiffChangeType) => {
        switch (type) {
            case 'added': return 'bg-success';
            case 'removed': return 'bg-destructive';
            case 'modified': return 'bg-amber-500';
            case 'type-changed': return 'bg-amber-500';
            default: return 'bg-muted-foreground';
        }
    };

    const handleCopyPatch = () => {
        const patch = filteredChanges.map(c => {
            const op = c.type === 'added' ? 'add' : c.type === 'removed' ? 'remove' : 'replace';
            const item: any = { op, path: `/${c.path.replace(/\./g, '/')}` };
            if (op !== 'remove') item.value = c.newValue;
            return item;
        });
        navigator.clipboard.writeText(JSON.stringify(patch, null, 2));
        toast.success("JSON Patch (RFC 6902) copied to clipboard");
    };

    const toggleSelection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredChanges.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredChanges.map(c => c.id)));
        }
    };

    const handleBatchAction = (direction: 'leftToRight' | 'rightToLeft') => {
        const selectedNodes = flatChanges
            .filter(c => selectedIds.has(c.id))
            .map(c => c.node);
        if (selectedNodes.length > 0) {
            onBatchMerge?.(selectedNodes, direction);
            setSelectedIds(new Set());
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header with Title and Copy Patch */}
            {/* <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30">
                <span className="text-[11px] font-bold text-foreground">
                    {filteredChanges.length} {filteredChanges.length === 1 ? 'change' : 'changes'}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[9px] gap-1 font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    onClick={handleCopyPatch}
                >
                    <Copy className="w-3 h-3" />
                    Copy JSON Patch
                </Button>
            </div> */}

            {/* Search and Filter */}
            <div className="p-2 border-b border-border space-y-2 bg-muted/10">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search changes..."
                        className="w-full bg-background/50 border border-border/50 rounded-md pl-7 pr-2 py-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {(['all', 'added', 'removed', 'modified'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-2 py-0.5 rounded text-[10px] capitalize border transition-all shrink-0 font-medium",
                                filter === f
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                            )}
                        >
                            {f} <span className="opacity-100 ml-1 font-mono">
                                {f === 'all' ?
                                    (diffResult?.summary?.added || 0) + (diffResult?.summary?.removed || 0) + (diffResult?.summary?.modified || 0) :
                                    diffResult?.summary?.[f] || 0}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto bg-[#0d0d0d] p-2 space-y-2">
                {filteredChanges.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <Search className="w-8 h-8 text-muted-foreground/20 mb-2" />
                        <p className="text-[11px] text-muted-foreground">No differences found</p>
                    </div>
                ) : (
                    <>
                        {filteredChanges.map(change => (
                            <div
                                key={change.id}
                                className={cn(
                                    "flex flex-col gap-2 p-2.5 rounded-lg border border-border/10 bg-black/40 hover:bg-black/60 transition-all group cursor-pointer",
                                    selectedIds.has(change.id) && "ring-1 ring-primary/30 bg-primary/[0.02]"
                                )}
                                onClick={() => onNodeClick?.(change.node)}
                            >
                                {/* Top Row: Meta + Actions */}
                                <div className="flex items-center justify-between min-w-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", getTypeColor(change.type))} />
                                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider shrink-0">
                                            {change.type === 'type-changed' ? 'Type' : change.type}
                                        </span>
                                        <span className="text-[11px] font-mono font-bold text-blue-400/90 truncate">
                                            {formatPath(change.path)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 rounded border border-border/20 hover:bg-primary hover:text-primary-foreground transition-all"
                                            onClick={(e) => { e.stopPropagation(); onMerge?.(change.node, 'leftToRight'); }}
                                            title="Sync A → B"
                                        >
                                            <MoveRight className="w-2.5 h-2.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 rounded border border-border/20 hover:bg-success hover:text-success-foreground transition-all"
                                            onClick={(e) => { e.stopPropagation(); onMerge?.(change.node, 'rightToLeft'); }}
                                            title="Sync B → A"
                                        >
                                            <MoveLeft className="w-2.5 h-2.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Value Insight Box (A vs B) */}
                                <div className="flex flex-col gap-2 p-2.5 rounded bg-black/50 border border-white/[0.03]">
                                    {/* Baseline A Box */}
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase mb-0.5">
                                            <span className="w-1 h-1 rounded-full bg-red-500/30" />
                                            Baseline A
                                        </div>
                                        <div className="flex items-start gap-1.5 pl-2.5 border-l border-red-500/10 min-w-0">
                                            {change.type === 'added' ? (
                                                <span className="text-[10px] italic text-muted-foreground/50 leading-relaxed">(not present)</span>
                                            ) : (
                                                <div className="flex items-start gap-1.5 min-w-0 leading-relaxed">
                                                    {!change.path.endsWith(']') && change.key && (
                                                        <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">"{change.key}":</span>
                                                    )}
                                                    <span className="text-[10px] font-mono text-red-300/80 break-all line-through decoration-red-500/20">
                                                        {formatValue(change.oldValue)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Modified B Box */}
                                    <div className="flex flex-col gap-1 min-w-0 border-t border-white/[0.02] pt-2">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/70 uppercase mb-0.5">
                                            <span className="w-1 h-1 rounded-full bg-green-500/50" />
                                            Modified B
                                        </div>
                                        <div className="flex items-start gap-1.5 pl-2.5 border-l border-green-500/20 min-w-0">
                                            {change.type === 'removed' ? (
                                                <span className="text-[10px] italic text-muted-foreground/20 leading-relaxed">(removed)</span>
                                            ) : (
                                                <div className="flex items-start gap-1.5 min-w-0 leading-relaxed">
                                                    {!change.path.endsWith(']') && change.key && (
                                                        <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0">"{change.key}":</span>
                                                    )}
                                                    <span className="text-[10px] font-mono text-green-300/90 break-all font-medium">
                                                        {formatValue(change.newValue)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Footer */}
            {/* <div className="p-3 border-t border-border bg-muted/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] gap-1 font-bold border-border/50">
                            <Download className="w-3 h-3" /> Download Diff
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 px-2 text-[10px] gap-1 font-bold border-border/50">
                            <Download className="w-3 h-3" /> Download Merged
                        </Button>
                    
                    </div>
                </div> */}

                {/* Shortcuts */}
                {/* <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground/60 uppercase font-bold tracking-widest">
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50 text-[8px]">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50 text-[8px]">F</kbd>
                        <span className="ml-0.5">Find</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground/60 uppercase font-bold tracking-widest">
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50 text-[8px]">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="px-1 py-0.5 rounded bg-muted border border-border/50 text-[8px]">&uarr; &darr;</kbd>
                        <span className="ml-0.5">Navigate diffs</span>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
