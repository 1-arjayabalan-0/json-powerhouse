import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import JSONNormalizeClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";
import JsonLd from "@/app/components/JsonLd";

const title = "Remove Comments from JSON & Normalize Online – Sort Keys | JSON PowerHouse";
const description = "Strip // and /* */ comments from JSON or JSONC, sort keys, and normalize whitespace into clean, strict JSON. Free, runs in your browser.";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json normalize", "remove comments from json", "strip json comments", "jsonc to json", "sort json keys", "json sort keys online", "normalize json online"],
    alternates: { canonical: "/tools/json/normalize" },
    openGraph: {
        title,
        description,
        url: "https://json-powerhouse.codarivu.com/tools/json/normalize",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function JSONNormalizePage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Normalize & Strip Comments",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/normalize",
                    description,
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <ToolWorkspace toolId="json-normalize">
                <JSONNormalizeClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-normalize" />
        </>
    );
}
