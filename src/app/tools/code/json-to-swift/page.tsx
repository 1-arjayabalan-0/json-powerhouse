import type { Metadata } from "next";
import SwiftGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to Swift Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Swift structs or classes instantly. Supports Codable protocol. Free online code generator.",
    keywords: ["json to swift", "json to swift struct", "swift code generator", "json to codable"],
    alternates: { canonical: "/tools/code/json-to-swift" },
    openGraph: {
        title: "JSON to Swift Converter | JSON PowerHouse",
        description: "Convert JSON to Swift structs or classes with Codable support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-swift",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Swift Converter | JSON PowerHouse",
        description: "Convert JSON to Swift structs with Codable.",
    },
};

export default function SwiftGeneratorPage() {
    return (
        <>
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <SwiftGeneratorClient />
                <SeoAccordion
                    toolName="JSON to Swift"
                    description="Generate Swift structs with Codable protocol support. Get properly typed Swift models with CodingKeys."
                    features={[
                        "Generate Swift structs with Codable protocol",
                        "CodingKeys for custom property mapping",
                        "Optional type handling",
                        "Nested struct generation",
                        "Class and struct output options",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object from your API response." },
                        { title: "Generate Swift code", description: "Get Codable structs with CodingKeys." },
                        { title: "Copy and integrate", description: "Paste the generated models into your Xcode project." },
                    ]}
                    faq={[
                        { question: "Does it support Codable?", answer: "Yes. Generated code uses Codable with Encodable/Decodable conformance and CodingKeys." },
                        { question: "Can I use this for iOS development?", answer: "Yes. Works with URLSession, Alamofire, and any iOS networking library." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Kotlin", path: "/tools/code/json-to-kotlin" },
                        { name: "JSON to Dart", path: "/tools/code/json-to-dart" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
            </div>
        </>
    );
}
