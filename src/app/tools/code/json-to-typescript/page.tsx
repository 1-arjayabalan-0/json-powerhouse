import type { Metadata } from "next";
import TypeScriptGeneratorClient from "./client";
import JsonLd from "@/app/components/JsonLd";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to TypeScript Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to TypeScript interfaces instantly. Generate type definitions from JSON data. Free, secure, runs in your browser.",
    keywords: ["json to typescript", "json to interface", "typescript code generator", "json to ts", "typescript type generator"],
    alternates: { canonical: "/tools/code/json-to-typescript" },
    openGraph: {
        title: "JSON to TypeScript Converter – Free Online Tool | JSON PowerHouse",
        description: "Convert JSON to TypeScript interfaces instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-typescript",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to TypeScript Converter | JSON PowerHouse",
        description: "Convert JSON to TypeScript interfaces instantly.",
    },
};

export default function TypeScriptGeneratorPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON to TypeScript Converter",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/code/json-to-typescript",
                    description: "Convert JSON to TypeScript interfaces instantly.",
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <TypeScriptGeneratorClient />
                <SeoAccordion
                    toolName="JSON to TypeScript"
                    description="Automatically generate TypeScript interfaces from your JSON data. Paste any JSON object and get properly typed TypeScript definitions."
                    features={[
                        "Generate TypeScript interfaces from JSON",
                        "Automatic nested type generation",
                        "Handles arrays, unions, and optional properties",
                        "Support for type aliases and enums",
                        "Copy generated types to clipboard",
                        "Client-side processing — your data stays private",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object representing your data structure." },
                        { title: "Generate TypeScript", description: "The tool instantly produces matching TypeScript interfaces." },
                        { title: "Copy and use", description: "Copy the generated types and paste them into your TypeScript project." },
                    ]}
                    faq={[
                        { question: "How does JSON to TypeScript conversion work?", answer: "The tool analyzes your JSON structure — keys, value types, nested objects, arrays — and generates corresponding TypeScript interfaces." },
                        { question: "Can it handle nested objects?", answer: "Yes. Deeply nested structures are converted into separate TypeScript interfaces for each level." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON to Python", path: "/tools/code/json-to-python" },
                        { name: "JSON to C#", path: "/tools/code/json-to-csharp" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
            </div>
        </>
    );
}
