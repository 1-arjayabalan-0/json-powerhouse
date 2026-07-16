import { Metadata } from "next";
import RustGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Rust Converter Online – Free Tool | JSON PowerHouse",
    description: "Convert JSON data to Rust structs instantly. Free online JSON to Rust code generator with type inference.",
    keywords: ["json to rust", "json to rust struct", "rust code generator", "json to rust converter"],
    alternates: {
        canonical: "/tools/code/json-to-rust",
    },
    openGraph: {
        title: "JSON to Rust Converter Online – Free Tool | JSON PowerHouse",
        description: "Convert JSON data to Rust structs instantly. Free online JSON to Rust code generator with type inference.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-rust",
        type: "website",
    },
};

export default function RustGeneratorPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <RustGeneratorClient />
        </div>
    );
}
