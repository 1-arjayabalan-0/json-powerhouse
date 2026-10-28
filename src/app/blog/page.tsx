import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/app/lib/blog";
import TagFilter from "./TagFilter";

export const metadata: Metadata = {
    title: "JSON Guides & Tutorials | JSON PowerHouse Blog",
    description: "Practical guides on fixing invalid JSON, generating types from JSON, JSON5, diffing and more.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "JSON Guides & Tutorials | JSON PowerHouse Blog",
        description: "Practical guides on fixing invalid JSON, generating types from JSON, JSON5, diffing and more.",
        url: "https://json-powerhouse.codarivu.com/blog",
        type: "website",
    },
};

export default function BlogIndexPage() {
    const posts = getAllPosts();
    const tags = getAllTags();
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Guides & tutorials</h1>
                <p className="mt-2 text-muted-foreground">Practical, no-fluff guides for working with JSON.</p>
            </header>
            <Suspense fallback={null}>
                <TagFilter tags={tags} posts={posts} />
            </Suspense>
        </div>
    );
}
