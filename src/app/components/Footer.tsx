"use client"

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-background-dark/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto p-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Additional info */}
                    <div className="text-center text-white/40 text-xs">
                        <p>100% Client-Side Processing • Your Data Never Leaves Your Browser</p>
                    </div>

                    {/* Left side - Copyright */}
                    <div className="text-white/60 text-sm">
                        <p>© {currentYear} JSON PowerHouse. All rights reserved.</p>
                    </div>


                    {/* Right side - Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <Link
                            href="/about"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/feedback"
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            Feedback
                        </Link>
                    </div>
                </div>


            </div>
        </footer>
    );
}
