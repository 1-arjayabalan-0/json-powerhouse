"use client"

import { prettifyJson } from "@/core/lib/converters/prettifyJson";
import { useEffect, useCallback } from "react";
import { JSONFormatterConfig } from "@/core/types/json-formatter-config";
import CodeEditor from "../../components/CodeEditor";
import { Button } from "@/app/components/ui/button";

interface JSONFormatterProps {
    config: JSONFormatterConfig;
    input: string;
    setInput: (value: string) => void;
    formatted: string;
    setFormatted: (value: string) => void;
    onCopy?: () => void;
    onDownload?: () => void;
}

export default function JSONFormatter({ config, input, setInput, formatted, setFormatted, onCopy, onDownload }: JSONFormatterProps) {
    // Internal state removed in favor of props

    const handleFormat = useCallback((val: any) => {
        const result = prettifyJson(val, config);
        if (result) {
            setFormatted(result);
        } else {
            setFormatted("❌ Invalid JSON");
        }
    }, [config, setFormatted]);

    // Re-format when config changes
    useEffect(() => {
        if (input) {
            handleFormat(input);
        }
    }, [config, input, handleFormat]);

    return (
        <div className="grid flex-1 grid-cols-1 gap-px overflow-hidden bg-white/10 md:grid-cols-2">
            {/* <!-- Left Pane --> */}
            <div className="flex flex-col bg-background-dark border-r border-r-gray-600">
                {/* <!-- Tabs --> */}
                <div className="border-b border-white/10">
                    <div className="flex px-4 gap-6">
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-primary pb-2.5 pt-3 text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Input</p>
                        </a>
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-transparent pb-2.5 pt-3 text-white/60 hover:text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Errors</p>
                        </a>
                    </div>
                </div>
                {/* <!-- TextField --> */}
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <CodeEditor
                        value={input}
                        language="json"
                        onChange={(val) => {
                            setInput(val || '');
                            handleFormat(val || '');
                        }}
                        placeholder='{ "paste": "your json here" }'
                    />
                </div>
            </div>
            {/* <!-- Right Pane --> */}
            <div className="flex flex-col bg-background-dark">
                {/* <!-- Tabs --> */}
                <div className="border-b border-white/10">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex gap-6">
                            <a className="flex flex-col items-center justify-center border-b-[2px] border-primary pb-2.5 pt-3 text-white" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Output</p>
                            </a>
                            {/* <a className="flex flex-col items-center justify-center border-b-[2px] border-transparent pb-2.5 pt-3 text-white/60 hover:text-white" href="#">
                                <p className="text-sm font-bold leading-normal tracking-[0.015em]">AI Suggestions</p>
                            </a> */}
                        </div>
                        {(onCopy || onDownload) && (
                            <div className="flex gap-2">
                                {onCopy && (
                                    <Button
                                        onClick={onCopy}
                                        disabled={!formatted || formatted === "❌ Invalid JSON"}
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/10 text-white hover:bg-white/20 h-7 text-xs"
                                    >
                                        Copy
                                    </Button>
                                )}
                                {onDownload && (
                                    <Button
                                        onClick={onDownload}
                                        disabled={!formatted || formatted === "❌ Invalid JSON"}
                                        variant="secondary"
                                        size="sm"
                                        className="bg-white/10 text-white hover:bg-white/20 h-7 text-xs"
                                    >
                                        Download
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* <!-- TextField --> */}
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <CodeEditor
                        value={formatted}
                        language="json"
                        readOnly={true}
                    />
                </div>
            </div>

        </div>

    )
}
