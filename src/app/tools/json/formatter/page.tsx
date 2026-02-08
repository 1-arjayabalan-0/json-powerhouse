import JSONToolPage from "@/app/components/JSONToolPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter Online – Free Tool",
    description: "Format and beautify JSON with proper indentation. Best online JSON Formatter.",
    alternates: {
        canonical: '/tools/json/formatter',
    },
};

export default function JSONFormatterPage() {
    return (
        <>
            <div className="h-[calc(100vh-48px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-formatter" />
            </div>
        </>
    );
}
