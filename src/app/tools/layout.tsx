"use client";

import Header from "@/app/components/Header";
import SettingsSidenav from "@/app/components/SettingsSidenav";
import Footer from "@/app/components/Footer";
import { ConfigProvider, useConfig } from "@/app/context/ConfigContext";
import { ValidationProvider, useValidation } from "@/app/context/ValidationContext";

function ToolsLayoutContent({ children }: { children: React.ReactNode }) {
    const { config, setConfig } = useConfig();
    const { errors, warnings, onErrorClick } = useValidation();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#EAEAEA]">
            <div className="relative flex h-screen w-full flex-col overflow-hidden">
                <Header />

                <div className="flex h-full min-h-0 grow">
                    {/* Main Content */}
                    <main className="flex flex-1 flex-col overflow-hidden">
                        {children}
                    </main>

                    <SettingsSidenav 
                        config={config} 
                        onConfigChange={setConfig}
                        errors={errors}
                        warnings={warnings}
                        onErrorClick={onErrorClick}
                    />
                   
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
            <ValidationProvider>
                <ToolsLayoutContent>{children}</ToolsLayoutContent>
            </ValidationProvider>
        </ConfigProvider>
    );
}
