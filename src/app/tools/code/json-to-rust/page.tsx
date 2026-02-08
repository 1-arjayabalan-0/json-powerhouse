"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateRustCode } from "@/core/generators/json-to-rust";
import { RustConfig } from "@/core/types/code-generator-config";

export default function RustGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateRustCode(json, config as RustConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="rust" languageDisplayName="Rust" fileExtension="rs" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
