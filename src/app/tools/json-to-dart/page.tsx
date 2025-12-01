"use client"

import { useState, useCallback } from 'react';
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateDartCode } from "./generator";
import { DartConfig } from "@/app/types/code-generator-config";

export default function DartGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateDartCode(json, config as DartConfig);
    }, [config]);

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-1 pl-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">JSON to Dart</h1>
                    <p className="text-white/60 text-sm font-normal leading-normal">Convert JSON to Dart classes for Flutter applications.</p>
                </div>
            </div>
            <CodeGeneratorBase language="dart" languageDisplayName="Dart" fileExtension="dart" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
        </>
    );
}
