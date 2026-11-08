import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import ToolArticle from "@/app/components/ToolArticle";
import { Metadata } from "next";

const title = "JSON Validator Online – Check, Lint & Fix JSON Errors | JSON PowerHouse";
const description = "Free online JSON validator. Check JSON syntax, see errors by line and column with clear explanations, and auto-fix trailing commas, quotes, comments and more. Runs in your browser.";

export const metadata: Metadata = {
    title,
    description,
    keywords: ["json validator", "json validator online", "validate json", "json checker", "json linter", "json syntax checker", "fix invalid json", "json error finder"],
    alternates: { canonical: '/tools/json/validator' },
    openGraph: {
        title,
        description,
        url: "https://json-powerhouse.codarivu.com/tools/json/validator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
};

export default function JSONValidatorPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Validator",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/validator",
                    description,
                    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                }}
            />
            <ToolWorkspace toolId="json-validator">
                <JSONToolPage toolId="json-validator" />
            </ToolWorkspace>
            <ToolArticle toolId="json-validator" />
        </>
    );
}
