import ToolWorkspace from "@/app/components/shell/ToolWorkspace";

import { Metadata } from "next";
import { UnifiedJsonDiffMerge } from "./components/UnifiedJsonDiffMerge";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON Diff Checker & Merge Tool | JSON PowerHouse",
    description: "Compare, merge, and resolve conflicts between JSON files with a powerful 3-way merge tool. Supports RFC 6902.",
    keywords: ["json diff", "json compare", "json merge", "json patch", "json comparison", "json diff checker"],
    alternates: { canonical: "/tools/json/diff" },
    openGraph: {
        title: "JSON Diff Checker & Merge Tool | JSON PowerHouse",
        description: "Compare, merge, and resolve conflicts between JSON files.",
        url: "https://json-powerhouse.codarivu.com/tools/json/diff",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Diff Checker & Merge Tool | JSON PowerHouse",
        description: "Compare, merge, and resolve conflicts between JSON files.",
    },
};

export default function JsonDiffPage() {
    return (
        <>
            <ToolWorkspace toolId="json-diff">
                <UnifiedJsonDiffMerge />
            </ToolWorkspace>
                <ToolArticle toolId="json-diff" />
        </>
    );
}
