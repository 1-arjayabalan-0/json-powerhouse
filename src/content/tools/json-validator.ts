import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Instantly validate your JSON data. Paste any JSON string and get immediate feedback on syntax errors, missing commas, unmatched brackets, and more.",
        "When the input is not valid JSON the validator tries to repair common problems such as single quotes, unquoted keys and trailing commas, then shows the cleaned, formatted result."
    ],
    "features": [
        "Real-time JSON syntax validation",
        "Detailed error messages with line and column numbers",
        "Highlights problematic characters",
        "Supports standard JSON and JSONC (with comments)",
        "Validates nested structures and arrays",
        "100% client-side — your data stays private"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter or paste your JSON data into the input editor."
        },
        {
            "title": "See validation results",
            "description": "The tool instantly checks your JSON and highlights any syntax errors."
        },
        {
            "title": "Fix and re-validate",
            "description": "Correct errors based on the detailed messages, then re-paste to verify."
        }
    ],
    "examples": [
        {
            "title": "Repairing and validating broken JSON",
            "description": "This input uses unquoted keys, single quotes and trailing commas. The validator repairs it and shows the formatted valid JSON.",
            "input": "{name: 'Ada', age: 36, tags: ['dev',],}",
            "output": "{\n  \"name\": \"Ada\",\n  \"age\": 36,\n  \"tags\": [\n    \"dev\"\n  ]\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What does a JSON Validator do?",
            "answer": "It checks your JSON data for syntax errors like missing commas, unmatched brackets, unquoted keys, and invalid values. It tells you exactly where the error is."
        },
        {
            "question": "Why is my JSON invalid?",
            "answer": "Common reasons: missing commas, trailing commas, unquoted keys, single quotes, and comments (not supported in standard JSON)."
        }
    ],
    "related": [
        "json-formatter",
        "json-viewer",
        "json-diff",
        "json-to-typescript"
    ]
};

export default content;
