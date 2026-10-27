import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Go structs from JSON data with proper json struct tags.",
        "Nested objects become their own struct types, with a JSON tag on every field. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Go structs from JSON",
        "JSON struct tags with field mappings",
        "omitempty tag support",
        "Nested struct generation",
        "Pointer types for nullable fields",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Generate Go structs",
            "description": "Get Go structs with proper json tags."
        },
        {
            "title": "Copy and use",
            "description": "Paste the generated structs into your Go project."
        }
    ],
    "examples": [
        {
            "title": "Generating Go structs",
            "description": "A small user record with a nested address, generated with the default settings. Generated with the field-tags setting set to json.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// Code generated from JSON Schema using quicktype. DO NOT EDIT.\n// To parse and unparse this JSON data, add this code to your project and do:\n//\n//    root, err := UnmarshalRoot(bytes)\n//    bytes, err = root.Marshal()\n\npackage main\n\nimport \"encoding/json\"\n\nfunc UnmarshalRoot(data []byte) (Root, error) {\n\tvar r Root\n\terr := json.Unmarshal(data, &r)\n\treturn r, err\n}\n\nfunc (r *Root) Marshal() ([]byte, error) {\n\treturn json.Marshal(r)\n}\n\ntype Root struct {\n\tID      int64    `json:\"id\"`\n\tName    string   `json:\"name\"`\n\tEmail   string   `json:\"email\"`\n\tActive  bool     `json:\"active\"`\n\tTags    []string `json:\"tags\"`\n\tAddress Address  `json:\"address\"`\n}\n\ntype Address struct {\n\tCity string `json:\"city\"`\n\tZip  string `json:\"zip\"`\n}",
            "lang": "go"
        }
    ],
    "faq": [
        {
            "question": "What Go features are generated?",
            "answer": "Structs with json tags, omitempty, pointer types for nullable fields, and nested structs."
        },
        {
            "question": "Can I use this with Go modules?",
            "answer": "Yes. Works with encoding/json, gorilla/mux, gin-gonic, and any Go project."
        }
    ],
    "related": [
        "json-to-rust",
        "json-to-typescript",
        "json-to-java",
        "json-formatter"
    ]
};

export default content;
