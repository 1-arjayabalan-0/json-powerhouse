import type { Metadata } from "next";
import DartGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Dart Converter | JSON PowerHouse",
    description: "Convert JSON to Dart classes instantly. Supports Freezed and json_serializable.",
    keywords: ["json to dart", "json to dart class", "dart code generator", "json to flutter"],
    alternates: {
        canonical: "/tools/code/json-to-dart",
    },
    openGraph: {
        title: "JSON to Dart Converter | JSON PowerHouse",
        description: "Convert JSON to Dart classes instantly. Supports Freezed and json_serializable.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-dart",
        type: "website",
    },
};

export default function DartGeneratorPage() {
    return <DartGeneratorClient />;
}
