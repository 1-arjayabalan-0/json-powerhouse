"use client"

import { JsonTreeViewerConfig } from "@/app/types/json-viewer-config";

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
        <div className="flex items-center gap-2">
            {/* Expand / Collapse */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                <button
                    onClick={onExpandAll}
                    className="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
                    title="Expand All"
                >
                    <span className="material-symbols-outlined text-lg">unfold_more</span>
                </button>
                <button
                    onClick={onCollapseAll}
                    className="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
                    title="Collapse All"
                >
                    <span className="material-symbols-outlined text-lg">unfold_less</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 text-lg">search</span>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search..."
                    className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary/50 w-48"
                />
            </div>
        </div>
    );
}
