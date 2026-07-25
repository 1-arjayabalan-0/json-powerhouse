import { Metadata } from "next";
import JSONNormalizeClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
    description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure. Free online tool.",
    keywords: ["json normalize", "sort json keys", "json standardize", "json sort keys", "json organize"],
    alternates: { canonical: "/tools/json/normalize" },
    openGraph: {
        title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
        description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure.",
        url: "https://json-powerhouse.codarivu.com/tools/json/normalize",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
        description: "Normalize JSON by sorting keys and standardizing structure.",
    },
};

export default function JSONNormalizePage() {
    return (
        <>
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <JSONNormalizeClient />
                <SeoAccordion
                    toolName="JSON Normalize"
                    description="Standardize your JSON structure. Sort keys alphabetically, remove unnecessary whitespace, and produce consistent output every time."
                    features={[
                        "Sort keys alphabetically (ascending or descending)",
                        "Remove unnecessary whitespace",
                        "Produce consistent, deterministic output",
                        "Useful for JSON comparison and deduplication",
                        "Preserves data values and types",
                        "Client-side processing for privacy",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter your JSON data into the input editor." },
                        { title: "Choose options", description: "Select key sorting order and whitespace removal preferences." },
                        { title: "Copy output", description: "Get your consistently structured JSON from the output panel." },
                    ]}
                    faq={[
                        { question: "What does JSON normalization do?", answer: "It restructures JSON to a canonical form by sorting keys and removing extra whitespace. Two semantically identical JSONs produce identical output." },
                        { question: "Does normalization change my data?", answer: "No. Only formatting and key order change. All data values and types remain the same." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Minifier", path: "/tools/json/minifier" },
                        { name: "JSON Diff", path: "/tools/json/diff" },
                        { name: "JSON Viewer", path: "/tools/json/viewer" },
                    ]}
                />
            </div>
        </>
    );
}
