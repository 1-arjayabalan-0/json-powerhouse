import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import JSONTransformClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
    description: "Transform JSON visually: rename keys, remove fields, convert case, flatten/nest structures. Free online tool.",
    keywords: ["json transform", "rename json keys", "flatten json", "json key converter", "json mapper"],
    alternates: { canonical: '/tools/json/transform' },
    openGraph: {
        title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
        description: "Transform JSON visually: rename keys, remove fields, convert case, flatten/nest structures.",
        url: "https://json-powerhouse.codarivu.com/tools/json/transform",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
        description: "Transform JSON visually.",
    },
};

export default function JSONTransformPage() {
    return (
        <>
            <ToolWorkspace toolId="json-transform">
                <JSONTransformClient />
            </ToolWorkspace>
            <ToolArticle toolId="json-transform" />
        </>
    );
}
