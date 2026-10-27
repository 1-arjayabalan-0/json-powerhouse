import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import SeoAccordion from "@/app/components/SeoAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
    description: "Validate JSON syntax, find errors, and debug your data with detailed error messages. Free online JSON Validator.",
    keywords: ["json validator", "validate json", "json linter", "json syntax checker", "json error finder", "json debug"],
    alternates: { canonical: '/tools/json/validator' },
    openGraph: {
        title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
        description: "Validate JSON syntax, find errors, and debug your data with detailed error messages.",
        url: "https://json-powerhouse.codarivu.com/tools/json/validator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
        description: "Validate JSON syntax, find errors, and debug your data.",
    },
};

export default function JSONValidatorPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Validator",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/validator",
                    description: "Validate JSON syntax, find errors, and debug your data.",
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <>
                <ToolWorkspace toolId="json-validator">
                    <JSONToolPage toolId="json-validator" />
                </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON Validator"
                    description="Instantly validate your JSON data. Paste any JSON string and get immediate feedback on syntax errors, missing commas, unmatched brackets, and more."
                    features={[
                        "Real-time JSON syntax validation",
                        "Detailed error messages with line and column numbers",
                        "Highlights problematic characters",
                        "Supports standard JSON and JSONC (with comments)",
                        "Validates nested structures and arrays",
                        "100% client-side — your data stays private",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter or paste your JSON data into the input editor." },
                        { title: "See validation results", description: "The tool instantly checks your JSON and highlights any syntax errors." },
                        { title: "Fix and re-validate", description: "Correct errors based on the detailed messages, then re-paste to verify." },
                    ]}
                    faq={[
                        { question: "What does a JSON Validator do?", answer: "It checks your JSON data for syntax errors like missing commas, unmatched brackets, unquoted keys, and invalid values. It tells you exactly where the error is." },
                        { question: "Why is my JSON invalid?", answer: "Common reasons: missing commas, trailing commas, unquoted keys, single quotes, and comments (not supported in standard JSON)." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Viewer", path: "/tools/json/viewer" },
                        { name: "JSON Diff", path: "/tools/json/diff" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                    ]}
                />
            </>
        </>
    );
}
