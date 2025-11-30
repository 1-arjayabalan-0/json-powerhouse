"use client"

import JSONFormatter from "./JSONFormatter";
import { useConfig } from "@/app/context/ConfigContext";
import { useState } from "react";

export default function JSONFormatterPage() {
    const { config } = useConfig();
    const [input, setInput] = useState("");
    const [formatted, setFormatted] = useState("");

    const handleClear = () => {
        setInput("");
        setFormatted("");
    };

    return (
        <>
            {/* <!-- PageHeading --> */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-1 pl-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">JSON Formatter</h1>
                    <p className="text-white/60 text-sm font-normal leading-normal">Paste your JSON below to format it instantly.</p>
                </div>
            </div>

            {/* <!-- Dual Pane Editor --> */}
            <JSONFormatter
                config={config}
                input={input}
                setInput={setInput}
                formatted={formatted}
                setFormatted={setFormatted}
            />

            {/* <!-- Bottom Action Bar --> */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 bg-background-dark/80 p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleClear}
                        className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20"
                    >
                        <span className="material-symbols-outlined text-xl">delete</span>
                        <span className="truncate">Clear</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                        <span className="material-symbols-outlined text-xl">content_copy</span>
                        <span className="truncate">Copy</span>
                    </button>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                        <span className="material-symbols-outlined text-xl">download</span>
                        <span className="truncate">Download</span>
                    </button>
                </div>
            </div>
        </>
    );
}