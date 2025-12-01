"use client"

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CodeGeneratorBaseProps {
    language: string;
    languageDisplayName: string;
    fileExtension: string;
    input: string;
    setInput: (value: string) => void;
    output: string;
    setOutput: (value: string) => void;
    generateCode: (json: string) => Promise<string>;
}

export default function CodeGeneratorBase({
    language,
    languageDisplayName,
    fileExtension,
    input,
    setInput,
    output,
    setOutput,
    generateCode,
}: CodeGeneratorBaseProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Auto-generate when input changes
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (input.trim()) {
                try {
                    setIsGenerating(true);
                    const code = await generateCode(input);
                    setOutput(code);
                } catch (error: any) {
                    setOutput(`// Error: ${error.message || 'Invalid JSON'}`);
                } finally {
                    setIsGenerating(false);
                }
            } else {
                setOutput('');
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [input, generateCode]);

    const handleCopy = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            toast.success('Code copied to clipboard!');
        }
    };

    const handleDownload = () => {
        if (output) {
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated.${fileExtension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Code downloaded!');
        }
    };

    const handleLoadSample = () => {
        const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "coding", "gaming"],
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  }
}`;
        setInput(sampleJSON);
        toast.info('Sample JSON loaded');
    };

    return (
        <div className="flex h-full min-h-0 flex-1 gap-4 p-4">
            {/* Input Pane */}
            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-sm font-semibold">JSON Input</h3>
                    <button
                        onClick={handleLoadSample}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Load Sample
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste your JSON here..."
                    className="flex-1 rounded-lg bg-[#1a1a1a] p-4 text-white font-mono text-sm border border-white/10 focus:border-blue-500 focus:outline-none resize-none"
                    spellCheck={false}
                />
            </div>

            {/* Output Pane */}
            <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-white text-sm font-semibold">
                        {languageDisplayName} Output
                        {isGenerating && <span className="ml-2 text-xs text-blue-400">Generating...</span>}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className="text-xs px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Copy
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={!output}
                            className="text-xs px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Download
                        </button>
                    </div>
                </div>
                <textarea
                    value={output}
                    readOnly
                    placeholder={`Generated ${languageDisplayName} code will appear here...`}
                    className="flex-1 rounded-lg bg-[#1a1a1a] p-4 text-white font-mono text-sm border border-white/10 resize-none"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
