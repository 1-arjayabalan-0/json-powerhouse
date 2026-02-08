"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generatePythonCode } from "@/core/generators/json-to-python";
import { PythonConfig } from "@/core/types/code-generator-config";

export default function PythonGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generatePythonCode(json, config as PythonConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="python" languageDisplayName="Python" fileExtension="py" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
