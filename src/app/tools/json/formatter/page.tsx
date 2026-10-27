import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import ToolArticle from "@/app/components/ToolArticle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
    description: "Format and beautify JSON with proper indentation. Customize indent size, sort keys, toggle trailing commas. Free online JSON Formatter.",
    keywords: ["json formatter", "format json", "json beautifier", "json prettifier", "json indentation", "online json formatter"],
    alternates: {
        canonical: '/tools/json/formatter',
    },
    openGraph: {
        title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
        description: "Format and beautify JSON with proper indentation. Customize indent size, sort keys, toggle trailing commas.",
        url: "https://json-powerhouse.codarivu.com/tools/json/formatter",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Formatter Online – Free Tool | JSON PowerHouse",
        description: "Format and beautify JSON with proper indentation.",
    },
};

export default function JSONFormatterPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Formatter",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/formatter",
                    description: "Format and beautify JSON with proper indentation.",
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <>
                <ToolWorkspace toolId="json-formatter">
                    <JSONToolPage toolId="json-formatter" />
                </ToolWorkspace>
                <ToolArticle toolId="json-formatter" />
            </>
        </>
    );
}
