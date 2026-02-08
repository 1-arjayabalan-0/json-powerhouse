import type { Metadata } from "next";
import SwiftGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Swift Converter | JSON PowerHouse",
    description: "Convert JSON to Swift structs or classes instantly. Supports Codable protocol.",
};

export default function SwiftGeneratorPage() {
    return <SwiftGeneratorClient />;
}
