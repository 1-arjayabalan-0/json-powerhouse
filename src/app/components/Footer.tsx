"use client"

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto p-2">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Additional info */}
                    <div className="text-center text-muted-foreground text-xs">
                        <p>100% Client-Side Processing • Your Data Never Leaves Your Browser</p>
                    </div>

                    {/* Left side - Copyright */}
                    <div className="text-muted-foreground text-sm">
                        <p>© {currentYear} JSON PowerHouse. All rights reserved.</p>
                    </div>


                    {/* Right side - Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                        <Link
                            href="/about"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                        <Link
                            href="/feedback"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Feedback
                        </Link>
                    </div>
                </div>


            </div>
        </footer>
    );
}
