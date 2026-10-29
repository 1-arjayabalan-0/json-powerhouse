import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import PHPGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to PHP Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to PHP arrays and classes instantly. Free online code generator with type hints.",
    keywords: ["json to php", "json to php array", "php code generator", "json to php converter", "php model generator"],
    alternates: { canonical: "/tools/code/json-to-php" },
    openGraph: {
        title: "JSON to PHP Converter | JSON PowerHouse",
        description: "Convert JSON to PHP arrays and classes instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-php",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to PHP Converter | JSON PowerHouse",
        description: "Convert JSON to PHP arrays and classes.",
    },
};

export default function PHPGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-php">
                <PHPGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-php" />
        </>
    );
}
