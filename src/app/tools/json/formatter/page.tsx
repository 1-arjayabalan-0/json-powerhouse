import JSONToolPage from "@/app/components/JSONToolPage";
import JsonLd from "@/app/components/JsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter Online – Free Tool",
    description: "Format and beautify JSON with proper indentation. Best online JSON Formatter.",
    alternates: {
        canonical: '/tools/json/formatter',
    },
};

export default function JSONFormatterPage() {
    return (
        <>
            <JsonLd
                data={{
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    name: "JSON Formatter",
                    operatingSystem: "Web",
                    applicationCategory: "DeveloperApplication",
                    url: "https://json-powerhouse.codarivu.com/tools/json/formatter",
                    description: "Format and beautify JSON with proper indentation. Best online JSON Formatter.",
                    offers: {
                        "@type": "Offer",
                        price: "0",
                        priceCurrency: "USD",
                    },
                }}
            />
            <div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">
                <JSONToolPage toolId="json-formatter" />
            </div>
        </>
    );
}
