import type { ToolContent } from './types';

const content: ToolContent = {
    "intro": [
        "Generate Python code from JSON data. Choose between plain dictionaries, TypedDict, or Python dataclasses with type hints.",
        "Nested objects become their own classes with typed fields and from_dict / to_dict helpers. Output updates as you type, and everything runs in your browser."
    ],
    "features": [
        "Generate Python dicts, TypedDict, or dataclasses",
        "Type hint generation for Python 3.6+",
        "Handles nested structures and lists",
        "Optional field support with defaults",
        "Copy generated code to clipboard",
        "Client-side processing for privacy"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a sample JSON object."
        },
        {
            "title": "Select format",
            "description": "Choose between plain dict, TypedDict, or dataclass."
        },
        {
            "title": "Copy Python code",
            "description": "Get ready-to-use Python code with proper typing."
        }
    ],
    "examples": [
        {
            "title": "Generating Python classes",
            "description": "A small user record with a nested address, generated with the default settings. Trimmed to the first 30 lines of the generated classes. The default output also includes from_dict/to_dict helpers and converter functions.",
            "input": "{\n  \"id\": 1,\n  \"name\": \"Ada Lovelace\",\n  \"email\": \"ada@example.com\",\n  \"active\": true,\n  \"tags\": [\"admin\", \"dev\"],\n  \"address\": { \"city\": \"London\", \"zip\": \"EC1A\" }\n}",
            "output": "class Address:\n    city: str\n    zip: str\n\n    def __init__(self, city: str, zip: str) -> None:\n        self.city = city\n        self.zip = zip\n\n    @staticmethod\n    def from_dict(obj: Any) -> 'Address':\n        assert isinstance(obj, dict)\n        city = from_str(obj.get(\"city\"))\n        zip = from_str(obj.get(\"zip\"))\n        return Address(city, zip)\n\n    def to_dict(self) -> dict:\n        result: dict = {}\n        result[\"city\"] = from_str(self.city)\n        result[\"zip\"] = from_str(self.zip)\n        return result\n\n\nclass Root:\n    id: int\n    name: str\n    email: str\n    active: bool\n    tags: List[str]\n    address: Address\n\n    def __init__(self, id: int, name: str, email: str, active: bool, tags: List[str], address: Address) -> None:",
            "lang": "python"
        }
    ],
    "faq": [
        {
            "question": "What output formats are available?",
            "answer": "Plain Python dictionaries, TypedDict (for static type checking), or Python dataclasses with type hints."
        },
        {
            "question": "Can I use this with Flask or Django?",
            "answer": "Yes. Generated code works with Flask, Django, FastAPI, or any Python project."
        }
    ],
    "related": [
        "json-to-typescript",
        "json-to-java",
        "json-to-csharp",
        "json-formatter"
    ]
};

export default content;
