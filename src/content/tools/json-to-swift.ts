import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Swift structs with Codable protocol support. Get properly typed Swift models with CodingKeys.",
        "Nested objects become their own Codable structs, ready to decode with a single call. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Swift structs with Codable protocol",
        "CodingKeys for custom property mapping",
        "Optional type handling",
        "Nested struct generation",
        "Class and struct output options",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object from your API response."
        },
        {
            "title": "Generate Swift code",
            "description": "Get Codable structs with CodingKeys."
        },
        {
            "title": "Copy and integrate",
            "description": "Paste the generated models into your Xcode project."
        }
    ],
    "examples": [
        {
            "title": "Generating Swift Codable structs",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the first 24 lines. The default output also includes convenience initializers, a with() mutator and encoding helpers.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// This file was generated from JSON Schema using quicktype, do not modify it directly.\n// To parse the JSON, add this file to your project and do:\n//\n//   let root = try Root(json)\n\nimport Foundation\n\n// MARK: - Root\npublic struct Root: Codable {\n    public let id: Int\n    public let name, email: String\n    public let active: Bool\n    public let tags: [String]\n    public let address: Address\n\n    public init(id: Int, name: String, email: String, active: Bool, tags: [String], address: Address) {\n        self.id = id\n        self.name = name\n        self.email = email\n        self.active = active\n        self.tags = tags\n        self.address = address\n    }\n}",
            "lang": "swift"
        }
    ],
    "faq": [
        {
            "question": "Does it support Codable?",
            "answer": "Yes. Generated code uses Codable with Encodable/Decodable conformance and CodingKeys."
        },
        {
            "question": "Can I use this for iOS development?",
            "answer": "Yes. Works with URLSession, Alamofire, and any iOS networking library."
        }
    ],
    "related": [
        "json-to-kotlin",
        "json-to-dart",
        "json-to-typescript",
        "json-formatter"
    ]
};

export default content;
