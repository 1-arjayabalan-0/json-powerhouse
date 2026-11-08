import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import SchemaGeneratorClient from "../SchemaGeneratorClient";

const title = "JSON to JSON Schema Generator Online – Draft 2020-12 & 07 | JSON PowerHouse";
const description = "Generate a JSON Schema from sample JSON. Infers types, required properties, nullable fields and formats like date-time, email and uuid. Supports draft 2020-12 and draft-07. Free, runs in your browser.";
const url = "https://json-powerhouse.codarivu.com/tools/schema/json-to-json-schema";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json to json schema", "json schema generator", "generate json schema from json", "json schema from example", "json schema draft 7 generator", "json schema 2020-12"],
    alternates: { canonical: "/tools/schema/json-to-json-schema" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function JsonToJsonSchemaPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: title.split(" | ")[0],
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url,
                    description,
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <ToolWorkspace toolId="json-to-json-schema">
                <SchemaGeneratorClient target="json-schema" />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-json-schema" />
        </>
    );
}
