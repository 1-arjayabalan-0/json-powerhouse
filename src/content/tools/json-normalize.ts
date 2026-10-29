import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Standardize your JSON structure. Sort keys alphabetically, remove unnecessary whitespace, and produce consistent output every time.",
        "Comments are removed from the input before parsing, so JSONC and commented config files come out as clean, strict JSON."
    ],
    "features": [
        "Sort keys alphabetically (ascending or descending)",
        "Remove unnecessary whitespace",
        "Produce consistent, deterministic output",
        "Useful for JSON comparison and deduplication",
        "Preserves data values and types",
        "Client-side processing for privacy"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter your JSON data into the input editor."
        },
        {
            "title": "Choose options",
            "description": "Select key sorting order and whitespace removal preferences."
        },
        {
            "title": "Copy output",
            "description": "Get your consistently structured JSON from the output panel."
        }
    ],
    "examples": [
        {
            "title": "Stripping comments from JSONC",
            "description": "Line and block comments are removed and the result is formatted with 2-space indentation.",
            "input": "{\n  // user record\n  \"id\": 7,\n  /* contact */\n  \"email\": \"ada@example.com\"\n}",
            "output": "{\n  \"id\": 7,\n  \"email\": \"ada@example.com\"\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What does JSON normalization do?",
            "answer": "It restructures JSON to a canonical form by sorting keys and removing extra whitespace. Two semantically identical JSONs produce identical output."
        },
        {
            "question": "Does normalization change my data?",
            "answer": "No. Only formatting and key order change. All data values and types remain the same."
        }
    ],
    "related": [
        "json-formatter",
        "json-minifier",
        "json-diff",
        "json-viewer"
    ]
};

export default content;
