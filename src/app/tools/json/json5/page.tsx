import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import ToolArticle from "@/app/components/ToolArticle";
import type { Metadata } from "next";
import JSON5ConverterClient from "./client";

export const metadata: Metadata = {
    title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
    description: "Convert JSON to JSON5 and vice versa. Supports comments, trailing commas, unquoted keys. Free online converter.",
    keywords: ["json5", "json to json5", "json5 converter", "json5 format", "json5 parser", "json5 online"],
    alternates: { canonical: '/tools/json/json5' },
    openGraph: {
        title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
        description: "Convert JSON to JSON5 and vice versa. Supports comments, trailing commas.",
        url: "https://json-powerhouse.codarivu.com/tools/json/json5",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON5 Converter – JSON to JSON5 | JSON PowerHouse",
        description: "Convert JSON to JSON5 and vice versa.",
    },
};

export default function JSON5ConverterPage() {
    return (
        <>
            <ToolWorkspace toolId="json-json5">
                <JSON5ConverterClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-json5" />
        </>
    );
}
