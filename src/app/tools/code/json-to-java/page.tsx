import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import JavaGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Java Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok annotations. Free online code generator.",
    keywords: ["json to java", "json to pojo", "java code generator", "json to java class", "java pojo generator"],
    alternates: { canonical: "/tools/code/json-to-java" },
    openGraph: {
        title: "JSON to Java Converter | JSON PowerHouse",
        description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-java",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Java Converter | JSON PowerHouse",
        description: "Convert JSON to Java POJOs instantly.",
    },
};

export default function JavaGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-java">
                <JavaGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to Java"
                    description="Generate Java POJO classes from JSON data instantly. Choose between Jackson, Gson, or Lombok annotations."
                    features={[
                        "Generate Java POJOs from JSON",
                        "Jackson, Gson, and Lombok annotation support",
                        "Private fields with getters and setters",
                        "toString, equals, and hashCode methods",
                        "Handles nested objects and collections",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object representing your API response." },
                        { title: "Select framework", description: "Choose Jackson, Gson, or Lombok for annotations." },
                        { title: "Copy Java code", description: "Get production-ready Java classes." },
                    ]}
                    faq={[
                        { question: "What annotations are supported?", answer: "Jackson (@JsonProperty), Gson (@SerializedName), and Lombok (@Data, @Builder) annotations." },
                        { question: "Can I use this for Android?", answer: "Yes. Generated POJOs work with Retrofit, Volley, and other Android networking libraries." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Kotlin", path: "/tools/code/json-to-kotlin" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Python", path: "/tools/code/json-to-python" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
