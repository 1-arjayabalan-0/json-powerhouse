"use client";

import { ConfigProvider } from "@/app/context/ConfigContext";
import { ShellProvider } from "@/app/components/shell/ShellContext";
import AppHeader from "@/app/components/shell/AppHeader";
import ToolSidebar from "@/app/components/shell/ToolSidebar";
import Footer from "@/app/components/Footer";

export default function ToolsLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider>
            <ShellProvider>
                <div className="min-h-dvh bg-background text-foreground">
                    <AppHeader showMenuButton />
                    <div className="flex">
                        <ToolSidebar />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <main className="min-w-0 flex-1">{children}</main>
                            <Footer />
                        </div>
                    </div>
                </div>
            </ShellProvider>
        </ConfigProvider>
    );
}
