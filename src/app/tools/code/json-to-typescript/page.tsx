import type { Metadata } from "next";
import TypeScriptGeneratorClient from "./client";
import JsonLd from "@/app/components/JsonLd";

export const metadata: Metadata = {
    title: "JSON to TypeScript Converter | JSON PowerHouse",
    description: "Convert JSON to TypeScript interfaces instantly. Free, secure, and runs in your browser.",
    keywords: ["json to typescript", "json to interface", "typescript code generator", "json to ts"],
    alternates: {
        canonical: "/tools/code/json-to-typescript",
    },
    openGraph: {
        title: "JSON to TypeScript Converter | JSON PowerHouse",
        description: "Convert JSON to TypeScript interfaces instantly. Free, secure, and runs in your browser.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-typescript",
        type: "website",
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
                    description: "Convert JSON to TypeScript interfaces instantly. Free, secure, and runs in your browser.",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD",
                    },
                }}
            />
            <TypeScriptGeneratorClient />
        </>
    );
}
