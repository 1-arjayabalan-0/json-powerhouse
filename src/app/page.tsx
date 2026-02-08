"use client";

import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1">
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
                  <span className="material-symbols-outlined text-3xl text-primary">security</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Private</h3>
                <p className="text-muted-foreground">All processing happens in your browser. Your data never leaves your device.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">bolt</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Instant processing with no network delays or server wait times.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-primary">build</span>
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

        {/* Popular Tools */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Tools</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/tools/json/formatter"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">format_align_left</span>
                <h3 className="text-lg font-semibold mb-2">JSON Formatter</h3>
                <p className="text-muted-foreground text-sm">Format and beautify your JSON with customizable indentation and styling.</p>
              </Link>

              <Link
                href="/tools/json/validator"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">task_alt</span>
                <h3 className="text-lg font-semibold mb-2">JSON Validator</h3>
                <p className="text-muted-foreground text-sm">Validate your JSON syntax and get detailed error messages.</p>
              </Link>

              <Link
                href="/tools/json/viewer"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">account_tree</span>
                <h3 className="text-lg font-semibold mb-2">JSON Tree Viewer</h3>
                <p className="text-muted-foreground text-sm">Visualize JSON structure with an interactive tree view.</p>
              </Link>

              <Link
                href="/tools/json/minifier"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">compress</span>
                <h3 className="text-lg font-semibold mb-2">JSON Minifier</h3>
                <p className="text-muted-foreground text-sm">Compress JSON by removing whitespace and reducing file size.</p>
              </Link>

              <Link
                href="/tools/json/json5"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">swap_horiz</span>
                <h3 className="text-lg font-semibold mb-2">JSON ↔ JSON5</h3>
                <p className="text-muted-foreground text-sm">Convert between standard JSON and JSON5 format.</p>
              </Link>

              <Link
                href="/tools/json-to-typescript"
                className="bg-card rounded-lg p-6 border border-border hover:bg-muted transition-colors"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-3">code</span>
                <h3 className="text-lg font-semibold mb-2">JSON to TypeScript</h3>
                <p className="text-muted-foreground text-sm">Generate TypeScript interfaces from JSON data.</p>
              </Link>
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">And many more tools available...</p>
              <Link
                href="/tools/json-formatter"
                className="text-primary hover:text-primary/80"
              >
                Browse All Tools →
              </Link>
            </div>
          </div>
        </section>

        {/* Tutorials */}
        <section className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Tutorials & Guides</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3">How to Format JSON</h3>
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
                <h3 className="text-xl font-semibold mb-3">Working with JSON5</h3>
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
                <h3 className="text-xl font-semibold mb-3">Using the Tree Viewer</h3>
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
                <h3 className="text-xl font-semibold mb-3">Privacy & Security Tips</h3>
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
      </div>
      <Footer />
    </div>
  );
}
