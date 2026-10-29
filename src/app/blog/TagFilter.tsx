"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PostMeta } from "@/app/lib/blog";

export default function TagFilter({ tags, posts }: { tags: string[]; posts: PostMeta[] }) {
    const active = useSearchParams().get("tag");
    const shown = active ? posts.filter(p => p.tags.includes(active)) : posts;

    return (
        <>
            <div className="mb-8 flex flex-wrap gap-2">
                <Link href="/blog" className={`rounded-full border px-3 py-1 text-xs ${!active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>All</Link>
                {tags.map(t => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={`rounded-full border px-3 py-1 text-xs ${active === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>{t}</Link>
                ))}
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
                {shown.map(p => (
                    <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`} className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors">
                            <time dateTime={p.date} className="text-xs text-muted-foreground">
                                {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })} · {p.readingMinutes} min read
                            </time>
                            <h2 className="text-lg font-semibold leading-snug text-foreground">{p.title}</h2>
                            <p className="text-sm text-muted-foreground">{p.description}</p>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                                {p.tags.map(t => <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {shown.length === 0 && <p className="text-sm text-muted-foreground">No posts with this tag yet.</p>}
        </>
    );
}
