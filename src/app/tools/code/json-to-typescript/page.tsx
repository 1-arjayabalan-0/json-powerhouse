import type { Metadata } from "next";
import TypeScriptGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to TypeScript Converter | JSON PowerHouse",
    description: "Convert JSON to TypeScript interfaces instantly. Free, secure, and runs in your browser.",
};

export default function TypeScriptGeneratorPage() {
    return <TypeScriptGeneratorClient />;
}
