import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import RustGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Rust Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON data to Rust structs instantly. Free online code generator with serde support and type inference.",
    keywords: ["json to rust", "json to rust struct", "rust code generator", "serde json", "rust struct generator"],
    alternates: { canonical: "/tools/code/json-to-rust" },
    openGraph: {
        title: "JSON to Rust Converter | JSON PowerHouse",
        description: "Convert JSON to Rust structs with serde support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-rust",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Rust Converter | JSON PowerHouse",
        description: "Convert JSON to Rust structs instantly.",
    },
};

export default function RustGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-rust">
                <RustGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to Rust"
                    description="Generate Rust structs from JSON data with serde Serialize and Deserialize derives."
                    features={[
                        "Generate Rust structs from JSON",
                        "serde Serialize/Deserialize derives",
                        "Option types for nullable fields",
                        "Nested struct generation",
                        "snake_case field naming",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Generate Rust code", description: "Get Rust structs with serde derives." },
                        { title: "Copy and compile", description: "Paste the generated structs into your Rust project." },
                    ]}
                    faq={[
                        { question: "Does it support serde?", answer: "Yes. Generated structs include #[derive(Serialize, Deserialize)] and #[serde(rename)] attributes." },
                        { question: "Can I use this with Axum or Actix?", answer: "Yes. Works with any Rust web framework using serde for JSON serialization." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Go", path: "/tools/code/json-to-go" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
