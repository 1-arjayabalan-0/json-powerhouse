import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import TextViewerClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
    description: "View JSON arrays as a readable table. Long text fields wrap automatically with optional Markdown preview. No horizontal scrolling.",
    keywords: ["json text viewer", "json table viewer", "json markdown viewer", "read json strings", "json long text"],
    alternates: { canonical: "/tools/json/text-viewer" },
    openGraph: {
        title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
        description: "View JSON arrays as a readable table with wrapped long text and Markdown preview.",
        url: "https://json-powerhouse.codarivu.com/tools/json/text-viewer",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
        description: "View JSON arrays as a readable table with wrapped long text.",
    },
};

export default function TextViewerPage() {
    return (
        <>
            <ToolWorkspace toolId="json-text-viewer">
                <TextViewerClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-text-viewer" />
        </>
    );
}
