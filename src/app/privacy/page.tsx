"use client"

import Footer from "../components/Footer";
import Header from "../components/Header";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Header />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-white/60">Last Updated: November 30, 2024</p>
                </div>

                {/* Update History */}
                <div className="mb-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined">history</span>
                        Update History
                    </h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-white/40 min-w-[140px]">November 30, 2024</span>
                            <span className="text-white/80">Initial privacy policy published</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8 text-white/80 leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                        <p className="mb-4">
                            Welcome to JSON PowerHouse. This Privacy Policy explains how we handle your data when you
                            use our web-based JSON manipulation tools.
                        </p>
                        <p className="mb-4">
                            <strong className="text-white">TL;DR:</strong> We don't collect, store, or transmit any of your data.
                            Everything happens locally in your browser.
                        </p>
                    </section>

                    {/* Data Processing */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Processing</h2>
                        <h3 className="text-xl font-semibold text-white mb-3">Client-Side Only</h3>
                        <p className="mb-4">
                            JSON PowerHouse is a 100% client-side application. This means:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>All JSON processing, formatting, validation, and conversion happens entirely within your web browser</li>
                            <li>Your data never leaves your device</li>
                            <li>We have no backend servers that receive, process, or store your JSON data</li>
                            <li>No network requests are made with your data</li>
                        </ul>
                    </section>

                    {/* Information We Don't Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Information We Don't Collect</h2>
                        <p className="mb-4">
                            Because all processing happens in your browser, we do not collect:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Your JSON data or any content you input into our tools</li>
                            <li>Personal information (name, email, address, etc.)</li>
                            <li>Usage patterns or analytics about which tools you use</li>
                            <li>IP addresses or device identifiers</li>
                            <li>Cookies for tracking purposes</li>
                        </ul>
                    </section>

                    {/* Local Storage */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Local Storage</h2>
                        <p className="mb-4">
                            JSON PowerHouse may use your browser's local storage to:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Save your preferences and settings (theme, default configurations, etc.)</li>
                            <li>Cache tool states for better user experience</li>
                        </ul>
                        <p className="mt-4">
                            This data is stored locally on your device and is never transmitted to our servers or any third parties.
                            You can clear this data at any time through your browser settings.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                        <p className="mb-4">
                            JSON PowerHouse does not integrate with any third-party analytics, advertising, or tracking services.
                        </p>
                        <p>
                            The application is hosted on a web server, which may collect standard server logs (IP addresses,
                            timestamps, requested URLs) for security and performance monitoring purposes. However, these logs
                            do not contain any of your JSON data or usage information.
                        </p>
                    </section>

                    {/* Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Security</h2>
                        <p className="mb-4">
                            Since all processing happens in your browser and no data is transmitted to servers:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Your data is as secure as your device and browser</li>
                            <li>We recommend using HTTPS connections (which we enforce)</li>
                            <li>For sensitive data, we recommend using the tool offline or in a private browsing session</li>
                        </ul>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                        <p>
                            JSON PowerHouse does not knowingly collect any information from anyone, including children under 13.
                            Since we don't collect any data at all, the service can be used by anyone without privacy concerns.
                        </p>
                    </section>

                    {/* Changes to Privacy Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h2>
                        <p className="mb-4">
                            We may update this Privacy Policy from time to time. When we do, we will:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Update the "Last Updated" date at the top of this page</li>
                            <li>Add an entry to the Update History section</li>
                            <li>Display a notification on the website (for significant changes)</li>
                        </ul>
                        <p className="mt-4">
                            We encourage you to review this Privacy Policy periodically.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this Privacy Policy, please contact us through our feedback form.
                        </p>
                        <a
                            href="/feedback"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Send Feedback
                        </a>
                    </section>
                </div>

            </div>
            <Footer />
        </div>
    );
}
