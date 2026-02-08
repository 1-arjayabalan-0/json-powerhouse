"use client"

import { JsonTreeViewerConfig, IndentationType } from "@/core/types/json-viewer-config";

interface TreeSettingsProps {
    config: JsonTreeViewerConfig;
    setConfig: (config: JsonTreeViewerConfig) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function TreeSettings({ config, setConfig, isOpen, onClose }: TreeSettingsProps) {
    if (!isOpen) return null;

    const updateConfig = <K extends keyof JsonTreeViewerConfig>(key: K, value: JsonTreeViewerConfig[K]) => {
        setConfig({ ...config, [key]: value });
    };

    return (
        <div className="absolute right-0 top-12 z-10 w-64 bg-popover border border-border rounded-lg shadow-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-popover-foreground font-bold text-sm">View Settings</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-popover-foreground">
                    <span className="material-symbols-outlined text-sm">close</span>
                </button>
            </div>

            {/* Indentation */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Indentation</label>
                <select
                    value={config.indentation}
                    onChange={(e) => updateConfig('indentation', e.target.value as IndentationType)}
                    className="bg-muted border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none"
                >
                    <option value="2">2 Spaces</option>
                    <option value="4">4 Spaces</option>
                    <option value="tab">Tab</option>
                </select>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2">
                <Toggle
                    label="Show Commas"
                    checked={config.showCommas}
                    onChange={(v) => updateConfig('showCommas', v)}
                />
                <Toggle
                    label="Show Brackets"
                    checked={config.showBrackets}
                    onChange={(v) => updateConfig('showBrackets', v)}
                />
                <Toggle
                    label="Show Item Counts"
                    checked={config.showItemCounts}
                    onChange={(v) => updateConfig('showItemCounts', v)}
                />
            </div>
        </div>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}
            >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
        </div>
    );
}
