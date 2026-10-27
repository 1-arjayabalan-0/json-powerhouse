import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Dart model classes from JSON data with json_serializable and Freezed support.",
        "Nested objects become their own model classes with fromJson and toJson helpers. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Dart classes from JSON",
        "json_serializable and Freezed support",
        "fromJson and toJson method generation",
        "Nullable type handling",
        "Nested model generation",
        "Copy generated code to clipboard"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Select style",
            "description": "Choose plain Dart, json_serializable, or Freezed."
        },
        {
            "title": "Copy Dart code",
            "description": "Get Flutter-ready model classes."
        }
    ],
    "examples": [
        {
            "title": "Generating Dart model classes",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the first 38 lines (the Root class); an Address class is generated the same way.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "// To parse this JSON data, do\n//\n//     final root = rootFromJson(jsonString);\n\nimport 'package:json_annotation/json_annotation.dart';\nimport 'dart:convert';\n\npart 'root.g.dart';\n\nRoot rootFromJson(String str) => Root.fromJson(json.decode(str));\n\nString rootToJson(Root data) => json.encode(data.toJson());\n\n@JsonSerializable()\nclass Root {\n    @JsonKey(name: \"id\")\n    int id;\n    @JsonKey(name: \"name\")\n    String name;\n    @JsonKey(name: \"email\")\n    String email;\n    @JsonKey(name: \"active\")\n    bool active;\n    @JsonKey(name: \"tags\")\n    List<String> tags;\n    @JsonKey(name: \"address\")\n    Address address;\n\n    Root({\n        required this.id,\n        required this.name,\n        required this.email,\n        required this.active,\n        required this.tags,\n        required this.address,\n    });\n\n    factory Root.fromJson(Map<String, dynamic> json) => _$RootFromJson(json);",
            "lang": "dart"
        }
    ],
    "faq": [
        {
            "question": "What serialization options are available?",
            "answer": "Plain Dart, json_serializable (@JsonSerializable), or Freezed (@freezed) models."
        },
        {
            "question": "Does it support Flutter?",
            "answer": "Yes. Works with Flutter, Dio, http package, and any Dart project."
        }
    ],
    "related": [
        "json-to-kotlin",
        "json-to-swift",
        "json-to-typescript",
        "json-formatter"
    ]
};

export default content;
