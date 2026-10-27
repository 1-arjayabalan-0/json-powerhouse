import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import SeoAccordion from "@/app/components/SeoAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
    description: "Minify and compress JSON data to reduce file size. Remove whitespace and formatting. Free online JSON Minifier.",
    keywords: ["json minifier", "minify json", "compress json", "json compressor", "reduce json size", "json optimizer"],
    alternates: { canonical: '/tools/json/minifier' },
    openGraph: {
        title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
        description: "Minify and compress JSON data to reduce file size.",
        url: "https://json-powerhouse.codarivu.com/tools/json/minifier",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
        description: "Minify and compress JSON data to reduce file size.",
    },
};

export default function JSONMinifierPage() {
    return (
        <>
            <ToolWorkspace toolId="json-minifier">
                <JSONToolPage toolId="json-minifier" />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON Minifier"
                    description="Reduce your JSON file size instantly. Remove all unnecessary whitespace, line breaks, and indentation to produce the smallest possible JSON output."
                    features={[
                        "Strip all whitespace and line breaks",
                        "Remove trailing commas",
                        "Produces smallest possible JSON output",
                        "Copy to clipboard or download minified file",
                        "Real-time size comparison (before vs after)",
                        "Client-side processing for privacy",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter your formatted or raw JSON into the input editor." },
                        { title: "Get minified output", description: "The tool instantly removes all whitespace and produces compact JSON." },
                        { title: "Copy or download", description: "Grab your minified JSON from the output panel." },
                    ]}
                    faq={[
                        { question: "What is JSON minification?", answer: "It removes all unnecessary characters from JSON — whitespace, line breaks, indentation — without changing data structure." },
                        { question: "Does minifying change my data?", answer: "No. Minification only removes formatting characters. The actual data values and structure remain identical." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Validator", path: "/tools/json/validator" },
                        { name: "JSON Normalize", path: "/tools/json/normalize" },
                        { name: "JSON Viewer", path: "/tools/json/viewer" },
                    ]}
                />
        </>
    );
}
