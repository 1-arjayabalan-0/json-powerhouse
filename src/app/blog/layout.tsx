import AppHeader from "@/app/components/shell/AppHeader";
import Footer from "@/app/components/Footer";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <AppHeader />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
