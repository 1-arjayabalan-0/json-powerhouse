import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 – Page Not Found | JSON PowerHouse",
    description: "The page you're looking for doesn't exist. Try our JSON tools instead.",
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/tools/json/formatter"
                        className="px-6 py-3 bg-card text-foreground rounded-lg font-medium border border-border hover:bg-accent transition-colors"
                    >
                        JSON Formatter
                    </Link>
                </div>
            </div>
        </div>
    );
}
