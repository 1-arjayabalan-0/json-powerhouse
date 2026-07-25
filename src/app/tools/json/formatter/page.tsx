import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import SeoAccordion from "@/app/components/SeoAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
    description: "Format and beautify JSON with proper indentation. Customize indent size, sort keys, toggle trailing commas. Free online JSON Formatter.",
    keywords: ["json formatter", "format json", "json beautifier", "json prettifier", "json indentation", "online json formatter"],
    alternates: {
        canonical: '/tools/json/formatter',
    },
    openGraph: {
        title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
        description: "Format and beautify JSON with proper indentation. Customize indent size, sort keys, toggle trailing commas.",
        url: "https://json-powerhouse.codarivu.com/tools/json/formatter",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
        description: "Format and beautify JSON with proper indentation.",
    },
};

export default function JSONFormatterPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Formatter",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/formatter",
                    description: "Format and beautify JSON with proper indentation.",
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-formatter" />
                <SeoAccordion
                    toolName="JSON Formatter"
                    description="JSON PowerHouse Formatter instantly formats and beautifies your JSON data. Paste raw, minified, or messy JSON and get properly indented, readable output. All processing happens in your browser — your data never leaves your device."
                    features={[
                        "Customizable indentation (2 spaces, 4 spaces, tabs)",
                        "Sort keys alphabetically for consistent structure",
                        "Toggle trailing commas on or off",
                        "Strip JSON comments for clean output",
                        "Remove null values with one click",
                        "Copy to clipboard or download formatted file",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Drop your raw JSON into the input editor, or click Sample to load example data." },
                        { title: "Adjust settings", description: "Choose indentation style, enable key sorting, toggle comments and trailing commas." },
                        { title: "Copy or download", description: "Get your formatted JSON instantly from the output panel." },
                    ]}
                    faq={[
                        { question: "What is a JSON Formatter?", answer: "A JSON Formatter takes raw or minified JSON and reformats it with proper indentation, line breaks, and spacing to make it human-readable." },
                        { question: "Is my data safe?", answer: "Yes. All formatting happens in your browser. Your JSON data is never sent to any server." },
                        { question: "Can I format JSON with comments?", answer: "Yes. JSON PowerHouse supports JSONC (JSON with comments). You can strip or preserve comments during formatting." },
                    ]}
                    relatedTools={[
                        { name: "JSON Validator", path: "/tools/json/validator" },
                        { name: "JSON Minifier", path: "/tools/json/minifier" },
                        { name: "JSON Viewer", path: "/tools/json/viewer" },
                        { name: "JSON Diff", path: "/tools/json/diff" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                    ]}
                />
            </div>
        </>
    );
}
