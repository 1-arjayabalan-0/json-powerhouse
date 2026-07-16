import type { Metadata } from "next";
import JavaGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Java Converter | JSON PowerHouse",
    description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok annotations.",
    keywords: ["json to java", "json to pojo", "java code generator", "json to java class"],
    alternates: {
        canonical: "/tools/code/json-to-java",
    },
    openGraph: {
        title: "JSON to Java Converter | JSON PowerHouse",
        description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok annotations.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-java",
        type: "website",
    },
};

export default function JavaGeneratorPage() {
    return <JavaGeneratorClient />;
}
