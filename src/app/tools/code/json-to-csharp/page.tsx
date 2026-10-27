import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import CSharpGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to C# Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to C# classes or records instantly. Supports System.Text.Json and Newtonsoft.Json. Free online code generator.",
    keywords: ["json to csharp", "json to c#", "csharp code generator", "json to c# class", "c# poco generator"],
    alternates: { canonical: "/tools/code/json-to-csharp" },
    openGraph: {
        title: "JSON to C# Converter | JSON PowerHouse",
        description: "Convert JSON to C# classes or records instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-csharp",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to C# Converter | JSON PowerHouse",
        description: "Convert JSON to C# classes or records instantly.",
    },
};

export default function CSharpGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-csharp">
                <CSharpGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to C#"
                    description="Generate C# classes from JSON data. Choose between System.Text.Json or Newtonsoft.Json attributes."
                    features={[
                        "Generate C# classes and records from JSON",
                        "System.Text.Json and Newtonsoft.Json support",
                        "Nullable type handling",
                        "Nested class generation",
                        "Proper naming conventions (PascalCase)",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Select serializer", description: "Choose System.Text.Json or Newtonsoft.Json." },
                        { title: "Copy C# code", description: "Get production-ready C# classes." },
                    ]}
                    faq={[
                        { question: "What C# features are supported?", answer: "Classes, records, nullable types, nested classes, and attributes for System.Text.Json and Newtonsoft.Json." },
                        { question: "Can I use this with ASP.NET?", answer: "Yes. Generated classes work with ASP.NET Core Web API, HttpClient, and Entity Framework." },
                    ]}
                    relatedTools={[
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON to Python", path: "/tools/code/json-to-python" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
