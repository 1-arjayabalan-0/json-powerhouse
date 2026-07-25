import { Metadata } from "next";
import GoGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Go Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Go structs instantly. Free online code generator with proper typing and struct tags.",
    keywords: ["json to go", "json to go struct", "go code generator", "json to golang converter", "golang struct generator"],
    alternates: { canonical: "/tools/code/json-to-go" },
    openGraph: {
        title: "JSON to Go Converter | JSON PowerHouse",
        description: "Convert JSON to Go structs instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-go",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Go Converter | JSON PowerHouse",
        description: "Convert JSON to Go structs instantly.",
    },
};

export default function GoGeneratorPage() {
    return (
        <>
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <GoGeneratorClient />
                <SeoAccordion
                    toolName="JSON to Go"
                    description="Generate Go structs from JSON data with proper json struct tags."
                    features={[
                        "Generate Go structs from JSON",
                        "JSON struct tags with field mappings",
                        "omitempty tag support",
                        "Nested struct generation",
                        "Pointer types for nullable fields",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Generate Go structs", description: "Get Go structs with proper json tags." },
                        { title: "Copy and use", description: "Paste the generated structs into your Go project." },
                    ]}
                    faq={[
                        { question: "What Go features are generated?", answer: "Structs with json tags, omitempty, pointer types for nullable fields, and nested structs." },
                        { question: "Can I use this with Go modules?", answer: "Yes. Works with encoding/json, gorilla/mux, gin-gonic, and any Go project." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Rust", path: "/tools/code/json-to-rust" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
            </div>
        </>
    );
}
