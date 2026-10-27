import Link from "next/link";
import { getToolById, ToolId } from "@/app/config/tool-registry";
import { toolContent } from "@/content/tools";
import JsonLd from "./JsonLd";

export interface GuideLink { slug: string; title: string; description: string }

const sections = [
    { id: "what-is", label: (n: string) => `What is ${n}?` },
    { id: "features", label: () => "Features" },
    { id: "how-to", label: () => "How to use" },
    { id: "examples", label: () => "Examples" },
    { id: "faq", label: () => "FAQ" },
    { id: "related", label: () => "Related tools" },
];

export default function ToolArticle({ toolId, guides = [] }: { toolId: ToolId; guides?: GuideLink[] }) {
    const tool = getToolById(toolId);
    const content = toolContent[toolId];
    if (!tool || !content) return null;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:py-16">
            <JsonLd data={faqSchema} />
            <article className="prose-jph min-w-0 flex-1">
                <h2 id="what-is">What is {tool.name}?</h2>
                {content.intro.map((p, i) => <p key={i}>{p}</p>)}

                <h2 id="features">Features</h2>
                <ul>{content.features.map(f => <li key={f}>{f}</li>)}</ul>

                <h2 id="how-to">How to use {tool.name}</h2>
                <ol>
                    {content.howTo.map(s => (
                        <li key={s.title}><strong>{s.title}.</strong> {s.description}</li>
                    ))}
                </ol>

                <h2 id="examples">Examples</h2>
                {content.examples.map(ex => (
                    <div key={ex.title}>
                        <h3>{ex.title}</h3>
                        {ex.description && <p>{ex.description}</p>}
                        <p><strong>Input</strong></p>
                        <pre><code>{ex.input}</code></pre>
                        <p><strong>Output</strong></p>
                        <pre><code>{ex.output}</code></pre>
                    </div>
                ))}

                <h2 id="faq">Frequently asked questions</h2>
                {content.faq.map(f => (
                    <div key={f.question}>
                        <h3>{f.question}</h3>
                        <p>{f.answer}</p>
                    </div>
                ))}

                <h2 id="related">Related tools</h2>
                <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {content.related.map(id => {
                        const r = getToolById(id);
                        if (!r) return null;
                        const Icon = r.icon;
                        return (
                            <Link key={id} href={r.path} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 no-underline hover:border-primary/50 transition-colors">
                                <Icon className="mt-0.5 size-4 text-primary" />
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{r.name}</span>
                                    <span className="text-xs text-muted-foreground">{r.tagline}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {guides.length > 0 && (
                    <>
                        <h2 id="guides">Guides</h2>
                        <ul>
                            {guides.map(g => (
                                <li key={g.slug}><Link href={`/blog/${g.slug}`}>{g.title}</Link> — {g.description}</li>
                            ))}
                        </ul>
                    </>
                )}
            </article>

            <aside className="sticky top-20 hidden h-fit w-52 shrink-0 xl:block" aria-label="On this page">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
                <ul className="flex flex-col gap-2 text-sm">
                    {sections.map(s => (
                        <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">{s.label(tool.name)}</a></li>
                    ))}
                    {guides.length > 0 && <li><a href="#guides" className="text-muted-foreground hover:text-foreground">Guides</a></li>}
                </ul>
            </aside>
        </div>
    );
}
