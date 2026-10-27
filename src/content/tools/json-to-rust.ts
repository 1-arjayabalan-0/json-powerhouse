import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Rust structs from JSON data with serde Serialize and Deserialize derives.",
        "Nested objects become their own structs with serde Serialize and Deserialize derives. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Rust structs from JSON",
        "serde Serialize/Deserialize derives",
        "Option types for nullable fields",
        "Nested struct generation",
        "snake_case field naming",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Generate Rust code",
            "description": "Get Rust structs with serde derives."
        },
        {
            "title": "Copy and compile",
            "description": "Paste the generated structs into your Rust project."
        }
    ],
    "examples": [
        {
            "title": "Generating Rust structs",
            "description": "A small user record with a nested address, generated with the default settings. Comment header omitted.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// }\n\nuse serde::{Serialize, Deserialize};\n\n#[derive(Debug, Clone, Serialize, Deserialize)]\npub struct Root {\n    pub id: i64,\n\n    pub name: String,\n\n    pub email: String,\n\n    pub active: bool,\n\n    pub tags: Vec<String>,\n\n    pub address: Address,\n}\n\n#[derive(Debug, Clone, Serialize, Deserialize)]\npub struct Address {\n    pub city: String,\n\n    pub zip: String,\n}",
            "lang": "rust"
        }
    ],
    "faq": [
        {
            "question": "Does it support serde?",
            "answer": "Yes. Generated structs include #[derive(Serialize, Deserialize)] and #[serde(rename)] attributes."
        },
        {
            "question": "Can I use this with Axum or Actix?",
            "answer": "Yes. Works with any Rust web framework using serde for JSON serialization."
        }
    ],
    "related": [
        "json-to-go",
        "json-to-typescript",
        "json-to-java",
        "json-formatter"
    ]
};

export default content;
