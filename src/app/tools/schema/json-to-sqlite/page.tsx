import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import SchemaGeneratorClient from "../SchemaGeneratorClient";

const title = "JSON to SQLite – CREATE TABLE & INSERT Generator | JSON PowerHouse";
const description = "Convert JSON to SQLite tables online. Generates CREATE TABLE with foreign keys for nested data and optional INSERT statements, ready for sqlite3. Free, runs in your browser.";
const url = "https://json-powerhouse.codarivu.com/tools/schema/json-to-sqlite";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json to sqlite", "json to sql", "json to sqlite table", "json to sqlite insert", "import json into sqlite", "generate sqlite schema from json"],
    alternates: { canonical: "/tools/schema/json-to-sqlite" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function JsonToSQLitePage() {
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
            <ToolWorkspace toolId="json-to-sqlite">
                <SchemaGeneratorClient target="sqlite" />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-sqlite" />
        </>
    );
}
