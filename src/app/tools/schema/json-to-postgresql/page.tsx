import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import SchemaGeneratorClient from "../SchemaGeneratorClient";

const title = "JSON to PostgreSQL – CREATE TABLE & INSERT Generator | JSON PowerHouse";
const description = "Convert JSON to PostgreSQL tables online. Generates CREATE TABLE with JSONB, arrays, TIMESTAMPTZ, foreign keys for nested data, and optional INSERT statements. Free, runs in your browser.";
const url = "https://json-powerhouse.codarivu.com/tools/schema/json-to-postgresql";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json to postgresql", "json to postgres", "json to sql", "json to create table postgres", "json to postgres insert", "generate postgres schema from json", "json to jsonb"],
    alternates: { canonical: "/tools/schema/json-to-postgresql" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function JsonToPostgreSQLPage() {
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
            <ToolWorkspace toolId="json-to-postgresql">
                <SchemaGeneratorClient target="postgresql" />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-postgresql" />
        </>
    );
}
