import SeoAccordion from "@/app/components/SeoAccordion";
import type { Metadata } from "next";
import JSON5ConverterClient from "./client";

export const metadata: Metadata = {
    title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
    description: "Convert JSON to JSON5 and vice versa. Supports comments, trailing commas, unquoted keys. Free online converter.",
    keywords: ["json5", "json to json5", "json5 converter", "json5 format", "json5 parser", "json5 online"],
    alternates: { canonical: '/tools/json/json5' },
    openGraph: {
        title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
        description: "Convert JSON to JSON5 and vice versa. Supports comments, trailing commas.",
        url: "https://json-powerhouse.codarivu.com/tools/json/json5",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
        description: "Convert JSON to JSON5 and vice versa.",
    },
};

export default function JSON5ConverterPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <JSON5ConverterClient />
            <SeoAccordion
                toolName="JSON5 Converter"
                description="Convert between standard JSON and JSON5 format instantly. JSON5 supports comments, trailing commas, unquoted keys, single quotes, and more."
                features={[
                    "Convert JSON to JSON5 format",
                    "Convert JSON5 back to standard JSON",
                    "Supports comments in JSON5",
                    "Handles trailing commas and unquoted keys",
                    "Single and double quote support",
                    "Instant bidirectional conversion",
                ]}
                howToSteps={[
                    { title: "Paste your data", description: "Enter either standard JSON or JSON5 into the input editor." },
                    { title: "Select direction", description: "Choose to convert to JSON5 or to JSON." },
                    { title: "Copy the result", description: "Get your converted output instantly." },
                ]}
                faq={[
                    { question: "What is JSON5?", answer: "A more human-friendly data format that supports comments, trailing commas, unquoted keys, single quotes, and more. Commonly used for configuration files." },
                    { question: "Is JSON5 compatible with standard JSON?", answer: "JSON5 is a superset of JSON. Any valid JSON is also valid JSON5. But JSON5 features like comments are not supported by standard JSON parsers." },
                ]}
                relatedTools={[
                    { name: "JSON Formatter", path: "/tools/json/formatter" },
                    { name: "JSON Validator", path: "/tools/json/validator" },
                    { name: "JSON Minifier", path: "/tools/json/minifier" },
                    { name: "JSON Normalize", path: "/tools/json/normalize" },
                ]}
            />
        </div>
    );
}
