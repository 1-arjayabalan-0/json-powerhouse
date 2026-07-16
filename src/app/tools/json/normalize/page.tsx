import { Metadata } from "next";
import JSONNormalizeClient from "./client";

export const metadata: Metadata = {
    title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
    description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure. Free online tool.",
    keywords: ["json normalize", "sort json keys", "json standardize", "json sort keys"],
    alternates: {
        canonical: "/tools/json/normalize",
    },
    openGraph: {
        title: "JSON Normalize Online – Sort Keys & Structure | JSON PowerHouse",
        description: "Normalize JSON by sorting keys, removing whitespace, and standardizing structure. Free online tool.",
        url: "https://json-powerhouse.codarivu.com/tools/json/normalize",
        type: "website",
    },
};

export default function JSONNormalizePage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <JSONNormalizeClient />
        </div>
    );
}
