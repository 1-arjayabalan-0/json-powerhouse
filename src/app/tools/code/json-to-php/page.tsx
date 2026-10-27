import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
import { Metadata } from "next";
import PHPGeneratorClient from "./client";
import SeoAccordion from "@/app/components/SeoAccordion";

export const metadata: Metadata = {
    title: "JSON to PHP Converter – Free Online Tool | JSON PowerHouse",
    description: "Convert JSON to PHP arrays and classes instantly. Free online code generator with type hints.",
    keywords: ["json to php", "json to php array", "php code generator", "json to php converter", "php model generator"],
    alternates: { canonical: "/tools/code/json-to-php" },
    openGraph: {
        title: "JSON to PHP Converter | JSON PowerHouse",
        description: "Convert JSON to PHP arrays and classes instantly.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-php",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON to PHP Converter | JSON PowerHouse",
        description: "Convert JSON to PHP arrays and classes.",
    },
};

export default function PHPGeneratorPage() {
    return (
        <>
            <ToolWorkspace toolId="json-to-php">
                <PHPGeneratorClient />
            </ToolWorkspace>
                <SeoAccordion
                    toolName="JSON to PHP"
                    description="Generate PHP arrays and classes from JSON data with type hints and docblock annotations."
                    features={[
                        "Generate PHP arrays and classes from JSON",
                        "PHP 8 type hints and nullable types",
                        "Docblock annotations for IDE support",
                        "Nested class and array generation",
                        "Laravel and Symfony compatible",
                        "Copy generated code to clipboard",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter a sample JSON object." },
                        { title: "Select format", description: "Choose between PHP arrays, stdClass, or typed classes." },
                        { title: "Copy PHP code", description: "Get production-ready PHP code with proper typing." },
                    ]}
                    faq={[
                        { question: "What PHP features are generated?", answer: "Type hints (string, int, float, bool, array), nullable types (?string), and docblock annotations." },
                        { question: "Does it work with Laravel?", answer: "Yes. Works with Eloquent models, API Resources, and any Laravel project." },
                    ]}
                    relatedTools={[
                        { name: "JSON to Python", path: "/tools/code/json-to-python" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON to Java", path: "/tools/code/json-to-java" },
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                    ]}
                />
        </>
    );
}
