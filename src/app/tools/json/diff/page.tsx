import ToolWorkspace from "@/app/components/shell/ToolWorkspace";

import { Metadata } from "next";
import { UnifiedJsonDiffMerge } from "./components/UnifiedJsonDiffMerge";
import SeoAccordion from "@/app/components/SeoAccordion";

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
                <SeoAccordion
                    toolName="JSON Diff & Merge"
                    description="Compare two or three JSON documents side-by-side and see exactly what changed. Color-coded output highlights additions, deletions, and modifications."
                    features={[
                        "Side-by-side JSON comparison",
                        "Color-coded additions, deletions, and modifications",
                        "3-way merge for conflict resolution",
                        "RFC 6902 JSON Patch generation",
                        "JSON5 support",
                        "Copy diff results or export as patch file",
                    ]}
                    howToSteps={[
                        { title: "Paste two JSON documents", description: "Enter the original JSON in the left panel and the modified JSON in the right panel." },
                        { title: "View differences", description: "See highlighted changes showing additions, deletions, and modifications." },
                        { title: "Export or merge", description: "Copy the diff results or generate a JSON Patch file." },
                    ]}
                    faq={[
                        { question: "What is JSON diff?", answer: "It compares two JSON documents and identifies differences — what was added, removed, or changed." },
                        { question: "What is RFC 6902?", answer: "A standard format for describing changes between JSON documents as a series of operations (add, remove, replace, move, copy, test)." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Validator", path: "/tools/json/validator" },
                        { name: "JSON Normalize", path: "/tools/json/normalize" },
                        { name: "JSON Viewer", path: "/tools/json/viewer" },
                    ]}
                />
        </>
    );
}
