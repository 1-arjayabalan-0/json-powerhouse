import type { Metadata } from "next";
import CSharpGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to C# Converter | JSON PowerHouse",
    description: "Convert JSON to C# classes or records instantly. Supports System.Text.Json and Newtonsoft.Json attributes.",
    keywords: ["json to csharp", "json to c#", "csharp code generator", "json to c# class"],
    alternates: {
        canonical: "/tools/code/json-to-csharp",
    },
    openGraph: {
        title: "JSON to C# Converter | JSON PowerHouse",
        description: "Convert JSON to C# classes or records instantly. Supports System.Text.Json and Newtonsoft.Json attributes.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-csharp",
        type: "website",
    },
};

export default function CSharpGeneratorPage() {
    return <CSharpGeneratorClient />;
}
