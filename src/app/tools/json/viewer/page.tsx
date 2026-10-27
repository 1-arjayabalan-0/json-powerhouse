import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import JsonViewerClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

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
                <SeoAccordion
                    toolName="JSON Viewer"
                    description="Explore your JSON data with an interactive tree view. Expand and collapse nodes, search for specific keys or values, copy paths, and switch between tree and raw JSON views."
                    features={[
                        "Interactive tree view with expand/collapse",
                        "Search within JSON data by key or value",
                        "Copy paths to specific values",
                        "Switch between tree and raw JSON views",
                        "Syntax highlighting for readability",
                        "Handles deeply nested structures",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter your JSON data into the input area." },
                        { title: "Explore the tree", description: "Click nodes to expand or collapse. Use search to find specific keys or values." },
                        { title: "Copy paths", description: "Click any node to copy its JSON path for use in your code." },
                    ]}
                    faq={[
                        { question: "What is a JSON Viewer?", answer: "It displays JSON in an interactive hierarchical tree structure, making it easy to navigate complex nested data." },
                        { question: "Can I search for specific values?", answer: "Yes. Use the search function to find any key or value within your JSON data." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Validator", path: "/tools/json/validator" },
                        { name: "JSON Diff", path: "/tools/json/diff" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                    ]}
                />
        </>
    );
}
