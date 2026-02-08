"use client"

import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { cn } from "@/app/lib/utils";
import { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
    value: string;
    language: string;
    readOnly?: boolean;
    onChange?: (value: string | undefined) => void;
    onGenerate?: () => void;
    onFix?: () => void;
    placeholder?: string;
    height?: string;
    selection?: {
        startLineNumber: number;
        startColumn: number;
        endLineNumber: number;
        endColumn: number;
    } | null;

    className?: string;
    minimal?: boolean;
    focusOnSelection?: boolean;
    decorations?: any[];
    options?: any;
    onGlyphMarginClick?: (line: number) => void;
    onMount?: (editor: any, monaco: any) => void;
}

export default function CodeEditor({
    value,
    language,
    readOnly = false,
    onChange,
    onGenerate,
    onFix,
    placeholder,
    height = '100%',
    selection,
    className,
    minimal = false,
    focusOnSelection = true,
    decorations = [],
    options = {},
    onGlyphMarginClick,
    onMount
}: CodeEditorProps) {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean } | null>(null);
    const decorationIds = useRef<string[]>([]);

    // Handle decorations
    useEffect(() => {
        if (editorRef.current) {
            // Delta decorations: (oldDecorations, newDecorations)
            decorationIds.current = editorRef.current.deltaDecorations(decorationIds.current, decorations);
        }
    }, [decorations]);

    // Handle selection changes
    useEffect(() => {
        if (editorRef.current && selection) {
            editorRef.current.revealRangeInCenter(selection);
            editorRef.current.setSelection(selection);
            if (focusOnSelection) {
                editorRef.current.focus();
            }
        }
    }, [selection, focusOnSelection]);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    const handleEditorChange = (value: string | undefined) => {
        if (onChange && !readOnly) {
            onChange(value || '');
        }
    };

    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;

        // Glyph Margin Click Handler
        if (onGlyphMarginClick) {
            editor.onMouseDown((e: any) => {
                if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                    const lineNumber = e.target.position.lineNumber;
                    onGlyphMarginClick(lineNumber);
                }
            });
        }

        monaco.editor.defineTheme('json-powerhouse-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0B0E14', // --background (Deep Navy)
                'minimap.background': '#0B0E14',
                'editor.lineHighlightBackground': '#1E293B', // --muted
                'editorGutter.background': '#0B0E14',
                'scrollbarSlider.background': '#334155', // Slate 700
                'scrollbarSlider.hoverBackground': '#475569', // Slate 600
                'scrollbarSlider.activeBackground': '#64748B', // Slate 500
            }
        });

        monaco.editor.defineTheme('json-powerhouse-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#F8FAFC', // --background (Slate 50)
                'minimap.background': '#F8FAFC',
                'editor.lineHighlightBackground': '#F1F5F9', // --muted
                'editorGutter.background': '#F8FAFC',
                'scrollbarSlider.background': '#CBD5E1', // Slate 300
                'scrollbarSlider.hoverBackground': '#94A3B8', // Slate 400
                'scrollbarSlider.activeBackground': '#64748B', // Slate 500
            }
        });

        monaco.editor.setTheme(theme === 'dark' ? 'json-powerhouse-dark' : 'json-powerhouse-light');

        // Add Command: Ctrl + K, Enter -> Generate
        if (onGenerate) {
            editor.addCommand(
                monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, monaco.KeyCode.Enter),
                () => {
                    onGenerate();
                }
            );
        }

        if (onMount) {
            onMount(editor, monaco);
        }
    };

    const handleCopy = () => {
        const editor = editorRef.current;
        if (editor) {
            editor.trigger('source', 'editor.action.clipboardCopyAction');
            editor.focus();
        }
        setContextMenu(null);
    };

    const handlePaste = async () => {
        const editor = editorRef.current;
        if (editor && !readOnly) {
            try {
                const text = await navigator.clipboard.readText();
                if (text) {
                    const selection = editor.getSelection();
                    editor.executeEdits('paste', [{
                        range: selection,
                        text: text,
                        forceMoveMarkers: true
                    }]);
                    editor.focus();
                }
            } catch (e) {
                console.error('Paste failed', e);
            }
        }
        setContextMenu(null);
    };

    const handleGenerateAction = () => {
        if (onGenerate) onGenerate();
        setContextMenu(null);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div
            ref={containerRef}
            className={cn("flex-1 rounded-lg overflow-hidden border border-border h-full bg-card relative", className)}
            onContextMenu={handleContextMenu}
        >
            <Editor
                height={height}
                language={language}
                value={value || ''}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="json-powerhouse"
                options={{
                    readOnly,
                    contextmenu: false, // Disable default context menu
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    wrappingIndent: 'indent',
                    renderLineHighlight: 'all',
                    cursorBlinking: readOnly ? 'solid' : 'blink',

                    // Minimal mode options
                    ...(minimal ? {
                        quickSuggestions: false,
                        parameterHints: { enabled: false },
                        suggestOnTriggerCharacters: false,
                        acceptSuggestionOnEnter: "off",
                        tabCompletion: "off",
                        wordBasedSuggestions: "off",
                        links: false,
                        folding: false,
                        glyphMargin: true,
                        lightbulb: { enabled: false },
                        // contextmenu: false is already set globally above
                    } : {}),

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
                    ...options,
                }}
                loading={
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground text-sm">Loading editor...</div>
                    </div>
                }
            />
            {placeholder && !value && (
                <div className="absolute top-3 left-18 text-muted-foreground pointer-events-none font-mono text-sm z-10">
                    {placeholder}
                </div>
            )}

            {/* Custom Context Menu */}
            {contextMenu?.visible && (
                <div
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    className="fixed z-[9999] bg-popover border border-border shadow-xl rounded-md py-1 min-w-[180px] text-popover-foreground text-sm animate-in fade-in zoom-in-95 duration-100"
                >
                    <button
                        onClick={handleCopy}
                        className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-primary-foreground flex items-center justify-between group transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined !text-[16px] text-muted-foreground group-hover:text-primary-foreground">content_copy</span>
                            <span>Copy</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground group-hover:text-primary-foreground/80 font-mono">Ctrl+C</span>
                    </button>

                    {!readOnly && (
                        <button
                            onClick={handlePaste}
                            className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-primary-foreground flex items-center justify-between group transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined !text-[16px] text-muted-foreground group-hover:text-primary-foreground">content_paste</span>
                                <span>Paste</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground group-hover:text-primary-foreground/80 font-mono">Ctrl+V</span>
                        </button>
                    )}

                    {onFix && (
                        <>
                            <div className="h-px bg-border my-1 mx-1" />
                            <button
                                onClick={() => { onFix(); setContextMenu(null); }}
                                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-primary-foreground flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined !text-[16px] text-muted-foreground group-hover:text-primary-foreground">auto_fix</span>
                                    <span>Quick Fix</span>
                                </div>
                            </button>
                        </>
                    )}

                    {onGenerate && (
                        <>
                            <div className="h-px bg-border my-1 mx-1" />
                            <button
                                onClick={handleGenerateAction}
                                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-primary-foreground flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined !text-[16px] text-muted-foreground group-hover:text-primary-foreground">play_arrow</span>
                                    <span>Generate</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground group-hover:text-primary-foreground/80 font-mono">Ctrl+K ↵</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
