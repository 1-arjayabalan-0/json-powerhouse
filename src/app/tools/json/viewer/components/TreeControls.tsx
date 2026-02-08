"use client"

import { JsonTreeViewerConfig } from "@/core/types/json-viewer-config";

interface TreeControlsProps {
    config: JsonTreeViewerConfig;
    setConfig: (config: JsonTreeViewerConfig) => void;
    onExpandAll: () => void;
    onCollapseAll: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function TreeControls({ config, setConfig, onExpandAll, onCollapseAll, searchTerm, onSearchChange }: TreeControlsProps) {
    return (
        <div className="flex items-center gap-2 w-full py-1 sm:py-0">
            {/* Expand / Collapse */}
            <div className="flex items-center bg-muted rounded-lg p-1 border border-border h-[34px] shrink-0">
                <button
                    onClick={onExpandAll}
                    className="h-6 px-1 hover:bg-card rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Expand All"
                >
                    <span className="material-symbols-outlined text-lg">unfold_more</span>
                </button>
                <button
                    onClick={onCollapseAll}
                    className="h-6 px-1 hover:bg-card rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Collapse All"
                >
                    <span className="material-symbols-outlined text-lg">unfold_less</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-[300px]">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted-foreground opacity-60 text-lg">search</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tree..."
                    className="bg-muted border border-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/50 w-full min-w-0"
                />
            </div>
        </div>
    );
}
