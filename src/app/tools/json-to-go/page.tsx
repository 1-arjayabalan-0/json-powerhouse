"use client"

import { useState, useCallback } from 'react';
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateGoCode } from "./generator";
import { GoConfig } from "@/app/types/code-generator-config";

export default function GoGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateGoCode(json, config as GoConfig);
    }, [config]);

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-1 pl-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">JSON to Go</h1>
                    <p className="text-white/60 text-sm font-normal leading-normal">Convert JSON to Go structs with JSON tags.</p>
                </div>
            </div>
            <CodeGeneratorBase language="go" languageDisplayName="Go" fileExtension="go" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
        </>
    );
}
