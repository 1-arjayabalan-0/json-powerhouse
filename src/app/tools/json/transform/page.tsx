import JSONToolPage from "@/app/components/JSONToolPage";
import SeoAccordion from "@/app/components/SeoAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
    description: "Transform JSON visually: rename keys, remove fields, convert case, flatten/nest structures. Free online tool.",
    keywords: ["json transform", "rename json keys", "flatten json", "json key converter", "json mapper"],
    alternates: { canonical: '/tools/json/transform' },
    openGraph: {
        title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
        description: "Transform JSON visually: rename keys, remove fields, convert case, flatten/nest structures.",
        url: "https://json-powerhouse.codarivu.com/tools/json/transform",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "JSON Transform – Rename, Flatten, Convert Keys | JSON PowerHouse",
        description: "Transform JSON visually.",
    },
};

export default function JSONTransformPage() {
    return (
        <>
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-transform" />
                <SeoAccordion
                    toolName="JSON Transform"
                    description="Visually transform your JSON data without writing code. Rename keys, remove fields, convert between camelCase and snake_case, flatten or nest structures."
                    features={[
                        "Rename JSON keys with visual mapping",
                        "Remove fields you don't need",
                        "Convert between camelCase, snake_case, PascalCase, kebab-case",
                        "Flatten deeply nested JSON structures",
                        "Nest flat JSON into hierarchical objects",
                        "Preview transformations before applying",
                    ]}
                    howToSteps={[
                        { title: "Paste your JSON", description: "Enter your JSON data into the input editor." },
                        { title: "Choose transformation", description: "Select from rename, remove, convert case, flatten, or nest operations." },
                        { title: "Apply and export", description: "Preview the result and copy or download your transformed JSON." },
                    ]}
                    faq={[
                        { question: "What can I do with JSON Transform?", answer: "Rename keys, remove fields, convert naming conventions (camelCase, snake_case), flatten nested structures, and nest flat JSON." },
                        { question: "Does it preserve my original data?", answer: "Yes. Transformation creates new output without modifying your original input." },
                    ]}
                    relatedTools={[
                        { name: "JSON Formatter", path: "/tools/json/formatter" },
                        { name: "JSON Normalize", path: "/tools/json/normalize" },
                        { name: "JSON to TypeScript", path: "/tools/code/json-to-typescript" },
                        { name: "JSON Diff", path: "/tools/json/diff" },
                    ]}
                />
            </div>
        </>
    );
}
