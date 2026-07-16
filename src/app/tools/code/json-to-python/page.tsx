import { Metadata } from "next";
import PythonGeneratorClient from "./client";

export const metadata: Metadata = {
    title: "JSON to Python Converter Online – Free Tool | JSON PowerHouse",
    description: "Convert JSON to Python dictionaries and dataclasses instantly. Free online JSON to Python code generator.",
    keywords: ["json to python", "json to python dict", "python code generator", "json to python converter"],
    alternates: {
        canonical: "/tools/code/json-to-python",
    },
    openGraph: {
        title: "JSON to Python Converter Online – Free Tool | JSON PowerHouse",
        description: "Convert JSON to Python dictionaries and dataclasses instantly. Free online JSON to Python code generator.",
        url: "https://json-powerhouse.codarivu.com/tools/code/json-to-python",
        type: "website",
    },
};

export default function PythonGeneratorPage() {
    return (
        <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
            <PythonGeneratorClient />
        </div>
    );
}
