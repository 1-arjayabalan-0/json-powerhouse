import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import PythonGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Python Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Python dictionaries and dataclasses instantly. Free online code generator with type hints.",
    keywords: ["json to python", "json to python dict", "python code generator", "json to python converter", "python type hints"],
    alternates: { canonical: "/tools/code/json-to-python" },
    openGraph: {
        title: "JSON to Python Converter | JSON PowerHouse",
        description: "Convert JSON to Python dictionaries and dataclasses instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-python",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Python Converter | JSON PowerHouse",
        description: "Convert JSON to Python dictionaries and dataclasses.",
    },
};

export default function PythonGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-python">
                <PythonGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-python" />
        </>
    );
}
