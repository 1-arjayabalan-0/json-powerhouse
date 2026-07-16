import { Metadata } from "next";
import PHPGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to PHP Converter Online – Free Tool | JSON PowerHouse",
    description: "Convert JSON to PHP arrays and classes instantly. Free online JSON to PHP code generator.",
    keywords: ["json to php", "json to php array", "php code generator", "json to php converter"],
    alternates: {
        canonical: "/tools/code/json-to-php",
    },
    openGraph: {
        title: "JSON to PHP Converter Online – Free Tool | JSON PowerHouse",
        description: "Convert JSON to PHP arrays and classes instantly. Free online JSON to PHP code generator.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-php",
        type: "website",
    },
};

export default function PHPGeneratorPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <PHPGeneratorClient />
        </div>
    );
}
