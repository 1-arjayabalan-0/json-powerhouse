import { Metadata } from "next";
import DiagnosticsTestClient from "./client";

export const metadata: Metadata = {
    title: "JSON Diagnostics Test Suite | JSON PowerHouse",
    description: "Test and validate the JSON parsing, healing, and fixing engine with comprehensive diagnostics.",
    keywords: ["json diagnostics", "json validator test", "json fixing engine", "json healing"],
    alternates: {
        canonical: "/tools/tests/diagnostics",
    },
    openGraph: {
        title: "JSON Diagnostics Test Suite | JSON PowerHouse",
        description: "Test and validate the JSON parsing, healing, and fixing engine with comprehensive diagnostics.",
        url: "https://json-powerhouse.codarivu.com/tools/tests/diagnostics",
        type: "website",
    },
};

export default function DiagnosticsTestPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <DiagnosticsTestClient />
        </div>
    );
}
