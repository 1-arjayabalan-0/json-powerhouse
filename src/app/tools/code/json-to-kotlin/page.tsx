import type { Metadata } from "next";
import KotlinGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Kotlin Converter | JSON PowerHouse",
    description: "Convert JSON to Kotlin data classes instantly. Supports Kotlinx Serialization and Jackson.",
    keywords: ["json to kotlin", "json to data class", "kotlin code generator", "json to kotlin class"],
    alternates: {
        canonical: "/tools/code/json-to-kotlin",
    },
    openGraph: {
        title: "JSON to Kotlin Converter | JSON PowerHouse",
        description: "Convert JSON to Kotlin data classes instantly. Supports Kotlinx Serialization and Jackson.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-kotlin",
        type: "website",
    },
};

export default function KotlinGeneratorPage() {
    return <KotlinGeneratorClient />;
}
