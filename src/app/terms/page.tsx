import { Metadata } from "next";
import TermsClient from "./client";

export const metadata: Metadata = {
    title: "Terms and Conditions – JSON PowerHouse",
    description: "JSON PowerHouse terms and conditions. Read our usage terms for our free client-side JSON tools.",
    keywords: ["terms and conditions", "json powerhouse terms", "usage terms", "legal"],
    alternates: {
        canonical: "/terms",
    },
    openGraph: {
        title: "Terms and Conditions – JSON PowerHouse",
        description: "JSON PowerHouse terms and conditions. Read our usage terms for our free client-side JSON tools.",
        url: "https://json-powerhouse.codarivu.com/terms",
        type: "website",
    },
};

export default function TermsPage() {
    return <TermsClient />;
}
