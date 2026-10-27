import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import PythonGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Python Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Python dictionaries and dataclasses instantly. Free online code generator with type hints.",
    keywords: ["json to python", "json to python dict", "python code generator", "json to python converter", "python type hints"],
    alternates: { canonical: "/tools/code/json-to-python" },
    openGraph: {
        title: "JSON to Python Converter | JSON PowerHouse",
        description: "Convert JSON to Python dictionaries and dataclasses instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-python",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Python Converter | JSON PowerHouse",
        description: "Convert JSON to Python dictionaries and dataclasses.",
    },
};

export default function PythonGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-python">
                <PythonGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to Python"
                    description="Generate Python code from JSON data. Choose between plain dictionaries, TypedDict, or Python dataclasses with type hints."
                    features={[
                        "Generate Python dicts, TypedDict, or dataclasses",
                        "Type hint generation for Python 3.6+",
                        "Handles nested structures and lists",
                        "Optional field support with defaults",
                        "Copy generated code to clipboard",
                        "Client-side processing for privacy",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Select format", description: "Choose between plain dict, TypedDict, or dataclass." },
                        { title: "Copy Python code", description: "Get ready-to-use Python code with proper typing." },
                    ]}
                    faq={[
                        { question: "What output formats are available?", answer: "Plain Python dictionaries, TypedDict (for static type checking), or Python dataclasses with type hints." },
                        { question: "Can I use this with Flask or Django?", answer: "Yes. Generated code works with Flask, Django, FastAPI, or any Python project." },
                    ]}
                    relatedTools={[
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON to C#", path: "/tools/code/json-to-csharp" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
