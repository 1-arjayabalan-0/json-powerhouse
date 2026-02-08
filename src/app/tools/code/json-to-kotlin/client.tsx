"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateKotlinCode } from "@/core/generators/json-to-kotlin";
import { KotlinConfig } from "@/core/types/code-generator-config";

export default function KotlinGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateKotlinCode(json, config as KotlinConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="kotlin" languageDisplayName="Kotlin" fileExtension="kt" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
