"use client"

import { useState, useCallback } from 'react';
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { generateDartCode } from "@/core/generators/json-to-dart";
import { DartConfig } from "@/core/types/code-generator-config";

export default function DartGeneratorClient() {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");

    const handleGenerate = useCallback(async (json: string) => {
        return await generateDartCode(json, config as DartConfig);
    }, [config]);

    return (
        <CodeGeneratorBase language="dart" languageDisplayName="Dart" fileExtension="dart" input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={handleGenerate} />
    );
}
