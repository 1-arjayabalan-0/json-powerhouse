import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import TypeScriptGeneratorClient from "./client";
import JsonLd from "@/app/components/JsonLd";
import ToolArticle from "@/app/components/ToolArticle";

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
            <ToolWorkspace toolId="json-to-typescript">
                <TypeScriptGeneratorClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-typescript" />
        </>
    );
}
