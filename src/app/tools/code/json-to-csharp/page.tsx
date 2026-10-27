import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import CSharpGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to C# Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to C# classes or records instantly. Supports System.Text.Json and Newtonsoft.Json. Free online code generator.",
    keywords: ["json to csharp", "json to c#", "csharp code generator", "json to c# class", "c# poco generator"],
    alternates: { canonical: "/tools/code/json-to-csharp" },
    openGraph: {
        title: "JSON to C# Converter | JSON PowerHouse",
        description: "Convert JSON to C# classes or records instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-csharp",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to C# Converter | JSON PowerHouse",
        description: "Convert JSON to C# classes or records instantly.",
    },
};

export default function CSharpGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-csharp">
                <CSharpGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-csharp" />
        </>
    );
}
