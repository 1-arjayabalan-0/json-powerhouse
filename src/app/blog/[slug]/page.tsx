import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPost } from "@/app/lib/blog";
import { mdxComponents } from "@/app/components/mdx";
import ToolLink from "@/app/components/mdx/ToolLink";
import JsonLd from "@/app/components/JsonLd";

const BASE_URL = "https://json-powerhouse.codarivu.com";

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) return {};
    return {
        title: `${post.title} | JSON PowerHouse`,
        description: post.description,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.description,
            url: `${BASE_URL}/blog/${post.slug}`,
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.updated ?? post.date,
            tags: post.tags,
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.description },
    };
}

function headingsOf(mdx: string): { id: string; text: string; depth: 2 | 3 }[] {
    const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const out: { id: string; text: string; depth: 2 | 3 }[] = [];
    let inFence = false;
    for (const line of mdx.split("\n")) {
        if (line.trim().startsWith("```")) inFence = !inFence;
        if (inFence) continue;
        const m = /^(##|###)\s+(.+)$/.exec(line);
        if (m) out.push({ depth: m[1].length as 2 | 3, text: m[2].replace(/`/g, ""), id: slugify(m[2].replace(/`/g, "")) });
    }
    return out;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();

    const all = getAllPosts();
    const idx = all.findIndex(p => p.slug === post.slug);
    const newer = idx > 0 ? all[idx - 1] : null;
    const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    const toc = headingsOf(post.content);

    return (
        <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:py-16">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                dateModified: post.updated ?? post.date,
                url: `${BASE_URL}/blog/${post.slug}`,
                author: { "@type": "Organization", name: "JSON PowerHouse" },
                publisher: { "@type": "Organization", name: "JSON PowerHouse" },
                keywords: post.tags.join(", "),
            }} />
            <article className="min-w-0 flex-1">
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← All guides</Link>
                <header className="mb-8 mt-4">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
                    <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
                        {post.updated && <> · Updated <time dateTime={post.updated}>{post.updated}</time></>}
                        {" · "}{post.readingMinutes} min read
                    </p>
                </header>
                <div className="prose-jph">
                    <MDXRemote
                        source={post.content}
                        components={mdxComponents}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [
                                    rehypeSlug,
                                    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
                                    [rehypePrettyCode, { theme: { dark: "github-dark-dimmed", light: "github-light" }, keepBackground: true }],
                                ],
                            },
                        }}
                    />
                </div>
                {post.relatedTools.length > 0 && (
                    <section className="mt-12 border-t border-border pt-8">
                        <h2 className="text-lg font-semibold">Try it yourself</h2>
                        {post.relatedTools.map(id => <ToolLink key={id} id={id} />)}
                    </section>
                )}
                <nav className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="More posts">
                    {older ? <Link href={`/blog/${older.slug}`} className="rounded-lg border border-border p-4 hover:border-primary/50"><span className="text-xs text-muted-foreground">Previous</span><p className="text-sm font-medium">{older.title}</p></Link> : <span />}
                    {newer && <Link href={`/blog/${newer.slug}`} className="rounded-lg border border-border p-4 text-right hover:border-primary/50"><span className="text-xs text-muted-foreground">Next</span><p className="text-sm font-medium">{newer.title}</p></Link>}
                </nav>
            </article>
            {toc.length > 0 && (
                <aside className="sticky top-20 hidden h-fit w-56 shrink-0 xl:block" aria-label="On this page">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
                    <ul className="flex flex-col gap-2 text-sm">
                        {toc.map(h => (
                            <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
                                <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">{h.text}</a>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
    );
}
