import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import RustGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Rust Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON data to Rust structs instantly. Free online code generator with serde support and type inference.",
    keywords: ["json to rust", "json to rust struct", "rust code generator", "serde json", "rust struct generator"],
    alternates: { canonical: "/tools/code/json-to-rust" },
    openGraph: {
        title: "JSON to Rust Converter | JSON PowerHouse",
        description: "Convert JSON to Rust structs with serde support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-rust",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Rust Converter | JSON PowerHouse",
        description: "Convert JSON to Rust structs instantly.",
    },
};

export default function RustGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-rust">
                <RustGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-rust" />
        </>
    );
}
