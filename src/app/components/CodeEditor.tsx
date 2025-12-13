"use client"

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { cn } from "@/app/lib/utils";

interface CodeEditorProps {
    value: string;
    language: string;
    readOnly?: boolean;
    onChange?: (value: string | undefined) => void;
    placeholder?: string;
    height?: string;
    className?: string;
}

export default function CodeEditor({
    value,
    language,
    readOnly = false,
    onChange,
    placeholder,
    height = '100%',
    className,
}: CodeEditorProps) {
    const { theme } = useTheme();

    const handleEditorChange = (value: string | undefined) => {
        if (onChange && !readOnly) {
            onChange(value || '');
        }
    };

    return (
        <div className={cn("flex-1 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e1e]", className)}>
            <Editor
                height={height}
                language={language}
                value={value || ''}
                onChange={handleEditorChange}
                theme={theme === 'light' ? 'vs-light' : 'vs-dark'}
                options={{
                    readOnly,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    wrappingIndent: 'indent',
                    renderLineHighlight: readOnly ? 'none' : 'all',
                    cursorBlinking: readOnly ? 'solid' : 'blink',
                    scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                    },
                    padding: {
                        top: 12,
                        bottom: 12,
                    },
                    fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
                    fontLigatures: true,
                    bracketPairColorization: {
                        enabled: true,
                    },
                    guides: {
                        indentation: true,
                        bracketPairs: true,
                    },
                }}
                loading={
                    <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
                        <div className="text-white/60 text-sm">Loading editor...</div>
                    </div>
                }
            />
        </div>
    );
}
