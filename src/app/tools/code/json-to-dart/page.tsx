import type { Metadata } from "next";
import DartGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Dart Converter | JSON PowerHouse",
    description: "Convert JSON to Dart classes instantly. Supports Freezed and json_serializable.",
};

export default function DartGeneratorPage() {
    return <DartGeneratorClient />;
}
