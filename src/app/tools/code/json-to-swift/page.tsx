import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import SwiftGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Swift Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Swift structs or classes instantly. Supports Codable protocol. Free online code generator.",
    keywords: ["json to swift", "json to swift struct", "swift code generator", "json to codable"],
    alternates: { canonical: "/tools/code/json-to-swift" },
    openGraph: {
        title: "JSON to Swift Converter | JSON PowerHouse",
        description: "Convert JSON to Swift structs or classes with Codable support.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-swift",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Swift Converter | JSON PowerHouse",
        description: "Convert JSON to Swift structs with Codable.",
    },
};

export default function SwiftGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-swift">
                <SwiftGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-swift" />
        </>
    );
}
