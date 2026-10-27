import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Convert between standard JSON and JSON5 format instantly. JSON5 supports comments, trailing commas, unquoted keys, single quotes, and more.",
        "Conversion works both ways with one click, and the converter preserves comments in your input and applies your chosen quote style, trailing commas and unquoted-key options."
    ],
    "features": [
        "Convert JSON to JSON5 format",
        "Convert JSON5 back to standard JSON",
        "Supports comments in JSON5",
        "Handles trailing commas and unquoted keys",
        "Single and double quote support",
        "Instant bidirectional conversion"
    ],
    "howTo": [
        {
            "title": "Paste your data",
            "description": "Enter either standard JSON or JSON5 into the input editor."
        },
        {
            "title": "Select direction",
            "description": "Choose to convert to JSON5 or to JSON."
        },
        {
            "title": "Copy the result",
            "description": "Get your converted output instantly."
        }
    ],
    "examples": [
        {
            "title": "Strict JSON to JSON5",
            "description": "With default settings, keys lose their quotes, strings use single quotes and trailing commas are added.",
            "input": "{\n  \"name\": \"Ada\",\n  \"roles\": [\n    \"admin\",\n    \"dev\"\n  ],\n  \"profile\": {\n    \"active\": true\n  }\n}",
            "output": "{\n  name: 'Ada',\n  roles: [\n    'admin',\n    'dev',\n  ],\n  profile: {\n    active: true,\n  },\n}",
            "lang": "json5"
        }
    ],
    "faq": [
        {
            "question": "What is JSON5?",
            "answer": "A more human-friendly data format that supports comments, trailing commas, unquoted keys, single quotes, and more. Commonly used for configuration files."
        },
        {
            "question": "Is JSON5 compatible with standard JSON?",
            "answer": "JSON5 is a superset of JSON. Any valid JSON is also valid JSON5. But JSON5 features like comments are not supported by standard JSON parsers."
        }
    ],
    "related": [
        "json-formatter",
        "json-validator",
        "json-minifier",
        "json-normalize"
    ]
};

export default content;
