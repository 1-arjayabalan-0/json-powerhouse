import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import DartGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Dart Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Dart classes instantly. Supports Freezed and json_serializable. Free online Flutter code generator.",
    keywords: ["json to dart", "json to dart class", "dart code generator", "json to flutter", "flutter model generator"],
    alternates: { canonical: "/tools/code/json-to-dart" },
    openGraph: {
        title: "JSON to Dart Converter | JSON PowerHouse",
        description: "Convert JSON to Dart classes with Freezed and json_serializable support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-dart",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Dart Converter | JSON PowerHouse",
        description: "Convert JSON to Dart classes instantly.",
    },
};

export default function DartGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-dart">
                <DartGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-dart" />
        </>
    );
}
