import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import KotlinGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Kotlin Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Kotlin data classes instantly. Supports Kotlinx Serialization and Jackson. Free online code generator.",
    keywords: ["json to kotlin", "json to data class", "kotlin code generator", "json to kotlin class"],
    alternates: { canonical: "/tools/code/json-to-kotlin" },
    openGraph: {
        title: "JSON to Kotlin Converter | JSON PowerHouse",
        description: "Convert JSON to Kotlin data classes instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-kotlin",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Kotlin Converter | JSON PowerHouse",
        description: "Convert JSON to Kotlin data classes instantly.",
    },
};

export default function KotlinGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-kotlin">
                <KotlinGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to Kotlin"
                    description="Generate Kotlin data classes from JSON data instantly. Choose between Kotlinx Serialization, Jackson, or Moshi annotations."
                    features={[
                        "Generate Kotlin data classes from JSON",
                        "Kotlinx Serialization, Jackson, and Moshi support",
                        "Nullable type handling",
                        "Default value generation",
                        "Nested data class generation",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Select library", description: "Choose Kotlinx Serialization, Jackson, or Moshi." },
                        { title: "Copy Kotlin code", description: "Get production-ready data classes." },
                    ]}
                    faq={[
                        { question: "What serialization libraries are supported?", answer: "Kotlinx Serialization (@Serializable), Jackson (@JsonProperty), and Moshi (@Json)." },
                        { question: "How are nullable fields handled?", answer: "Nullable fields generate as String?, Int?, etc. with appropriate default values." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON to Swift", path: "/tools/code/json-to-swift" },
                        { name: "JSON to Dart", path: "/tools/code/json-to-dart" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
