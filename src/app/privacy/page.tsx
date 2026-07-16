import { Metadata } from "next";
import PrivacyClient from "./client";

export const metadata: Metadata = {
    title: "Privacy Policy – JSON PowerHouse",
    description: "JSON PowerHouse privacy policy. We don't collect, store, or transmit your data. Everything happens locally in your browser.",
    keywords: ["privacy policy", "json powerhouse privacy", "data privacy", "no data collection"],
    alternates: {
        canonical: "/privacy",
    },
    openGraph: {
        title: "Privacy Policy – JSON PowerHouse",
        description: "JSON PowerHouse privacy policy. We don't collect, store, or transmit your data.",
        url: "https://json-powerhouse.codarivu.com/privacy",
        type: "website",
    },
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}
