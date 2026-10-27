import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Reduce your JSON file size instantly. Remove all unnecessary whitespace, line breaks, and indentation to produce the smallest possible JSON output.",
        "It uses the same engine as the Formatter with pretty-printing switched off, so a payload is reduced to a single line while every key, value and type is preserved."
    ],
    "features": [
        "Strip all whitespace and line breaks",
        "Remove trailing commas",
        "Produces smallest possible JSON output",
        "Copy to clipboard or download minified file",
        "Real-time size comparison (before vs after)",
        "Client-side processing for privacy"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter your formatted or raw JSON into the input editor."
        },
        {
            "title": "Get minified output",
            "description": "The tool instantly removes all whitespace and produces compact JSON."
        },
        {
            "title": "Copy or download",
            "description": "Grab your minified JSON from the output panel."
        }
    ],
    "examples": [
        {
            "title": "Pretty-printed object to a single line",
            "description": "An indented object is compressed to one line with no extra whitespace.",
            "input": "{\n  \"id\": 7,\n  \"name\": \"Ada\",\n  \"roles\": [\n    \"admin\",\n    \"dev\"\n  ],\n  \"active\": true\n}",
            "output": "{\"id\":7,\"name\":\"Ada\",\"roles\":[\"admin\",\"dev\"],\"active\":true}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What is JSON minification?",
            "answer": "It removes all unnecessary characters from JSON — whitespace, line breaks, indentation — without changing data structure."
        },
        {
            "question": "Does minifying change my data?",
            "answer": "No. Minification only removes formatting characters. The actual data values and structure remain identical."
        }
    ],
    "related": [
        "json-formatter",
        "json-validator",
        "json-normalize",
        "json-viewer"
    ]
};

export default content;
