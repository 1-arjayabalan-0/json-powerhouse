
import { Metadata } from "next";
import { UnifiedJsonDiffMerge } from "./components/UnifiedJsonDiffMerge";

export const metadata: Metadata = {
    title: "JSON Diff Checker & Merge Tool | JSON Powerhouse",
    description: "Compare, merge, and resolve conflicts between JSON files with a powerful 3-way merge tool. Supports RFC 6902 and JSON5.",
    keywords: ["json diff", "json compare", "json merge", "json diff tool", "json patch"],
    alternates: {
        canonical: "/tools/json/diff",
    },
    openGraph: {
        title: "JSON Diff Checker & Merge Tool | JSON Powerhouse",
        description: "Compare, merge, and resolve conflicts between JSON files with a powerful 3-way merge tool. Supports RFC 6902 and JSON5.",
        url: "https://json-powerhouse.codarivu.com/tools/json/diff",
        type: "website",
    },
};

export default function JsonDiffPage() {
    return (
        <div className="h-[calc(100vh-48px)] w-full relative flex flex-col">
            <UnifiedJsonDiffMerge />
        </div>
    );
}
