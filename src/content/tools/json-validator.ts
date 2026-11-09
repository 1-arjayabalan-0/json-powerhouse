import type { ToolContent } from './types';

const content: ToolContent = {
    "updated": "2026-11-08",
    "intro": [
        "Check whether your JSON is valid and find exactly what is wrong when it is not. Paste a JSON string, an API response or a config file, and the validator checks it as you type. It flags syntax errors such as missing or trailing commas, unquoted keys, single quotes, comments and unmatched brackets.",
        "Each problem is marked in the editor at its line and column with a plain-language message, for example \"Trailing commas are not allowed in standard JSON\", instead of the bare \"Unexpected token\" you get from JSON.parse.",
        "Most problems can also be fixed for you. The validator repairs common mistakes such as single quotes, unquoted keys, trailing commas, comments, a byte order mark (BOM), double-encoded (stringified) JSON, JSON wrapped in log output, and truncated JSON. You can review each fix before you accept it, then copy clean, formatted, valid JSON.",
        "Validation runs entirely in your browser, so it is safe to use with private API payloads, tokens and production data."
    ],
    "features": [
        "Real-time JSON syntax checking as you type",
        "Errors marked in the editor with line and column",
        "Clear messages that explain each problem",
        "One-click repair of common errors, applied one by one or all at once",
        "Handles comments, trailing commas, single quotes and unquoted keys",
        "Detects stringified JSON, a BOM, and JSON embedded in logs",
        "Repairs truncated or partial JSON",
        "100% client-side: your data stays private"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter or paste your JSON into the input editor, or load the sample."
        },
        {
            "title": "Review the issues",
            "description": "Problems are underlined in the editor and listed with their line, column and an explanation."
        },
        {
            "title": "Fix or auto-repair",
            "description": "Edit the input yourself, or apply the suggested fixes to repair it automatically."
        },
        {
            "title": "Copy valid JSON",
            "description": "Once the status shows valid, copy the formatted JSON from the output panel."
        }
    ],
    "examples": [
        {
            "title": "Repairing and validating broken JSON",
            "description": "This input uses unquoted keys, single quotes and trailing commas. The validator repairs it and shows the formatted valid JSON.",
            "input": "{name: 'Ada', age: 36, tags: ['dev',],}",
            "output": "{\n  \"name\": \"Ada\",\n  \"age\": 36,\n  \"tags\": [\n    \"dev\"\n  ]\n}",
            "lang": "json"
        },
        {
            "title": "Comments in a config file",
            "description": "Standard JSON has no comment syntax. The validator flags the comment and can remove it to make the file valid.",
            "input": "{\n  // retry settings\n  \"retries\": 3,\n  \"timeout\": 5000\n}",
            "output": "{\n  \"retries\": 3,\n  \"timeout\": 5000\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What does a JSON validator do?",
            "answer": "It checks text against the JSON specification (RFC 8259) and reports anything that would make a standard parser fail, such as missing commas, unmatched brackets, unquoted keys or invalid values, and tells you where the error is."
        },
        {
            "question": "Why is my JSON invalid?",
            "answer": "The most common causes are trailing commas, missing commas between items, single quotes instead of double quotes, unquoted keys, comments, and unescaped characters inside strings. Values like undefined, NaN or Infinity are also not allowed in JSON."
        },
        {
            "question": "Can the validator fix my JSON automatically?",
            "answer": "Yes, for most common errors. It can convert single quotes, quote keys, remove trailing commas and comments, strip a BOM, unwrap stringified JSON, extract JSON from log output and complete truncated JSON. Missing data cannot be guessed, so some errors still need a manual fix."
        },
        {
            "question": "What does \"Unexpected token\" mean in JSON?",
            "answer": "The parser found a character where the JSON grammar does not allow one, often a quote, comma or bracket that is missing or extra just before that position. Paste the JSON here to see the exact line and the reason."
        },
        {
            "question": "Is JSON with comments valid?",
            "answer": "Not in standard JSON. Some tools accept JSONC (JSON with comments) or JSON5, but APIs and JSON.parse reject comments. Remove them, or convert the file with the Normalize or JSON5 tools."
        },
        {
            "question": "Is it safe to validate sensitive JSON here?",
            "answer": "Yes. Validation runs in your browser and your JSON is never sent to a server."
        }
    ],
    "related": [
        "json-formatter",
        "json-json5",
        "json-normalize",
        "json-to-json-schema"
    ]
};

export default content;
