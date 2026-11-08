import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";
import type { Metadata } from "next";
import SchemaGeneratorClient from "../SchemaGeneratorClient";

const title = "JSON to Prisma Schema – Model Generator Online | JSON PowerHouse";
const description = "Generate a Prisma schema from JSON. Creates models with types, @id, relations for nested objects and arrays, and @map names for PostgreSQL, MySQL or SQLite. Free, runs in your browser.";
const url = "https://json-powerhouse.codarivu.com/tools/schema/json-to-prisma";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json to prisma", "json to prisma schema", "prisma schema generator", "prisma model generator", "generate prisma schema from json"],
    alternates: { canonical: "/tools/schema/json-to-prisma" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
};

export default function JsonToPrismaPage() {
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
            <ToolWorkspace toolId="json-to-prisma">
                <SchemaGeneratorClient target="prisma" />
            </ToolWorkspace>
            <ToolArticle toolId="json-to-prisma" />
        </>
    );
}
