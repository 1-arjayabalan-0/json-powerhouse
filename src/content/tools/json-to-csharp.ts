import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate C# classes from JSON data. Choose between System.Text.Json or Newtonsoft.Json attributes.",
        "Nested objects become their own classes with JSON property attributes and PascalCase members. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate C# classes and records from JSON",
        "System.Text.Json and Newtonsoft.Json support",
        "Nullable type handling",
        "Nested class generation",
        "Proper naming conventions (PascalCase)",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Select serializer",
            "description": "Choose System.Text.Json or Newtonsoft.Json."
        },
        {
            "title": "Copy C# code",
            "description": "Get production-ready C# classes."
        }
    ],
    "examples": [
        {
            "title": "Generating C# classes",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the generated classes. The default output also includes FromJson/ToJson helpers and a converter settings class.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "    public partial class Root\n    {\n        [JsonPropertyName(\"id\")]\n        public long Id { get; set; }\n\n        [JsonPropertyName(\"name\")]\n        public string Name { get; set; }\n\n        [JsonPropertyName(\"email\")]\n        public string Email { get; set; }\n\n        [JsonPropertyName(\"active\")]\n        public bool Active { get; set; }\n\n        [JsonPropertyName(\"tags\")]\n        public List<string> Tags { get; set; }\n\n        [JsonPropertyName(\"address\")]\n        public Address Address { get; set; }\n    }\n\n    public partial class Address\n    {\n        [JsonPropertyName(\"city\")]\n        public string City { get; set; }\n\n        [JsonPropertyName(\"zip\")]\n        public string Zip { get; set; }\n    }",
            "lang": "csharp"
        }
    ],
    "faq": [
        {
            "question": "What C# features are supported?",
            "answer": "Classes, records, nullable types, nested classes, and attributes for System.Text.Json and Newtonsoft.Json."
        },
        {
            "question": "Can I use this with ASP.NET?",
            "answer": "Yes. Generated classes work with ASP.NET Core Web API, HttpClient, and Entity Framework."
        }
    ],
    "related": [
        "json-to-typescript",
        "json-to-java",
        "json-to-python",
        "json-formatter"
    ]
};

export default content;
