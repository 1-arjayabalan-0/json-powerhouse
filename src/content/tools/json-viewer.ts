import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Explore your JSON data with an interactive tree view. Expand and collapse nodes, search for specific keys or values, copy paths, and switch between tree and raw JSON views.",
        "Instead of a wall of braces, you get a tree where each node shows its type and item count, and you can collapse the branches you do not care about."
    ],
    "features": [
        "Interactive tree view with expand/collapse",
        "Search within JSON data by key or value",
        "Copy paths to specific values",
        "Switch between tree and raw JSON views",
        "Syntax highlighting for readability",
        "Handles deeply nested structures"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter your JSON data into the input area."
        },
        {
            "title": "Explore the tree",
            "description": "Click nodes to expand or collapse. Use search to find specific keys or values."
        },
        {
            "title": "Copy paths",
            "description": "Click any node to copy its JSON path for use in your code."
        }
    ],
    "examples": [
        {
            "title": "Exploring a nested object as a tree",
            "description": "The Tree Viewer renders an interactive tree rather than text, so the output below describes what you see (with default settings, data types and item counts are shown).",
            "input": "{\"id\":7,\"name\":\"Ada\",\"roles\":[\"admin\",\"dev\"],\"address\":{\"city\":\"London\",\"zip\":\"EC1A\"}}",
            "output": "object {5}\n  id: 7 (number)\n  name: \"Ada\" (string)\n  roles: array [2]\n    0: \"admin\"\n    1: \"dev\"\n  address: object {2}\n    city: \"London\"\n    zip: \"EC1A\"",
            "lang": "text"
        }
    ],
    "faq": [
        {
            "question": "What is a JSON Viewer?",
            "answer": "It displays JSON in an interactive hierarchical tree structure, making it easy to navigate complex nested data."
        },
        {
            "question": "Can I search for specific values?",
            "answer": "Yes. Use the search function to find any key or value within your JSON data."
        }
    ],
    "related": [
        "json-formatter",
        "json-validator",
        "json-diff",
        "json-to-typescript"
    ]
};

export default content;
