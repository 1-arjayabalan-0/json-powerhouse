"use client"

import { useState, useCallback } from 'react';
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateGoCode } from "@/core/generators/json-to-go";
import { GoConfig } from "@/core/types/code-generator-config";
import { usePersistentState } from "@/app/hooks/usePersistentState";

export default function GoGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateGoCode(json, config as GoConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="go" languageDisplayName="Go" fileExtension="go" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
