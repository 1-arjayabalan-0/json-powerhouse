import type { Metadata } from "next";
import CSharpGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to C# Converter | JSON PowerHouse",
    description: "Convert JSON to C# classes or records instantly. Supports System.Text.Json and Newtonsoft.Json attributes.",
};

export default function CSharpGeneratorPage() {
    return <CSharpGeneratorClient />;
}
