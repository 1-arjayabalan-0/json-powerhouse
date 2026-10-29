import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import JsonViewerClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON Viewer Online – Tree & Raw View | JSON PowerHouse",
    description: "View JSON data in tree or raw format. Expand, collapse, search, and filter JSON structures online.",
    keywords: ["json viewer", "json tree viewer", "json editor online", "json inspector", "json browser"],
    alternates: { canonical: "/tools/json/viewer" },
    openGraph: {
        title: "JSON Viewer Online – Tree & Raw View | JSON PowerHouse",
        description: "View JSON data in tree or raw format. Expand, collapse, search, and filter.",
        url: "https://json-powerhouse.codarivu.com/tools/json/viewer",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Viewer Online – Tree & Raw View | JSON PowerHouse",
        description: "View JSON data in tree or raw format.",
    },
};

export default function JsonViewerPage() {
    return (
        <>
            <ToolWorkspace toolId="json-viewer">
                <JsonViewerClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-viewer" />
        </>
    );
}
