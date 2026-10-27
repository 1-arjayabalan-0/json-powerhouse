import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Visually transform your JSON data without writing code. Rename keys, remove fields, convert between camelCase and snake_case, flatten or nest structures.",
        "You build a stack of operations, and the output updates as you add, reorder or disable each step, with an undo button if you change your mind."
    ],
    "features": [
        "Rename JSON keys with visual mapping",
        "Remove fields you don't need",
        "Convert between camelCase, snake_case, PascalCase, kebab-case",
        "Flatten deeply nested JSON structures",
        "Nest flat JSON into hierarchical objects",
        "Preview transformations before applying"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter your JSON data into the input editor."
        },
        {
            "title": "Choose transformation",
            "description": "Select from rename, remove, convert case, flatten, or nest operations."
        },
        {
            "title": "Apply and export",
            "description": "Preview the result and copy or download your transformed JSON."
        }
    ],
    "examples": [
        {
            "title": "Convert keys to camelCase and flatten",
            "description": "Two operations are applied in order: Convert Case (camelCase, keys only) and Flatten (separator \".\").",
            "input": "{\"user_name\":\"Ada\",\"home_address\":{\"city\":\"London\",\"zip\":\"EC1A\"}}",
            "output": "{\n  \"userName\": \"Ada\",\n  \"homeAddress.city\": \"London\",\n  \"homeAddress.zip\": \"EC1A\"\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What can I do with JSON Transform?",
            "answer": "Rename keys, remove fields, convert naming conventions (camelCase, snake_case), flatten nested structures, and nest flat JSON."
        },
        {
            "question": "Does it preserve my original data?",
            "answer": "Yes. Transformation creates new output without modifying your original input."
        }
    ],
    "related": [
        "json-formatter",
        "json-normalize",
        "json-to-typescript",
        "json-diff"
    ]
};

export default content;
