"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateJavaCode } from "@/core/generators/json-to-java";
import { JavaConfig } from "@/core/types/code-generator-config";

export default function JavaGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateJavaCode(json, config as JavaConfig);
    }, [config]);

    return (
        <CodeGeneratorBase
            language="java"
            languageDisplayName="Java"
            fileExtension="java"
            input={input}
            setInput={setInput}
            output={output}
            setOutput={setOutput}
            generateCode={handleGenerate}
        />
    );
}
