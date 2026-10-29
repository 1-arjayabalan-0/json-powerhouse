import Link from "next/link";
import AppHeader from "@/app/components/shell/AppHeader";
import Footer from "@/app/components/Footer";
import { ShieldCheck, Wrench, Zap } from "lucide-react";
import { getVisibleTools, toolGroups } from "@/app/config/tool-registry";
import { getAllPosts } from "@/app/lib/blog";

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <AppHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              JSON PowerHouse
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Your Complete JSON Toolkit
            </p>
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              Format, validate, convert, and transform JSON data instantly—all in your browser.
              No servers, no tracking, complete privacy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/tools/json/formatter"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-8 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why JSON PowerHouse?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Private</h3>
                <p className="text-muted-foreground">All processing happens in your browser. Your data never leaves your device.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Instant processing with no network delays or server wait times.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Toolkit</h3>
                <p className="text-muted-foreground">Dozens of tools for formatting, validation, conversion, and more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Quick Start Guide</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Choose Your Tool</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Browse our collection of JSON tools from the sidebar. Popular choices include
                      JSON Formatter, Validator, and Tree Viewer.
                    </p>
                    <Link href="/tools/json/formatter" className="text-primary hover:text-primary/80 text-sm">
                      Try JSON Formatter →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Paste Your JSON</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Simply paste your JSON data into the input area. You can also upload a file
                      or drag and drop.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Customize Settings</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Use the settings sidebar to adjust formatting options, indentation, quote styles,
                      and more to match your preferences.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Copy or Download</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      Get your results instantly. Copy to clipboard or download as a file.
                      All processing happens in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All tools */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight">All tools</h2>
            {toolGroups.map(group => (
              <div key={group.id} className="mt-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.name}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {getVisibleTools(group.id).map(t => {
                    const Icon = t.icon;
                    return (
                      <Link key={t.id} href={t.path} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50">
                        <Icon className="mt-0.5 size-4 text-primary" />
                        <span className="flex flex-col">
                          <span className="text-sm font-medium">{t.name}</span>
                          <span className="text-xs text-muted-foreground">{t.tagline}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest guides */}
        {posts.length > 0 && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Latest guides</h2>
                <Link href="/blog" className="text-sm text-primary hover:underline">All guides →</Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {posts.slice(0, 3).map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50">
                    <span className="text-xs text-muted-foreground">{p.readingMinutes} min read</span>
                    <span className="font-semibold leading-snug">{p.title}</span>
                    <span className="text-sm text-muted-foreground">{p.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tips by tool */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Tips by tool</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3"><Link href="/tools/json/formatter" className="hover:text-primary">How to Format JSON</Link></h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Learn how to use the JSON Formatter to beautify messy JSON data with proper indentation
                  and spacing. Customize quote styles, key sorting, and more.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Choose indentation (2 spaces, 4 spaces, or tabs)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Sort keys alphabetically</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Toggle trailing commas</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3"><Link href="/tools/json/json5" className="hover:text-primary">Working with JSON5</Link></h3>
                <p className="text-muted-foreground text-sm mb-4">
                  JSON5 is a more human-friendly JSON format. Learn how to convert between JSON and JSON5,
                  and take advantage of features like unquoted keys and trailing commas.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Use single quotes instead of double quotes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Add comments to your JSON</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Unquoted object keys</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3"><Link href="/tools/json/viewer" className="hover:text-primary">Using the Tree Viewer</Link></h3>
                <p className="text-muted-foreground text-sm mb-4">
                  The JSON Tree Viewer helps you visualize complex JSON structures. Navigate through nested
                  objects and arrays with ease, search for specific keys or values.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Expand/collapse nodes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Search within JSON data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Copy paths to specific values</span>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3"><Link href="/privacy" className="hover:text-primary">Privacy & Security Tips</Link></h3>
                <p className="text-muted-foreground text-sm mb-4">
                  JSON PowerHouse processes everything client-side, but here are some additional tips
                  for working with sensitive data.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Use private/incognito browsing for sensitive data</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Works offline once loaded</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-muted-foreground">Clear browser cache after use if needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Start using JSON PowerHouse today. No sign-up required, completely free.
            </p>
            <Link
              href="/tools/json/formatter"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Launch JSON Formatter
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
