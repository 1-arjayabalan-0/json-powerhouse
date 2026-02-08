"use client"

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <div className="flex-1">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4">About JSON PowerHouse</h1>
                        <p className="text-muted-foreground text-lg">Your complete JSON toolkit, powered entirely by your browser</p>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* What is JSON PowerHouse */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">What is JSON PowerHouse?</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                JSON PowerHouse is a comprehensive, client-side JSON manipulation toolkit designed for developers,
                                data analysts, and anyone working with JSON data. Our suite of tools allows you to format, validate,
                                convert, and transform JSON data instantly—all within your browser.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Unlike traditional online tools, JSON PowerHouse processes everything locally on your device.
                                This means your data never leaves your browser, ensuring complete privacy and security.
                            </p>
                        </section>

                        {/* Key Features */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-card rounded-lg p-4 border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">security</span>
                                        <h3 className="font-semibold">100% Client-Side Processing</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">All operations happen in your browser. No data is sent to any server.</p>
                                </div>
                                <div className="bg-card rounded-lg p-4 border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">bolt</span>
                                        <h3 className="font-semibold">Lightning Fast</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Instant processing with no network latency or server delays.</p>
                                </div>
                                <div className="bg-card rounded-lg p-4 border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">build</span>
                                        <h3 className="font-semibold">Comprehensive Toolset</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Format, validate, convert, and transform JSON with ease.</p>
                                </div>
                                <div className="bg-card rounded-lg p-4 border border-border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-primary">devices</span>
                                        <h3 className="font-semibold">Works Offline</h3>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Once loaded, use all tools without an internet connection.</p>
                                </div>
                            </div>
                        </section>

                        {/* Privacy First */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Privacy First Approach</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                We believe your data is yours and yours alone. JSON PowerHouse is built with privacy as the
                                foundation:
                            </p>
                            <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-success text-xl mt-0.5">check_circle</span>
                                    <span>No backend servers - all processing happens in your browser</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-success text-xl mt-0.5">check_circle</span>
                                    <span>No data collection or tracking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-success text-xl mt-0.5">check_circle</span>
                                    <span>No user accounts or authentication required</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-success text-xl mt-0.5">check_circle</span>
                                    <span>Open source and transparent</span>
                                </li>
                            </ul>
                        </section>

                        {/* Available Tools */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Available Tools</h2>
                            <div className="bg-card rounded-lg p-6 border border-border">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold mb-2 text-primary">JSON Tools</h3>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• JSON Formatter</li>
                                            <li>• JSON Minifier</li>
                                            <li>• JSON Validator</li>
                                            <li>• JSON Tree Viewer</li>
                                            <li>• JSON ↔ JSON5 Converter</li>
                                            <li>• JSON Beautifier</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2 text-primary">Converters</h3>
                                        <ul className="space-y-1 text-muted-foreground text-sm">
                                            <li>• JSON to TypeScript</li>
                                            <li>• JSON to YAML</li>
                                            <li>• JSON to XML</li>
                                            <li>• JSON to CSV</li>
                                            <li>• And many more...</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technology */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Built With Modern Technology</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                JSON PowerHouse is built using cutting-edge web technologies to ensure the best performance
                                and user experience:
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium border border-border">Next.js</span>
                                <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium border border-border">React</span>
                                <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium border border-border">TypeScript</span>
                                <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium border border-border">Tailwind CSS</span>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="border-t border-border pt-8">
                            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Have questions, suggestions, or found a bug? We'd love to hear from you!
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="/feedback"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Send Feedback
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
                        <p>JSON PowerHouse © 2024 | Made with ❤️ for developers</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
