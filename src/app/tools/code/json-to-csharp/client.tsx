"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateCSharpCode } from "@/core/generators/json-to-csharp";
import { CSharpConfig } from "@/core/types/code-generator-config";

export default function CSharpGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateCSharpCode(json, config as CSharpConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="csharp" languageDisplayName="C#" fileExtension="cs" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
