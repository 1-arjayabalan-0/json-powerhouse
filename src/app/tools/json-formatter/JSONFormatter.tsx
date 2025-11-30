"use client"

import { prettifyJson } from "@/app/lib/converters/prettifyJson";
import { useEffect, useCallback } from "react";
import { JSONFormatterConfig } from "@/app/types/json-formatter-config";

interface JSONFormatterProps {
    config: JSONFormatterConfig;
    input: string;
    setInput: (value: string) => void;
    formatted: string;
    setFormatted: (value: string) => void;
}

export default function JSONFormatter({ config, input, setInput, formatted, setFormatted }: JSONFormatterProps) {
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
                    <textarea
                        className="font-mono w-full h-full resize-none p-4 rounded text-white outline-0 bg-white/10"
                        placeholder='{ "paste": "your json here" }'
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value)
                            handleFormat(e.target.value)
                        }}
                    />
                </div>
            </div>
            {/* <!-- Right Pane --> */}
            <div className="flex flex-col bg-background-dark">
                {/* <!-- Tabs --> */}
                <div className="border-b border-white/10">
                    <div className="flex px-4 gap-6">
                        <a className="flex flex-col items-center justify-center border-b-[2px] border-primary pb-2.5 pt-3 text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">Output</p>
                        </a>
                        {/* <a className="flex flex-col items-center justify-center border-b-[2px] border-transparent pb-2.5 pt-3 text-white/60 hover:text-white" href="#">
                            <p className="text-sm font-bold leading-normal tracking-[0.015em]">AI Suggestions</p>
                        </a> */}
                    </div>
                </div>
                {/* <!-- TextField --> */}
                <div className="relative flex flex-1 flex-col overflow-hidden">
                    <textarea className="font-mono w-full flex-1 resize-none rounded-none border-none bg-transparent p-4 text-sm text-white/90 focus:outline-0 focus:ring-0 bg-white/10"
                        readOnly={true} value={formatted}>
                    </textarea>
                </div>
            </div>

        </div>

    )
}
