import { Metadata } from "next";
import JSONTransformClient from "./client";

export const metadata: Metadata = {
    title: "JSON Transform – Rename, Flatten, Convert Keys",
    description: "Transform JSON visually: rename keys, remove fields, convert case, flatten/nest. No code needed.",
    alternates: {
        canonical: '/tools/json/transform',
    },
};

export default function JSONTransformPage() {
    return (
        <div className="h-[calc(100vh-48px)] w-full relative flex flex-col">
            <JSONTransformClient />
        </div>
    );
}
