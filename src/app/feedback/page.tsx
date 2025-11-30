"use client"

import { useState } from "react";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background-dark text-white">
            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">Feedback</h1>
                    <p className="text-white/60">
                        We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
                    </p>
                </div>

                {submitted ? (
                    /* Success Message */
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 text-center">
                        <span className="material-symbols-outlined text-5xl text-green-500 mb-4">check_circle</span>
                        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                        <p className="text-white/70 mb-6">
                            Your feedback has been received. We appreciate you taking the time to help us improve JSON PowerHouse.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Submit Another Response
                        </button>
                    </div>
                ) : (
                    /* Feedback Form */
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Feedback Type */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Feedback Type
                            </label>
                            <select
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select a type...</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="improvement">Improvement Suggestion</option>
                                <option value="question">Question</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Brief description of your feedback"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-white/40"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Message
                            </label>
                            <textarea
                                required
                                rows={8}
                                placeholder="Please provide as much detail as possible..."
                                className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-white/40 resize-none"
                            />
                        </div>

                        {/* Email (Optional) */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-white/40"
                            />
                            <p className="text-white/40 text-xs mt-2">
                                Provide your email if you'd like us to follow up with you.
                            </p>
                        </div>

                        {/* Privacy Notice */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
                                <div className="text-sm text-white/70">
                                    <p className="font-medium text-white mb-1">Privacy Note</p>
                                    <p>
                                        This is a demo feedback form. In a production environment, your feedback would be
                                        securely transmitted. We respect your privacy and will only use your email to respond
                                        to your feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Submit Feedback
                        </button>
                    </form>
                )}

                {/* Additional Info */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <h2 className="text-xl font-bold mb-4">Other Ways to Reach Us</h2>
                    <div className="space-y-3 text-white/70">
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">mail</span>
                            <span>Email: feedback@jsonpowerhouse.com</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">bug_report</span>
                            <span>Found a bug? Please include steps to reproduce it.</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">lightbulb</span>
                            <span>Have an idea? We're always looking for ways to improve!</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
