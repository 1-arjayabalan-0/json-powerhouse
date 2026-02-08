import type { Metadata } from "next";
import KotlinGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Kotlin Converter | JSON PowerHouse",
    description: "Convert JSON to Kotlin data classes instantly. Supports Kotlinx Serialization and Jackson.",
};

export default function KotlinGeneratorPage() {
    return <KotlinGeneratorClient />;
}
