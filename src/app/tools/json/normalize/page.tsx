import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import JSONNormalizeClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
    description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure. Free online tool.",
    keywords: ["json normalize", "sort json keys", "json standardize", "json sort keys", "json organize"],
    alternates: { canonical: "/tools/json/normalize" },
    openGraph: {
        title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
        description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure.",
        url: "https://json-powerhouse.codarivu.com/tools/json/normalize",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
        description: "Normalize JSON by sorting keys and standardizing structure.",
    },
};

export default function JSONNormalizePage() {
    return (
        <>
            <ToolWorkspace toolId="json-normalize">
                <JSONNormalizeClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-normalize" />
        </>
    );
}
