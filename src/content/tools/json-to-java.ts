import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Java POJO classes from JSON data instantly. Choose between Jackson, Gson, or Lombok annotations.",
        "Nested objects become their own classes with Jackson annotations, getters and setters. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Java POJOs from JSON",
        "Jackson, Gson, and Lombok annotation support",
        "Private fields with getters and setters",
        "toString, equals, and hashCode methods",
        "Handles nested objects and collections",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object representing your API response."
        },
        {
            "title": "Select framework",
            "description": "Choose Jackson, Gson, or Lombok for annotations."
        },
        {
            "title": "Copy Java code",
            "description": "Get production-ready Java classes."
        }
    ],
    "examples": [
        {
            "title": "Generating Java classes",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the start of the Root class (first 25 lines). The generator also emits Address.java and a Converter class.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// Root.java\n\npackage com.example;\n\nimport com.fasterxml.jackson.annotation.*;\nimport java.util.List;\n\npublic class Root {\n    private long id;\n    private String name;\n    private String email;\n    private boolean active;\n    private List<String> tags;\n    private Address address;\n\n    @JsonProperty(\"id\")\n    public long getID() { return id; }\n    @JsonProperty(\"id\")\n    public void setID(long value) { this.id = value; }\n\n    @JsonProperty(\"name\")\n    public String getName() { return name; }\n    @JsonProperty(\"name\")\n    public void setName(String value) { this.name = value; }\n\n    @JsonProperty(\"email\")",
            "lang": "java"
        }
    ],
    "faq": [
        {
            "question": "What annotations are supported?",
            "answer": "Jackson (@JsonProperty), Gson (@SerializedName), and Lombok (@Data, @Builder) annotations."
        },
        {
            "question": "Can I use this for Android?",
            "answer": "Yes. Generated POJOs work with Retrofit, Volley, and other Android networking libraries."
        }
    ],
    "related": [
        "json-to-kotlin",
        "json-to-typescript",
        "json-to-python",
        "json-formatter"
    ]
};

export default content;
