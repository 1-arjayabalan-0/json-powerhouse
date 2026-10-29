import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONToolPage from "@/app/components/JSONToolPage";
import ToolArticle from "@/app/components/ToolArticle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
    description: "Minify and compress JSON data to reduce file size. Remove whitespace and formatting. Free online JSON Minifier.",
    keywords: ["json minifier", "minify json", "compress json", "json compressor", "reduce json size", "json optimizer"],
    alternates: { canonical: '/tools/json/minifier' },
    openGraph: {
        title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
        description: "Minify and compress JSON data to reduce file size.",
        url: "https://json-powerhouse.codarivu.com/tools/json/minifier",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Minifier Online – Compress JSON | JSON PowerHouse",
        description: "Minify and compress JSON data to reduce file size.",
    },
};

export default function JSONMinifierPage() {
    return (
        <>
            <ToolWorkspace toolId="json-minifier">
                <JSONToolPage toolId="json-minifier" />
            </ToolWorkspace>
                <ToolArticle toolId="json-minifier" />
        </>
    );
}
