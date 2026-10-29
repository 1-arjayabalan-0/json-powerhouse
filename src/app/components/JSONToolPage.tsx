"use client"

import JSONFormatter from "../tools/json/formatter/JSONFormatter";
import { useConfig } from "@/app/context/ConfigContext";
import { useState } from "react";
import { usePersistentState } from "../hooks/usePersistentState";

interface JSONToolPageProps {
    toolId: string;
}

export default function JSONToolPage(_props: JSONToolPageProps) {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [formatted, setFormatted] = useState("");

    return (
        <JSONFormatter
            config={config}
            input={input}
            setInput={setInput}
            formatted={formatted}
            setFormatted={setFormatted}
        />
    );
}
