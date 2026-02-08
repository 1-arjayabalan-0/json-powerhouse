"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateTypeScriptCode } from "@/core/generators/json-to-typescript";
import { TypeScriptConfig } from "@/core/types/code-generator-config";

export default function TypeScriptGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateTypeScriptCode(json, config as TypeScriptConfig);
    }, [config]);

    return (
        <CodeGeneratorBase
            language="typescript"
            languageDisplayName="TypeScript"
            fileExtension="ts"
            input={input}
            setInput={setInput}
            output={output}
            setOutput={setOutput}
            generateCode={handleGenerate}
        />
    );
}
