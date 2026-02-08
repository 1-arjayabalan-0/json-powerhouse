import type { Metadata } from "next";
import JSON5ConverterClient from "./client";

export const metadata: Metadata = {
    title: "JSON5 Converter | JSON PowerHouse",
    description: "Convert JSON to JSON5 and vice versa. Supports comments, trailing commas, and more.",
    alternates: {
        canonical: '/tools/json/json5',
    },
};

export default function JSON5ConverterPage() {
    return <JSON5ConverterClient />;
}
