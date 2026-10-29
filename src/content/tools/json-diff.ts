import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Compare two or three JSON documents side-by-side and see exactly what changed. Color-coded output highlights additions, deletions, and modifications.",
        "Besides the colour-coded view, the diff is expressed as standard JSON Patch operations, so you can reuse the exact changes in your own code or API calls."
    ],
    "features": [
        "Side-by-side JSON comparison",
        "Color-coded additions, deletions, and modifications",
        "3-way merge for conflict resolution",
        "RFC 6902 JSON Patch generation",
        "JSON5 support",
        "Copy diff results or export as patch file"
    ],
    "howTo": [
        {
            "title": "Paste two JSON documents",
            "description": "Enter the original JSON in the left panel and the modified JSON in the right panel."
        },
        {
            "title": "View differences",
            "description": "See highlighted changes showing additions, deletions, and modifications."
        },
        {
            "title": "Export or merge",
            "description": "Copy the diff results or generate a JSON Patch file."
        }
    ],
    "examples": [
        {
            "title": "Comparing two versions of a record",
            "description": "The left document is compared with the right one. The tool shows additions, removals and modifications in colour; the equivalent RFC 6902 JSON Patch is shown below.",
            "input": "Left:  {\"id\":1,\"name\":\"Ada\",\"roles\":[\"dev\"]}\nRight: {\"id\":1,\"name\":\"Ada Lovelace\",\"roles\":[\"dev\",\"admin\"],\"active\":true}",
            "output": "[\n  {\n    \"op\": \"add\",\n    \"path\": \"/roles/1\",\n    \"value\": \"admin\"\n  },\n  {\n    \"op\": \"replace\",\n    \"path\": \"/name\",\n    \"value\": \"Ada Lovelace\"\n  },\n  {\n    \"op\": \"add\",\n    \"path\": \"/active\",\n    \"value\": true\n  }\n]",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What is JSON diff?",
            "answer": "It compares two JSON documents and identifies differences — what was added, removed, or changed."
        },
        {
            "question": "What is RFC 6902?",
            "answer": "A standard format for describing changes between JSON documents as a series of operations (add, remove, replace, move, copy, test)."
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
