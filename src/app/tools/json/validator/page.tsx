import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import ToolArticle from "@/app/components/ToolArticle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
    description: "Validate JSON syntax, find errors, and debug your data with detailed error messages. Free online JSON Validator.",
    keywords: ["json validator", "validate json", "json linter", "json syntax checker", "json error finder", "json debug"],
    alternates: { canonical: '/tools/json/validator' },
    openGraph: {
        title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
        description: "Validate JSON syntax, find errors, and debug your data with detailed error messages.",
        url: "https://json-powerhouse.codarivu.com/tools/json/validator",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Validator Online – Lint & Debug JSON | JSON PowerHouse",
        description: "Validate JSON syntax, find errors, and debug your data.",
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
                    description: "Validate JSON syntax, find errors, and debug your data.",
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
