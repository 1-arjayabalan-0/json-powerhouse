import { Metadata } from "next";
import AboutClient from "./client";

export const metadata: Metadata = {
    title: "About JSON PowerHouse – Client-Side JSON Tools",
    description: "Learn about JSON PowerHouse, a comprehensive client-side JSON toolkit for developers. Format, validate, convert, and transform JSON data privately in your browser.",
    keywords: ["about json powerhouse", "json tools", "client-side json", "json formatter about"],
    alternates: {
        canonical: "/about",
    },
    openGraph: {
        title: "About JSON PowerHouse – Client-Side JSON Tools",
        description: "Learn about JSON PowerHouse, a comprehensive client-side JSON toolkit for developers.",
        url: "https://json-powerhouse.codarivu.com/about",
        type: "website",
    },
};

export default function AboutPage() {
    return <AboutClient />;
}
