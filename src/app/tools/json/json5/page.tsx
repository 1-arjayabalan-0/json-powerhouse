import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import JSON5ConverterClient from "./client";

const title = "JSON5 Editor & Converter Online – JSON ↔ JSON5 | JSON PowerHouse";
const description = "Free online JSON5 editor. Convert JSON to JSON5 or JSON5 to strict JSON, keep comments, trailing commas and unquoted keys, and spot parse errors. Runs in your browser.";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json5 editor", "json5", "json to json5", "json5 to json", "json5 converter", "json5 validator", "json5 parser", "json5 online"],
    alternates: { canonical: '/tools/json/json5' },
    openGraph: {
        title,
        description,
        url: "https://json-powerhouse.codarivu.com/tools/json/json5",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function JSON5ConverterPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON5 Editor & Converter",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/json5",
                    description,
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <ToolWorkspace toolId="json-json5">
                <JSON5ConverterClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-json5" />
        </>
    );
}
