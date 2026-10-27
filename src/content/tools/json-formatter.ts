import type { ToolContent } from './types';

const content: ToolContent = {
    intro: [
        "JSON PowerHouse Formatter instantly formats and beautifies your JSON data. Paste raw, minified, or messy JSON and get properly indented, readable output. All processing happens in your browser — your data never leaves your device.",
        "Unlike basic formatters, it also repairs common mistakes such as trailing commas, single quotes and unquoted keys, and tells you exactly what it changed.",
    ],
    features: [
        "Customizable indentation (2 spaces, 4 spaces, tabs)",
        "Sort keys alphabetically for consistent structure",
        "Toggle trailing commas on or off",
        "Strip JSON comments for clean output",
        "Remove null values with one click",
        "Copy to clipboard or download formatted file",
    ],
    howTo: [
        { title: "Paste your JSON", description: "Drop your raw JSON into the input editor, or click Sample to load example data." },
        { title: "Adjust settings", description: "Choose indentation style, enable key sorting, toggle comments and trailing commas." },
        { title: "Copy or download", description: "Get your formatted JSON instantly from the output panel." },
    ],
    examples: [
        {
            title: "Minified API response",
            description: "A one-line payload becomes readable with indentation set to 2 spaces.",
            lang: "json",
            input: '{"id":7,"name":"Ada","roles":["admin","dev"],"active":true}',
            output: '{\n  "id": 7,\n  "name": "Ada",\n  "roles": [\n    "admin",\n    "dev"\n  ],\n  "active": true\n}',
        },
    ],
    faq: [
        { question: "What is a JSON Formatter?", answer: "A JSON Formatter takes raw or minified JSON and reformats it with proper indentation, line breaks, and spacing to make it human-readable." },
        { question: "Is my data safe?", answer: "Yes. All formatting happens in your browser. Your JSON data is never sent to any server." },
        { question: "Can I format JSON with comments?", answer: "Yes. JSON PowerHouse supports JSONC (JSON with comments). You can strip or preserve comments during formatting." },
    ],
    related: ['json-validator', 'json-minifier', 'json-viewer', 'json-diff', 'json-to-typescript'],
};

export default content;
