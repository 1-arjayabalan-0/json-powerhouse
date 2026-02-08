import JSONToolPage from "@/app/components/JSONToolPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Minifier Online – Compress JSON",
    description: "Minify and compress JSON data to reduce file size. Best online JSON Minifier for performance optimization.",
    alternates: {
        canonical: '/tools/json/minifier',
    },
};

export default function JSONMinifierPage() {
    return (
        <>
            <div className="h-[calc(100vh-48px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-minifier" />
            </div>

        </>
    );
}
