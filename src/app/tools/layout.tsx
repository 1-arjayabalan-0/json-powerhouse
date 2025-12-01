"use client";

import Header from "@/app/components/Header";
import SideNav from "@/app/components/SideNav";
import SettingsSidenav from "@/app/components/SettingsSidenav";
import Footer from "@/app/components/Footer";
import { ConfigProvider, useConfig } from "@/app/context/ConfigContext";

function ToolsLayoutContent({ children }: { children: React.ReactNode }) {
    const { config, setConfig } = useConfig();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#EAEAEA]">
            <div className="relative flex h-screen w-full flex-col overflow-hidden">
                <Header />

                <div className="flex h-full min-h-0 grow">
                    {/* SideNavBar */}
                    <SideNav />

                    {/* Main Content */}
                    <main className="flex flex-1 flex-col overflow-hidden">
                        {children}
                    </main>

                    <SettingsSidenav config={config} onConfigChange={setConfig} />
                   
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConfigProvider>
            <ToolsLayoutContent>{children}</ToolsLayoutContent>
        </ConfigProvider>
    );
}
