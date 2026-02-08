"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateSwiftCode } from "@/core/generators/json-to-swift";
import { SwiftConfig } from "@/core/types/code-generator-config";

export default function SwiftGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateSwiftCode(json, config as SwiftConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="swift" languageDisplayName="Swift" fileExtension="swift" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
