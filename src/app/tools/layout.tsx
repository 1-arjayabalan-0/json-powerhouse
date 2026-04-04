"use client";

import Header from "@/app/components/Header";
import { ConfigProvider } from "@/app/context/ConfigContext";

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider>
            <div className="bg-background h-screen overflow-hidden flex flex-col text-foreground">
                <Header />
                {children}
            </div>
        </ConfigProvider>
    );
}
