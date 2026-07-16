import { Metadata } from "next";
import JsonViewerClient from "./client";

export const metadata: Metadata = {
    title: "JSON Viewer Online – Tree & Raw View | JSON PowerHouse",
    description: "View JSON data in tree or raw format. Expand, collapse, search, and filter JSON structures online.",
    keywords: ["json viewer", "json tree viewer", "json editor online", "json formatter viewer"],
    alternates: {
        canonical: "/tools/json/viewer",
    },
    openGraph: {
        title: "JSON Viewer Online – Tree & Raw View | JSON PowerHouse",
        description: "View JSON data in tree or raw format. Expand, collapse, search, and filter JSON structures online.",
        url: "https://json-powerhouse.codarivu.com/tools/json/viewer",
        type: "website",
    },
};

export default function JsonViewerPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <JsonViewerClient />
        </div>
    );
}
