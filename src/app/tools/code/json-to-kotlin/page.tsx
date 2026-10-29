import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import KotlinGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Kotlin Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Kotlin data classes instantly. Supports Kotlinx Serialization and Jackson. Free online code generator.",
    keywords: ["json to kotlin", "json to data class", "kotlin code generator", "json to kotlin class"],
    alternates: { canonical: "/tools/code/json-to-kotlin" },
    openGraph: {
        title: "JSON to Kotlin Converter | JSON PowerHouse",
        description: "Convert JSON to Kotlin data classes instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-kotlin",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Kotlin Converter | JSON PowerHouse",
        description: "Convert JSON to Kotlin data classes instantly.",
    },
};

export default function KotlinGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-kotlin">
                <KotlinGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-kotlin" />
        </>
    );
}
