import { Metadata } from "next";
import GoGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Go Converter Online – Free Tool | JSON PowerHouse",
    description: "Convert JSON to Go structs instantly. Free online JSON to Go code generator with proper typing.",
    keywords: ["json to go", "json to go struct", "go code generator", "json to golang converter"],
    alternates: {
        canonical: "/tools/code/json-to-go",
    },
    openGraph: {
        title: "JSON to Go Converter Online – Free Tool | JSON PowerHouse",
        description: "Convert JSON to Go structs instantly. Free online JSON to Go code generator with proper typing.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-go",
        type: "website",
    },
};

export default function GoGeneratorPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <GoGeneratorClient />
        </div>
    );
}
