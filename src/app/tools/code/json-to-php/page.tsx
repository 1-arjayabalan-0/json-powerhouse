"use client"

import { useState, useCallback } from 'react';
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generatePHPCode } from "@/core/generators/json-to-php";
import { PHPConfig } from "@/core/types/code-generator-config";
import { usePersistentState } from "@/app/hooks/usePersistentState";

export default function PHPGeneratorPage() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generatePHPCode(json, config as PHPConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="php" languageDisplayName="PHP" fileExtension="php" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
