import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Turn JSON arrays into a readable table. Long string fields wrap inside cells so you read top-to-bottom instead of scrolling sideways. Toggle Markdown preview for bold text, lists, and links.",
        "Columns whose strings reach the length threshold (80 characters by default) are treated as text columns and wrapped inside the cell, so long messages stay readable."
    ],
    "features": [
        "One table row per JSON array item",
        "Long text fields auto-detected and wrapped",
        "Plain text table or formatted Markdown document view",
        "Force fields into text or compact mode",
        "No horizontal scrolling for long strings"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Paste an array of objects (or a single object) into the input editor."
        },
        {
            "title": "Read the table",
            "description": "Detected text columns wrap their content vertically. Click Show more on tall cells."
        },
        {
            "title": "Tune columns",
            "description": "Click column chips to force text/compact mode, or toggle Markdown preview."
        }
    ],
    "examples": [
        {
            "title": "Long text field in an array of records",
            "description": "An array with one record becomes one table row. The body column is detected as long text (107 characters), while id and title stay compact. The tool shows this as a table, so the output below describes what you see.",
            "input": "[{\"id\":1,\"title\":\"Welcome\",\"body\":\"Thanks for signing up! This onboarding message is long enough to wrap across several lines in a table cell.\"}]",
            "output": "Columns detected:\n  id    -> compact\n  title -> compact\n  body  -> text (wrapped in the cell)\n\nRow 1: id = 1 | title = Welcome | body = Thanks for signing up! This onboarding message is long enough to wrap across several lines in a table cell.",
            "lang": "text"
        }
    ],
    "faq": [
        {
            "question": "What JSON shapes work?",
            "answer": "Arrays of objects (best), a single object, or an array of strings. Keys are collected as table columns."
        },
        {
            "question": "How are text columns detected?",
            "answer": "Any string field whose longest value meets the character threshold (default 80). You can force or exclude fields via column chips."
        }
    ],
    "related": [
        "json-viewer",
        "json-formatter",
        "json-transform",
        "json-diff"
    ]
};

export default content;
