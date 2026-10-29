import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import GoGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Go Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Go structs instantly. Free online code generator with proper typing and struct tags.",
    keywords: ["json to go", "json to go struct", "go code generator", "json to golang converter", "golang struct generator"],
    alternates: { canonical: "/tools/code/json-to-go" },
    openGraph: {
        title: "JSON to Go Converter | JSON PowerHouse",
        description: "Convert JSON to Go structs instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-go",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Go Converter | JSON PowerHouse",
        description: "Convert JSON to Go structs instantly.",
    },
};

export default function GoGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-go">
                <GoGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-go" />
        </>
    );
}
