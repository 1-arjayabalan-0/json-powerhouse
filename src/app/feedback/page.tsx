import { Metadata } from "next";
import FeedbackClient from "./client";

export const metadata: Metadata = {
    title: "Feedback – JSON PowerHouse",
    description: "Share your thoughts, report bugs, or suggest new features for JSON PowerHouse. We read every piece of feedback.",
    keywords: ["feedback", "json powerhouse feedback", "report bug", "feature request"],
    alternates: {
        canonical: "/feedback",
    },
    openGraph: {
        title: "Feedback – JSON PowerHouse",
        description: "Share your thoughts, report bugs, or suggest new features for JSON PowerHouse.",
        url: "https://json-powerhouse.codarivu.com/feedback",
        type: "website",
    },
};

export default function FeedbackPage() {
    return <FeedbackClient />;
}
