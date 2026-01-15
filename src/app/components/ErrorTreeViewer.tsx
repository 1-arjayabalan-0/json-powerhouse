"use client"

import { useState } from 'react';
import { JSONError } from '@/core/lib/converters/validateJson';

interface ErrorTreeViewerProps {
    errors: JSONError[];
    warnings: JSONError[];
    onErrorClick?: (error: JSONError) => void;
}

export default function ErrorTreeViewer({ errors, warnings, onErrorClick }: ErrorTreeViewerProps) {
    const [expandedErrors, setExpandedErrors] = useState<Set<number>>(new Set());
    const [expandedWarnings, setExpandedWarnings] = useState<Set<number>>(new Set());

    const toggleError = (index: number) => {
        const newSet = new Set(expandedErrors);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedErrors(newSet);
    };

    const toggleWarning = (index: number) => {
        const newSet = new Set(expandedWarnings);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedWarnings(newSet);
    };

    const renderErrorItem = (error: JSONError, index: number, isError: boolean) => {
        const isExpanded = isError ? expandedErrors.has(index) : expandedWarnings.has(index);
        const toggle = () => isError ? toggleError(index) : toggleWarning(index);

        return (
            <div key={index} className="mb-2">
                <div
                    className={`flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                        isError
                            ? 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/15'
                            : 'bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/15'
                    }`}
                    onClick={toggle}
                >
                    <span
                        className={`material-symbols-outlined text-lg mt-0.5 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                        }`}
                    >
                        chevron_right
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`material-symbols-outlined text-base ${
                                    isError ? 'text-red-400' : 'text-yellow-400'
                                }`}
                            >
                                {isError ? 'error' : 'warning'}
                            </span>
                            <span
                                className={`text-sm font-semibold ${
                                    isError ? 'text-red-400' : 'text-yellow-400'
                                }`}
                            >
                                {isError ? 'Line' : 'Line'} {error.line} {isError ? 'Syntax Error' : 'Warning'}
                            </span>
                        </div>
                        <p className={`text-xs ${isError ? 'text-red-300' : 'text-yellow-300'}`}>
                            {error.message}
                        </p>
                    </div>
                </div>
                {isExpanded && (
                    <div className="ml-6 mt-2 p-3 bg-white/5 rounded border border-white/10">
                        <div className="space-y-2">
                            <div>
                                <span className="text-xs text-white/60">Description:</span>
                                <p className="text-xs text-white/80 mt-1">{error.message}</p>
                            </div>
                            {error.code && (
                                <div>
                                    <span className="text-xs text-white/60">Error Code:</span>
                                    <p className="text-xs text-white/80 mt-1 font-mono">{error.code}</p>
                                </div>
                            )}
                            {error.suggestion && (
                                <div>
                                    <span className="text-xs text-white/60">Suggestion:</span>
                                    <p className="text-xs text-blue-300 mt-1">{error.suggestion}</p>
                                </div>
                            )}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <span className="text-xs text-white/60">Location:</span>
                                <span className="text-xs text-white/80">
                                    Line {error.line}, Column {error.column}
                                </span>
                            </div>
                            {onErrorClick && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onErrorClick(error);
                                    }}
                                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    Go to line {error.line}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-white/10 p-4">
                <h2 className="text-white text-lg font-bold mb-1">ERROR BREAKDOWN</h2>
                <p className="text-white/60 text-xs">Line-by-line analysis</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {errors.length > 0 && (
                    <div>
                        <h3 className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-red-400">error</span>
                            Errors ({errors.length})
                        </h3>
                        <div className="space-y-2">
                            {errors.map((error, index) => renderErrorItem(error, index, true))}
                        </div>
                    </div>
                )}
                {warnings.length > 0 && (
                    <div>
                        <h3 className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-yellow-400">warning</span>
                            Warnings ({warnings.length})
                        </h3>
                        <div className="space-y-2">
                            {warnings.map((warning, index) => renderErrorItem(warning, index, false))}
                        </div>
                    </div>
                )}
                {errors.length === 0 && warnings.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-white/40">
                        <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                        <p className="text-sm">No errors or warnings</p>
                        <p className="text-xs mt-1">JSON is valid</p>
                    </div>
                )}
            </div>
        </div>
    );
}

