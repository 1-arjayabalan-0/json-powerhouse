import type { Metadata } from "next";
import SwiftGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Swift Converter | JSON PowerHouse",
    description: "Convert JSON to Swift structs or classes instantly. Supports Codable protocol.",
    keywords: ["json to swift", "json to swift struct", "swift code generator", "json to codable"],
    alternates: {
        canonical: "/tools/code/json-to-swift",
    },
    openGraph: {
        title: "JSON to Swift Converter | JSON PowerHouse",
        description: "Convert JSON to Swift structs or classes instantly. Supports Codable protocol.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-swift",
        type: "website",
    },
};

export default function SwiftGeneratorPage() {
    return <SwiftGeneratorClient />;
}
