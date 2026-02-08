import JSONToolPage from "@/app/components/JSONToolPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Validator Online – Lint & Debug JSON",
    description: "Validate JSON syntax, find errors, and debug your data. Best online JSON Validator with error highlighting.",
    alternates: {
        canonical: '/tools/json/validator',
    },
};

export default function JSONValidatorPage() {
    return (
        <>
            <div className="h-[calc(100vh-48px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-validator" />
            </div>

        </>
    );
}
