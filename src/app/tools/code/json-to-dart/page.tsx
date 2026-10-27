import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import DartGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Dart Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Dart classes instantly. Supports Freezed and json_serializable. Free online Flutter code generator.",
    keywords: ["json to dart", "json to dart class", "dart code generator", "json to flutter", "flutter model generator"],
    alternates: { canonical: "/tools/code/json-to-dart" },
    openGraph: {
        title: "JSON to Dart Converter | JSON PowerHouse",
        description: "Convert JSON to Dart classes with Freezed and json_serializable support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-dart",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Dart Converter | JSON PowerHouse",
        description: "Convert JSON to Dart classes instantly.",
    },
};

export default function DartGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-dart">
                <DartGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to Dart"
                    description="Generate Dart model classes from JSON data with json_serializable and Freezed support."
                    features={[
                        "Generate Dart classes from JSON",
                        "json_serializable and Freezed support",
                        "fromJson and toJson method generation",
                        "Nullable type handling",
                        "Nested model generation",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Select style", description: "Choose plain Dart, json_serializable, or Freezed." },
                        { title: "Copy Dart code", description: "Get Flutter-ready model classes." },
                    ]}
                    faq={[
                        { question: "What serialization options are available?", answer: "Plain Dart, json_serializable (@JsonSerializable), or Freezed (@freezed) models." },
                        { question: "Does it support Flutter?", answer: "Yes. Works with Flutter, Dio, http package, and any Dart project." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Kotlin", path: "/tools/code/json-to-kotlin" },
                        { name: "JSON to Swift", path: "/tools/code/json-to-swift" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
