import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Remove comments from JSON and normalize it into clean, consistent, strict JSON. Paste JSONC, a commented config file, or messy JSON, and get output that any JSON parser accepts, formatted the same way every time.",
        "Line comments (//) and block comments (/* */) are stripped before parsing, so files such as tsconfig.json, VS Code settings.json, or hand-edited configs become valid JSON. Whitespace and line endings are normalized, and the result uses 2-space indentation by default.",
        "Normalized JSON is easier to compare, review and store. Turn on key sorting in Settings to order keys A→Z or Z→A, so two documents with the same data but a different key order produce the same text. That cuts noise in diffs, code reviews and version control.",
        "You can also remove null values or change key casing (camelCase, snake_case and more). Everything runs in your browser: your data is never uploaded."
    ],
    "features": [
        "Strip // line comments and /* */ block comments",
        "Turn JSONC and commented config files into strict JSON",
        "Optional key sorting, A→Z or Z→A",
        "Normalize whitespace and line endings (CRLF and LF)",
        "Consistent indentation: 2 spaces, 4 spaces or tabs",
        "Optionally remove null values and convert key casing",
        "Values and types are kept exactly as they were",
        "100% client-side: nothing leaves your browser"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter JSON or JSONC, comments included, into the input editor."
        },
        {
            "title": "Choose options",
            "description": "Open Settings to sort keys, change indentation, remove null values or convert key casing."
        },
        {
            "title": "Copy the output",
            "description": "Copy the clean, normalized JSON from the output panel."
        }
    ],
    "examples": [
        {
            "title": "Stripping comments from JSONC",
            "description": "Line and block comments are removed and the result is formatted with 2-space indentation.",
            "input": "{\n  // user record\n  \"id\": 7,\n  /* contact */\n  \"email\": \"ada@example.com\"\n}",
            "output": "{\n  \"id\": 7,\n  \"email\": \"ada@example.com\"\n}",
            "lang": "json"
        },
        {
            "title": "Sorting keys for a stable diff",
            "description": "With key sorting set to A→Z in Settings, keys are ordered alphabetically at every level.",
            "input": "{\"version\": 2, \"name\": \"api\", \"deps\": {\"zod\": \"3.x\", \"axios\": \"1.x\"}}",
            "output": "{\n  \"deps\": {\n    \"axios\": \"1.x\",\n    \"zod\": \"3.x\"\n  },\n  \"name\": \"api\",\n  \"version\": 2\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What does JSON normalization do?",
            "answer": "It rewrites JSON in a single consistent form: comments removed, whitespace and line endings cleaned up, indentation made uniform and, if you choose, keys sorted. Two documents that hold the same data then produce the same output."
        },
        {
            "question": "How do I remove comments from JSON?",
            "answer": "Paste the file into the input editor. Both // and /* */ comments are stripped automatically, and the output is valid strict JSON."
        },
        {
            "question": "What is JSONC?",
            "answer": "JSONC (JSON with Comments) is JSON that allows comments. Editors such as VS Code use it for settings.json and tsconfig.json. Most JSON parsers reject it, so normalize it first if you need strict JSON."
        },
        {
            "question": "Why sort JSON keys?",
            "answer": "JSON objects have no meaningful key order, but text diffs do. Sorting keys means reordered keys no longer show up as changes, which makes diffs, reviews and deduplication easier."
        },
        {
            "question": "Does normalization change my data?",
            "answer": "No. Only comments, formatting and, if enabled, key order change. Values and types stay the same unless you turn on removing null values or key case conversion."
        },
        {
            "question": "Is my data uploaded?",
            "answer": "No. Everything is processed in your browser."
        }
    ],
    "related": [
        "json-diff",
        "json-formatter",
        "json-json5",
        "json-validator"
    ]
};

export default content;
