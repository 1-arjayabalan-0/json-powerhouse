"use client"

import Footer from "../components/Footer";
import Header from "../components/Header"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background-dark text-white">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
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
                            <span className="text-white/80">Initial terms and conditions published</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8 text-white/80 leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to JSON PowerHouse ("we," "our," or "the Service"). By accessing or using our website
                            and tools, you agree to be bound by these Terms and Conditions. If you do not agree with any
                            part of these terms, please do not use our Service.
                        </p>
                    </section>

                    {/* Service Description */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
                        <p className="mb-4">
                            JSON PowerHouse provides a suite of web-based tools for JSON data manipulation, including but
                            not limited to:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>JSON formatting and beautification</li>
                            <li>JSON validation</li>
                            <li>JSON to various format conversions</li>
                            <li>JSON tree visualization</li>
                            <li>Other JSON-related utilities</li>
                        </ul>
                        <p className="mt-4">
                            All processing is performed client-side in your web browser. We do not store, transmit, or
                            have access to any data you input into our tools.
                        </p>
                    </section>

                    {/* Use of Service */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Use of Service</h2>
                        <h3 className="text-xl font-semibold text-white mb-3">3.1 Acceptable Use</h3>
                        <p className="mb-4">You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                        <ul className="space-y-2 ml-6 list-disc mb-4">
                            <li>Use the Service in any way that violates any applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to any part of the Service</li>
                            <li>Interfere with or disrupt the Service or servers</li>
                            <li>Use automated systems or software to extract data from the Service for commercial purposes</li>
                            <li>Attempt to reverse engineer or decompile any part of the Service</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white mb-3">3.2 No Account Required</h3>
                        <p>
                            The Service does not require user registration or accounts. All tools are available for immediate use.
                        </p>
                    </section>

                    {/* Intellectual Property */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                        <p className="mb-4">
                            The Service, including its original content, features, and functionality, is owned by JSON PowerHouse
                            and is protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p>
                            You retain all rights to any data you input into our tools. We claim no ownership or rights to your data.
                        </p>
                    </section>

                    {/* Disclaimer of Warranties */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
                        <p className="mb-4">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                            OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Warranties of merchantability or fitness for a particular purpose</li>
                            <li>Warranties that the Service will be uninterrupted, error-free, or secure</li>
                            <li>Warranties regarding the accuracy or reliability of any results obtained through the Service</li>
                        </ul>
                        <p className="mt-4">
                            While we strive to provide accurate and reliable tools, we do not guarantee that the Service will
                            meet your specific requirements or that any errors will be corrected.
                        </p>
                    </section>

                    {/* Limitation of Liability */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                        <p className="mb-4">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, JSON POWERHOUSE SHALL NOT BE LIABLE FOR ANY INDIRECT,
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES,
                            WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE
                            LOSSES RESULTING FROM:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Your use or inability to use the Service</li>
                            <li>Any unauthorized access to or use of our servers</li>
                            <li>Any bugs, viruses, or other harmful code that may be transmitted through the Service</li>
                            <li>Any errors or omissions in any content or for any loss or damage incurred as a result of your use of any content</li>
                        </ul>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Data Security and Privacy</h2>
                        <p className="mb-4">
                            Since all processing occurs client-side in your browser:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>We do not have access to any data you input into our tools</li>
                            <li>Your data is not transmitted to our servers or any third parties</li>
                            <li>You are responsible for the security of your own device and browser</li>
                            <li>We recommend not using the Service for highly sensitive data without appropriate security measures on your end</li>
                        </ul>
                    </section>

                    {/* Third-Party Links */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links</h2>
                        <p>
                            The Service may contain links to third-party websites or services that are not owned or controlled
                            by JSON PowerHouse. We have no control over and assume no responsibility for the content, privacy
                            policies, or practices of any third-party websites or services.
                        </p>
                    </section>

                    {/* Changes to Terms */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
                        <p className="mb-4">
                            We reserve the right to modify or replace these Terms at any time. When we make changes:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>The "Last Updated" date will be revised</li>
                            <li>An entry will be added to the Update History section</li>
                            <li>For material changes, we may display a notification on the website</li>
                        </ul>
                        <p className="mt-4">
                            Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    {/* Termination */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
                        <p>
                            We may terminate or suspend access to our Service immediately, without prior notice or liability,
                            for any reason whatsoever, including without limitation if you breach the Terms. Upon termination,
                            your right to use the Service will immediately cease.
                        </p>
                    </section>

                    {/* Governing Law */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
                        <p>
                            These Terms shall be governed and construed in accordance with applicable laws, without regard
                            to its conflict of law provisions.
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us through our feedback form.
                        </p>
                        <a
                            href="/feedback"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Send Feedback
                        </a>
                    </section>

                    {/* Acknowledgment */}
                    <section className="border-t border-white/10 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Acknowledgment</h2>
                        <p>
                            BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS AND AGREE
                            TO BE BOUND BY THEM.
                        </p>
                    </section>
                </div>

            </div>
            <Footer />
        </div>
    );
}
