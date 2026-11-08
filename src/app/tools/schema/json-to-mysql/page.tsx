import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import SchemaGeneratorClient from "../SchemaGeneratorClient";

const title = "JSON to MySQL – CREATE TABLE & INSERT Generator | JSON PowerHouse";
const description = "Convert JSON to MySQL tables online. Generates CREATE TABLE with JSON columns, AUTO_INCREMENT keys, foreign keys for nested data, and optional INSERT statements. Free, runs in your browser.";
const url = "https://json-powerhouse.codarivu.com/tools/schema/json-to-mysql";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json to mysql", "json to sql", "json to mysql table", "json to mysql insert", "json to create table mysql", "generate mysql schema from json"],
    alternates: { canonical: "/tools/schema/json-to-mysql" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function JsonToMySQLPage() {
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
            <ToolWorkspace toolId="json-to-mysql">
                <SchemaGeneratorClient target="mysql" />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-mysql" />
        </>
    );
}
