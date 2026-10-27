import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Automatically generate TypeScript interfaces from your JSON data. Paste any JSON object and get properly typed TypeScript definitions.",
        "Nested objects become their own interfaces, with each field typed from the sample value. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate TypeScript interfaces from JSON",
        "Automatic nested type generation",
        "Handles arrays, unions, and optional properties",
        "Support for type aliases and enums",
        "Copy generated types to clipboard",
        "Client-side processing — your data stays private"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object representing your data structure."
        },
        {
            "title": "Generate TypeScript",
            "description": "The tool instantly produces matching TypeScript interfaces."
        },
        {
            "title": "Copy and use",
            "description": "Copy the generated types and paste them into your TypeScript project."
        }
    ],
    "examples": [
        {
            "title": "Generating TypeScript interfaces",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the generated types. The default output also includes a Convert class and runtime type-checking helpers (about 180 more lines).",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "export interface Root {\n    id:      number;\n    name:    string;\n    email:   string;\n    active:  boolean;\n    tags:    string[];\n    address: Address;\n}\n\nexport interface Address {\n    city: string;",
            "lang": "ts"
        }
    ],
    "faq": [
        {
            "question": "How does JSON to TypeScript conversion work?",
            "answer": "The tool analyzes your JSON structure — keys, value types, nested objects, arrays — and generates corresponding TypeScript interfaces."
        },
        {
            "question": "Can it handle nested objects?",
            "answer": "Yes. Deeply nested structures are converted into separate TypeScript interfaces for each level."
        }
    ],
    "related": [
        "json-to-java",
        "json-to-python",
        "json-to-csharp",
        "json-formatter"
    ]
};

export default content;
