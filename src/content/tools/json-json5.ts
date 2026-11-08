import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Edit, check and convert JSON5 online. Paste standard JSON or JSON5 into the editor and convert it in either direction with one click: strict JSON to readable JSON5, or JSON5 back to strict JSON that any parser accepts.",
        "JSON5 is a superset of JSON designed for files people write by hand. It allows comments, trailing commas, unquoted keys, single-quoted strings, multi-line strings, hexadecimal numbers, and values such as Infinity and NaN. That makes it popular for configuration files that people read and edit by hand.",
        "When converting to JSON5 the editor keeps your comments and applies the quote style, trailing commas, unquoted keys, indentation and key casing you pick in Settings. When converting to JSON, comments and JSON5-only syntax are removed so the result passes JSON.parse, API validators and strict JSON linters.",
        "If the input cannot be parsed, the converter tries to repair common mistakes first and tells you what is wrong, so you can use it as a quick JSON5 validator too. Everything runs in your browser: your data is never uploaded."
    ],
    "features": [
        "Online JSON5 editor with syntax highlighting",
        "Convert JSON to JSON5 and JSON5 back to strict JSON",
        "Keeps comments when converting to JSON5",
        "Choose single or double quotes, trailing commas and unquoted keys",
        "Indent with 2 spaces, 4 spaces or tabs",
        "Optional key case conversion (camelCase, snake_case, kebab-case, PascalCase)",
        "Parse errors shown with the reason, so you can fix invalid JSON5",
        "100% client-side: nothing leaves your browser"
    ],
    "howTo": [
        {
            "title": "Paste your data",
            "description": "Enter standard JSON or JSON5 into the input editor, or load the sample."
        },
        {
            "title": "Pick a direction",
            "description": "Choose JSON → JSON5 to make a file easier to read and edit, or JSON5 → JSON to get strict JSON for an API or parser."
        },
        {
            "title": "Adjust the output",
            "description": "Open Settings to change the quote style, trailing commas, unquoted keys, indentation or key case."
        },
        {
            "title": "Copy the result",
            "description": "The output updates as you type. Copy it to your clipboard with one click."
        }
    ],
    "examples": [
        {
            "title": "Strict JSON to JSON5",
            "description": "With default settings, keys lose their quotes, strings use single quotes and trailing commas are added.",
            "input": "{\n  \"name\": \"Ada\",\n  \"roles\": [\n    \"admin\",\n    \"dev\"\n  ],\n  \"profile\": {\n    \"active\": true\n  }\n}",
            "output": "{\n  name: 'Ada',\n  roles: [\n    'admin',\n    'dev',\n  ],\n  profile: {\n    active: true,\n  },\n}",
            "lang": "json5"
        },
        {
            "title": "JSON5 config file to strict JSON",
            "description": "Comments, unquoted keys, single quotes and trailing commas are converted so the result is valid JSON.",
            "input": "// server settings\n{\n  port: 8080,\n  host: 'localhost',\n  /* enable for local work */\n  debug: true,\n}",
            "output": "{\n  \"port\": 8080,\n  \"host\": \"localhost\",\n  \"debug\": true\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What is JSON5?",
            "answer": "JSON5 is an extension of JSON that is easier for people to write. It adds comments, trailing commas, unquoted object keys, single-quoted and multi-line strings, hexadecimal numbers, leading or trailing decimal points, and Infinity and NaN. It is mostly used for configuration files."
        },
        {
            "question": "Is JSON5 compatible with standard JSON?",
            "answer": "JSON5 is a superset of JSON, so every valid JSON document is also valid JSON5. The reverse is not true: JSON5 features such as comments or trailing commas make a file invalid for JSON.parse and other strict JSON parsers. Convert JSON5 to JSON before sending it to an API."
        },
        {
            "question": "Can I use this as a JSON5 editor?",
            "answer": "Yes. The input is a full code editor with syntax highlighting. Write or paste JSON5, see right away whether it parses, and copy either the JSON5 or the strict JSON version."
        },
        {
            "question": "Does the converter keep my comments?",
            "answer": "Comments are kept when converting JSON to JSON5. When converting JSON5 to JSON they are removed, because standard JSON has no comment syntax."
        },
        {
            "question": "How do I validate a JSON5 file?",
            "answer": "Paste it into the editor and pick JSON5 → JSON. If the file parses you get strict JSON output. If not, an error message explains the problem so you can fix it."
        },
        {
            "question": "What is the file extension for JSON5?",
            "answer": "JSON5 files usually use the .json5 extension. Some tools also accept comments and trailing commas in .json files (often called JSONC), for example tsconfig.json, but that is a separate, smaller extension than JSON5."
        },
        {
            "question": "Is my data uploaded?",
            "answer": "No. Parsing and conversion happen entirely in your browser."
        }
    ],
    "related": [
        "json-validator",
        "json-formatter",
        "json-normalize",
        "json-minifier"
    ]
};

export default content;
