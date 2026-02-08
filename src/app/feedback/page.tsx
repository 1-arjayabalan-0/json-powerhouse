"use client"

import { useState } from "react";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <div className="flex-1">
                <div className="max-w-2xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">Feedback</h1>
                        <p className="text-muted-foreground">
                            We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
                        </p>
                    </div>

                    {submitted ? (
                        <div className="bg-success/10 border border-success/20 rounded-lg p-8 text-center">
                            <span className="material-symbols-outlined text-5xl text-success mb-4">check_circle</span>
                            <h2 className="text-2xl font-bold mb-2 text-success">Feedback Received!</h2>
                            <p className="text-muted-foreground mb-6">
                                Thank you for helping us improve. We read every piece of feedback.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-6 py-2 bg-card text-foreground rounded-lg hover:bg-accent transition-colors border border-border"
                            >
                                Submit Another Response
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-muted-foreground mb-2">
                                        Feedback Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="feature">Feature Request</option>
                                        <option value="bug">Bug Report</option>
                                        <option value="improvement">Improvement</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="For follow-up questions"
                                        className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    placeholder="Describe your idea, issue, or feedback..."
                                    className="w-full px-4 py-3 rounded-lg bg-input text-foreground border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                ></textarea>
                            </div>

                            <div className="bg-muted border border-border rounded-lg p-4">
                                <div className="flex gap-3">
                                    <span className="material-symbols-outlined text-primary text-xl">info</span>
                                    <p className="text-sm text-muted-foreground">
                                        We respect your privacy. If you provide an email, we'll only use it to reply to your
                                        feedback. We never share your data with third parties.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}

                    {/* Additional Info */}
                    <div className="mt-12 pt-8 border-t border-border">
                        <h2 className="text-xl font-bold mb-4">Other Ways to Reach Us</h2>
                        <div className="space-y-3 text-muted-foreground">
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">mail</span>
                                <span>Email: feedback@jsonpowerhouse.com</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">bug_report</span>
                                <span>Found a bug? Please include steps to reproduce it.</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">lightbulb</span>
                                <span>Have an idea? We're always looking for ways to improve!</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
