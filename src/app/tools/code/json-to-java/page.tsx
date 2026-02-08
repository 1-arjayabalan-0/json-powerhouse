import type { Metadata } from "next";
import JavaGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Java Converter | JSON PowerHouse",
    description: "Convert JSON to Java POJOs instantly. Supports Jackson, Gson, and Lombok annotations.",
};

export default function JavaGeneratorPage() {
    return <JavaGeneratorClient />;
}
