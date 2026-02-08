"use client"

import { useState } from "react";
import { JsonTreeViewerConfig } from "@/core/types/json-viewer-config";

interface JsonTreeNodeProps {
    name?: string;
    value: any;
    path: string;
    depth: number;
    config: JsonTreeViewerConfig;
    isLast: boolean;
    searchTerm?: string;
}

export default function JsonTreeNode({ name, value, path, depth, config, isLast, searchTerm }: JsonTreeNodeProps) {
    const [expanded, setExpanded] = useState(depth < config.autoExpandDepth);

    // Highlight helper
    const highlightText = (text: string, term?: string) => {
        if (!term || !text.toLowerCase().includes(term.toLowerCase())) return text;
        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === term.toLowerCase()
                        ? <span key={i} className="bg-warning/50 text-foreground rounded px-0.5">{part}</span>
                        : part
                )}
            </span>
        );
    };

    const isObject = value !== null && typeof value === 'object';
    const isArray = Array.isArray(value);
    const isEmpty = isObject && Object.keys(value).length === 0;

    const toggleExpand = () => {
        if (isObject && !isEmpty) {
            setExpanded(!expanded);
        }
    };

    // Indentation style
    const indentSize = config.indentation === 'tab' ? 24 : parseInt(config.indentation) * 8; // approx px width
    const paddingLeft = depth * indentSize;

    // Render Primitive Value
    if (!isObject) {
        return (
            <div className="font-mono text-sm leading-relaxed hover:bg-accent/50 px-1 rounded cursor-default flex items-start">
                <div style={{ width: paddingLeft }} className="shrink-0 border-l border-transparent" />

                {/* Key */}
                {name && (
                    <span className="text-primary mr-1">
                        "{highlightText(name, searchTerm)}"<span className="text-muted-foreground/60">:</span>
                    </span>
                )}

                {/* Value */}
                <span className={`${getValueColor(value)}`}>
                    {typeof value === 'string' ? (
                        <>"{highlightText(String(value), searchTerm)}"</>
                    ) : (
                        highlightText(String(value), searchTerm)
                    )}
                </span>

                {/* Comma */}
                {config.showCommas && !isLast && <span className="text-muted-foreground/40">,</span>}
            </div>
        );
    }

    // Render Object / Array
    const keys = Object.keys(value);
    const itemCount = keys.length;
    const openBracket = isArray ? '[' : '{';
    const closeBracket = isArray ? ']' : '}';

    return (
        <div className="font-mono text-sm leading-relaxed">
            {/* Header / Collapsed View */}
            <div
                className="hover:bg-accent/50 px-1 rounded cursor-pointer flex items-center group"
                onClick={toggleExpand}
            >
                <div style={{ width: paddingLeft }} className="shrink-0" />

                {/* Expander Icon */}
                {!isEmpty && (
                    <span className={`material-symbols-outlined text-[16px] text-muted-foreground/40 transition-transform mr-1 ${expanded ? 'rotate-90' : ''}`}>
                        chevron_right
                    </span>
                )}
                {isEmpty && <span className="w-5 mr-1" />}

                {/* Key */}
                {name && (
                    <span className="text-primary mr-1">
                        "{highlightText(name, searchTerm)}"<span className="text-muted-foreground/60">:</span>
                    </span>
                )}

                {/* Brackets & Preview */}
                <span className="text-muted-foreground/60">
                    {config.showBrackets && openBracket}
                    {!expanded && !isEmpty && (
                        <span className="mx-1 text-muted-foreground/40 italic">
                            {config.showItemCounts && (isArray ? `${itemCount} items` : `${itemCount} keys`)}
                            {!config.showItemCounts && "..."}
                        </span>
                    )}
                    {isEmpty && <span className="mx-1" />}
                    {!expanded && config.showBrackets && closeBracket}
                </span>

                {/* Comma (if collapsed) */}
                {!expanded && config.showCommas && !isLast && <span className="text-muted-foreground/40">,</span>}
            </div>

            {/* Children (Expanded) */}
            {expanded && !isEmpty && (
                <div>
                    {keys.map((key, index) => (
                        <JsonTreeNode
                            key={key}
                            name={isArray ? undefined : key}
                            value={value[key]}
                            path={`${path}${path ? '.' : ''}${key}`}
                            depth={depth + 1}
                            config={config}
                            isLast={index === keys.length - 1}
                            searchTerm={searchTerm}
                        />
                    ))}
                    <div className="hover:bg-accent/50 px-1 rounded cursor-default">
                        <div style={{ width: paddingLeft }} className="shrink-0 inline-block" />
                        <span className="w-5 inline-block mr-1" /> {/* Spacer for expander icon alignment */}
                        {config.showBrackets && <span className="text-muted-foreground/60">{closeBracket}</span>}
                        {config.showCommas && !isLast && <span className="text-muted-foreground/40">,</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper: Get color class based on value type
function getValueColor(value: any): string {
    if (typeof value === 'string') return 'text-success';
    if (typeof value === 'number') return 'text-warning';
    if (typeof value === 'boolean') return 'text-primary';
    if (value === null) return 'text-muted-foreground';
    return 'text-foreground';
}

// Helper: Format value for display
function formatValue(value: any): string {
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    return String(value);
}
