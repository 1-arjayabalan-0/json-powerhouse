"use client";

import Header from "@/app/components/Header";
import { ConfigProvider } from "@/app/context/ConfigContext";

export default function ToolsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider>
      <div className="bg-background h-screen flex flex-col text-foreground">
        <Header />
        <main className="flex-1 min-h-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </ConfigProvider>
  );
}
