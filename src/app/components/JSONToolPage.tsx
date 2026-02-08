"use client"

import JSONFormatter from "../tools/json/formatter/JSONFormatter";
import { useConfig } from "@/app/context/ConfigContext";
import { useEffect, useState } from "react";
import { toolPresets, toolMetadata } from "@/app/config/tool-presets";
import { JSONFormatterConfig } from "../types/json-formatter-config";
import { toast } from "sonner";

interface JSONToolPageProps {
    toolId: string;
}

import { usePersistentState } from "../hooks/usePersistentState";

export default function JSONToolPage({ toolId }: JSONToolPageProps) {
    const { config, setConfig } = useConfig();
    const metadata = toolMetadata[toolId] || toolMetadata['json-formatter'];
    const preset = toolPresets[toolId] || {};

    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [formatted, setFormatted] = useState("");

    // Apply preset configuration when tool loads
    useEffect(() => {
        if (Object.keys(preset).length > 0) {
            setConfig((prevConfig: JSONFormatterConfig) => ({
                ...prevConfig,
                ...preset,
            }));
        }
    }, [toolId, preset, setConfig]);



    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(formatted);
            toast.success("Copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy!', err);
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        try {
            const blob = new Blob([formatted], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'formatted.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("Download started!");
        } catch (err) {
            console.error('Download failed', err);
            toast.error("Download failed");
        }
    };
    const handleClear = () => {
        setInput("");
        setFormatted("");
    };

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
