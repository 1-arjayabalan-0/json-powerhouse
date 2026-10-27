import { Metadata } from "next";
import TextViewerClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
    description: "View JSON arrays as a readable table. Long text fields wrap automatically with optional Markdown preview. No horizontal scrolling.",
    keywords: ["json text viewer", "json table viewer", "json markdown viewer", "read json strings", "json long text"],
    alternates: { canonical: "/tools/json/text-viewer" },
    openGraph: {
        title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
        description: "View JSON arrays as a readable table with wrapped long text and Markdown preview.",
        url: "https://json-powerhouse.codarivu.com/tools/json/text-viewer",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Text Viewer Online – Read Long Strings in Tables | JSON PowerHouse",
        description: "View JSON arrays as a readable table with wrapped long text.",
    },
};

export default function TextViewerPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <TextViewerClient />
            <SeoAccordion
                toolName="JSON Text Viewer"
                description="Turn JSON arrays into a readable table. Long string fields wrap inside cells so you read top-to-bottom instead of scrolling sideways. Toggle Markdown preview for bold text, lists, and links."
                features={[
                    "One table row per JSON array item",
                    "Long text fields auto-detected and wrapped",
                    "Plain text table or formatted Markdown document view",
                    "Force fields into text or compact mode",
                    "No horizontal scrolling for long strings",
                ]}
                howToSteps={[
                    { title: "Paste your JSON", description: "Paste an array of objects (or a single object) into the input editor." },
                    { title: "Read the table", description: "Detected text columns wrap their content vertically. Click Show more on tall cells." },
                    { title: "Tune columns", description: "Click column chips to force text/compact mode, or toggle Markdown preview." },
                ]}
                faq={[
                    { question: "What JSON shapes work?", answer: "Arrays of objects (best), a single object, or an array of strings. Keys are collected as table columns." },
                    { question: "How are text columns detected?", answer: "Any string field whose longest value meets the character threshold (default 80). You can force or exclude fields via column chips." },
                ]}
                relatedTools={[
                    { name: "JSON Viewer", path: "/tools/json/viewer" },
                    { name: "JSON Formatter", path: "/tools/json/formatter" },
                    { name: "JSON Transform", path: "/tools/json/transform" },
                    { name: "JSON Diff", path: "/tools/json/diff" },
                ]}
            />
        </div>
    );
}
