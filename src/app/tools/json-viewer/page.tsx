"use client"

import { useState } from "react";
import { toolMetadata } from "@/app/config/tool-presets";
import JsonTreeViewer from "./components/JsonTreeViewer";

export default function JsonViewerPage() {
    const metadata = toolMetadata['json-viewer'];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-1 pl-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-3xl text-primary">{metadata?.icon || 'account_tree'}</span>
                        <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">{metadata?.title || 'JSON Viewer'}</h1>
                    </div>
                    <p className="text-white/60 text-sm font-normal leading-normal">{metadata?.description || 'Visualize your JSON data in an interactive tree view.'}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <JsonTreeViewer />
            </div>
        </div>
    );
}
