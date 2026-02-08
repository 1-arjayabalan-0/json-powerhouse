"use client"

import { useState } from "react";
import { DiffNode, DiffChangeType } from "@/core/types/diff-config";
import { cn } from "@/app/lib/utils";

interface DiffNodeRendererProps {
    node: DiffNode;
    depth?: number;
    showUnchanged: boolean;
    expandAll: boolean;
    onNodeClick?: (node: DiffNode) => void;
    onMerge?: (node: DiffNode, direction: 'leftToRight' | 'rightToLeft') => void;
}

export default function DiffNodeRenderer({ node, depth = 0, showUnchanged, expandAll, onNodeClick, onMerge }: DiffNodeRendererProps) {
    const [isExpanded, setIsExpanded] = useState(expandAll || node.changeType !== 'unchanged');

    // Skip rendering if unchanged and we're hiding unchanged items
    // But if it has children that are changed, we must render (handled by parent logic usually, but here check recursion)
    // Actually, if a node is 'modified', it means it has children with changes or it changed itself.
    // If 'unchanged', we hide it unless showUnchanged is true.
    if (node.changeType === 'unchanged' && !showUnchanged) {
        return null;
    }

    const hasChildren = node.children && node.children.length > 0;
    const isRoot = depth === 0;

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
        if (onNodeClick) onNodeClick(node);
    };

    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onNodeClick) onNodeClick(node);
        if (hasChildren) setIsExpanded(!isExpanded);
    };

    const getIcon = (type: DiffChangeType) => {
        switch (type) {
            case 'added': return <span className="material-symbols-outlined text-[14px] text-success">add</span>;
            case 'removed': return <span className="material-symbols-outlined text-[14px] text-destructive">remove</span>;
            case 'modified': return <span className="material-symbols-outlined text-[14px] text-warning">edit</span>;
            case 'type-changed': return <span className="material-symbols-outlined text-[14px] text-warning">sync_alt</span>;
            default: return null;
        }
    };

    const getBgColor = (type: DiffChangeType) => {
        switch (type) {
            case 'added': return 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] border-[color-mix(in_srgb,var(--success)_20%,transparent)]';
            case 'removed': return 'bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] border-[color-mix(in_srgb,var(--destructive)_20%,transparent)]';
            case 'modified': return 'bg-[color-mix(in_srgb,var(--warning)_5%,transparent)] border-[color-mix(in_srgb,var(--warning)_10%,transparent)]';
            case 'type-changed': return 'bg-[color-mix(in_srgb,var(--warning)_10%,transparent)] border-[color-mix(in_srgb,var(--warning)_20%,transparent)]';
            default: return 'hover:bg-accent border-transparent';
        }
    };

    const formatValue = (val: any) => {
        if (val === undefined) return <span className="text-muted-foreground italic">undefined</span>;
        if (val === null) return <span className="text-syntax-null font-mono">null</span>;
        if (typeof val === 'string') return <span className="text-syntax-string font-mono">"{val}"</span>;
        if (typeof val === 'number') return <span className="text-syntax-number font-mono">{val}</span>;
        if (typeof val === 'boolean') return <span className="text-syntax-boolean font-mono">{val.toString()}</span>;
        if (Array.isArray(val)) return <span className="text-muted-foreground font-mono">Array[{val.length}]</span>;
        if (typeof val === 'object') return <span className="text-muted-foreground font-mono">Object</span>;
        return String(val);
    };

    return (
        <div className="font-mono text-sm">
            <div
                className={cn(
                    "flex items-start py-0.5 px-2 rounded border mb-0.5 cursor-pointer select-none transition-colors group relative",
                    getBgColor(node.changeType)
                )}
                style={{ marginLeft: `${depth * 12}px` }}
                onClick={handleContentClick}
            >
                {/* Expander / Icon */}
                <div
                    className="w-5 flex items-center justify-center shrink-0 mt-0.5 mr-1 hover:bg-accent rounded"
                    onClick={toggleExpand}
                >
                    {hasChildren ? (
                        <span className={cn(
                            "material-symbols-outlined text-[16px] text-muted-foreground transition-transform",
                            isExpanded ? "rotate-90" : ""
                        )}>
                            chevron_right
                        </span>
                    ) : (
                        <span className="w-4" />
                    )}
                </div>

                {/* Status Icon */}
                <div className="w-5 flex items-center justify-center shrink-0 mt-0.5 mr-2">
                    {getIcon(node.changeType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 break-all">
                    <span className="text-syntax-key mr-2 font-semibold">
                        {node.key}
                        {node.isArrayItem && <span className="text-muted-foreground font-normal ml-0.5">[{node.index}]</span>}
                        :
                    </span>

                    {/* Values */}
                    {node.changeType === 'modified' || node.changeType === 'type-changed' ? (
                        <span className="flex flex-wrap items-center gap-2">
                            <span className="line-through opacity-50">{formatValue(node.oldValue)}</span>
                            <span className="material-symbols-outlined text-[12px] text-muted-foreground">arrow_right_alt</span>
                            <span>{formatValue(node.newValue)}</span>
                        </span>
                    ) : node.changeType === 'removed' ? (
                        <span className="opacity-70">{formatValue(node.oldValue)}</span>
                    ) : (
                        <span>{formatValue(node.newValue)}</span>
                    )}
                </div>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {node.children!.map((child, idx) => (
                        <DiffNodeRenderer
                            key={`${child.key}-${idx}`}
                            node={child}
                            depth={depth + 1}
                            showUnchanged={showUnchanged}
                            expandAll={expandAll}
                            onNodeClick={onNodeClick}
                            onMerge={onMerge}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}