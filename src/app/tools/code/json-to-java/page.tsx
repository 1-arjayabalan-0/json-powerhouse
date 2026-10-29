import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import type { Metadata } from "next";
import JavaGeneratorClient from "./client";
import ToolArticle from "@/app/components/ToolArticle";

export const metadata: Metadata = {
    title: "JSON to Java Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok annotations. Free online code generator.",
    keywords: ["json to java", "json to pojo", "java code generator", "json to java class", "java pojo generator"],
    alternates: { canonical: "/tools/code/json-to-java" },
    openGraph: {
        title: "JSON to Java Converter | JSON PowerHouse",
        description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-java",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to Java Converter | JSON PowerHouse",
        description: "Convert JSON to Java POJOs instantly.",
    },
};

export default function JavaGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-java">
                <JavaGeneratorClient />
            </ToolWorkspace>
                <ToolArticle toolId="json-to-java" />
        </>
    );
}
