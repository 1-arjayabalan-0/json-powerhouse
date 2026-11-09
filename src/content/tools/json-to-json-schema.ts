import type { ToolContent } from './types';

const content: ToolContent = {
    "updated": "2026-11-08",
    "intro": [
        "Generate a JSON Schema from example JSON. Paste a sample document, or an array of samples, and get a schema that describes its types, required properties, nullable fields and nested objects and arrays.",
        "String formats are detected automatically when every sample matches: date-time, date, email, uuid and uri. Values that can be null get a type list such as [\"string\", \"null\"], and arrays with mixed item types use anyOf.",
        "Choose draft 2020-12 or draft-07, set a title, decide whether keys found in every sample are required, and optionally forbid additional properties. When you paste a top-level array, its items are merged into one object schema, so keys missing from some samples become optional.",
        "Use the schema to validate API requests and responses, document a payload, power editor autocompletion, or generate types. Everything runs in your browser."
    ],
    "features": [
        "Draft 2020-12 or draft-07 output",
        "Types inferred for strings, integers, numbers, booleans, null, objects and arrays",
        "Required properties from keys present in every sample",
        "Nullable fields as type lists, mixed values as anyOf",
        "Format detection: date-time, date, email, uuid, uri",
        "Optional additionalProperties: false on every object",
        "Merge many samples into one schema",
        "100% client-side: nothing is uploaded"
    ],
    "howTo": [
        {
            "title": "Paste sample JSON",
            "description": "Enter one representative document, or an array of documents to merge."
        },
        {
            "title": "Set the options",
            "description": "Open Settings to choose the draft, a title, required properties, additional properties and format detection."
        },
        {
            "title": "Refine and use",
            "description": "Copy the schema, then add constraints a sample cannot show, such as enum, minimum or pattern."
        }
    ],
    "examples": [
        {
            "title": "Object to JSON Schema 2020-12",
            "description": "Title set to User. The uuid and email formats are detected from the values.",
            "input": "{\n  \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n  \"name\": \"Ada\",\n  \"email\": \"ada@example.com\",\n  \"tags\": [\n    \"admin\"\n  ],\n  \"manager\": null\n}",
            "output": "{\n  \"$schema\": \"https://json-schema.org/draft/2020-12/schema\",\n  \"title\": \"User\",\n  \"type\": \"object\",\n  \"properties\": {\n    \"id\": {\n      \"type\": \"string\",\n      \"format\": \"uuid\"\n    },\n    \"name\": {\n      \"type\": \"string\"\n    },\n    \"email\": {\n      \"type\": \"string\",\n      \"format\": \"email\"\n    },\n    \"tags\": {\n      \"type\": \"array\",\n      \"items\": {\n        \"type\": \"string\"\n      }\n    },\n    \"manager\": {\n      \"type\": \"null\"\n    }\n  },\n  \"required\": [\n    \"id\",\n    \"name\",\n    \"email\",\n    \"tags\",\n    \"manager\"\n  ]\n}",
            "lang": "json"
        },
        {
            "title": "Merging samples (draft-07)",
            "description": "A top-level array is merged into one object schema. age is missing from one sample, so it is not required. Additional properties are turned off.",
            "input": "[\n  {\n    \"name\": \"Ada\",\n    \"age\": 36\n  },\n  {\n    \"name\": \"Bob\"\n  }\n]",
            "output": "{\n  \"$schema\": \"http://json-schema.org/draft-07/schema#\",\n  \"type\": \"object\",\n  \"properties\": {\n    \"name\": {\n      \"type\": \"string\"\n    },\n    \"age\": {\n      \"type\": \"integer\"\n    }\n  },\n  \"required\": [\n    \"name\"\n  ],\n  \"additionalProperties\": false\n}",
            "lang": "json"
        }
    ],
    "faq": [
        {
            "question": "What is JSON Schema?",
            "answer": "JSON Schema is a standard vocabulary for describing the structure of JSON data: which properties exist, their types, which are required, and further constraints. Validators in most languages use it to check data, and tools use it for documentation and code generation."
        },
        {
            "question": "Which draft should I choose?",
            "answer": "Use 2020-12, the current version, unless a tool you rely on only supports draft-07. OpenAPI 3.1 uses 2020-12, while many older validators and editors expect draft-07."
        },
        {
            "question": "How are required properties decided?",
            "answer": "A property is required when it appears in every sample, even if its value is null. Paste several samples as an array to get a more accurate result, or set Required properties to None."
        },
        {
            "question": "Can I generate a schema from multiple JSON examples?",
            "answer": "Yes. Paste them as a top-level array and keep Merge top-level array items on. Types are combined, and keys missing from some samples become optional."
        },
        {
            "question": "Does the generated schema include enums or ranges?",
            "answer": "No. A sample cannot show which values are allowed, so add enum, minimum, maximum, pattern or length limits yourself after generating."
        },
        {
            "question": "Is my data uploaded?",
            "answer": "No. The schema is generated entirely in your browser."
        }
    ],
    "related": [
        "json-validator",
        "json-to-typescript",
        "json-to-prisma",
        "json-to-postgresql"
    ]
};

export default content;
