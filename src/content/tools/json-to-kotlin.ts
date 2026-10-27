import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Kotlin data classes from JSON data instantly. Choose between Kotlinx Serialization, Jackson, or Moshi annotations.",
        "Nested objects become their own data classes, annotated for the serialization library you choose. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Kotlin data classes from JSON",
        "Kotlinx Serialization, Jackson, and Moshi support",
        "Nullable type handling",
        "Default value generation",
        "Nested data class generation",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Select library",
            "description": "Choose Kotlinx Serialization, Jackson, or Moshi."
        },
        {
            "title": "Copy Kotlin code",
            "description": "Get production-ready data classes."
        }
    ],
    "examples": [
        {
            "title": "Generating Kotlin data classes",
            "description": "A small user record with a nested address, generated with the default settings.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// To parse the JSON, install kotlin's serialization plugin and do:\n//\n// val json = Json { allowStructuredMapKeys = true }\n// val root = json.parse(Root.serializer(), jsonString)\n\npackage com.example\n\nimport kotlinx.serialization.*\nimport kotlinx.serialization.json.*\nimport kotlinx.serialization.descriptors.*\nimport kotlinx.serialization.encoding.*\n\n@Serializable\ndata class Root (\n    val id: Long,\n    val name: String,\n    val email: String,\n    val active: Boolean,\n    val tags: List<String>,\n    val address: Address\n)\n\n@Serializable\ndata class Address (\n    val city: String,\n    val zip: String\n)",
            "lang": "kotlin"
        }
    ],
    "faq": [
        {
            "question": "What serialization libraries are supported?",
            "answer": "Kotlinx Serialization (@Serializable), Jackson (@JsonProperty), and Moshi (@Json)."
        },
        {
            "question": "How are nullable fields handled?",
            "answer": "Nullable fields generate as String?, Int?, etc. with appropriate default values."
        }
    ],
    "related": [
        "json-to-java",
        "json-to-swift",
        "json-to-dart",
        "json-formatter"
    ]
};

export default content;
