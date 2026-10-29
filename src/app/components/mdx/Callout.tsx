import { ReactNode } from "react";
import { Info, TriangleAlert, Lightbulb } from "lucide-react";

const styles = {
    info: { icon: Info, cls: "border-primary/30 bg-primary/5" },
    warn: { icon: TriangleAlert, cls: "border-warning/30 bg-warning/5" },
    tip: { icon: Lightbulb, cls: "border-success/30 bg-success/5" },
};

export default function Callout({ type = "info", children }: { type?: keyof typeof styles; children: ReactNode }) {
    const { icon: Icon, cls } = styles[type];
    return (
        <div className={`not-prose my-6 flex gap-3 rounded-lg border p-4 text-sm leading-relaxed ${cls}`}>
            <Icon className="mt-0.5 size-4 shrink-0" />
            <div className="min-w-0 [&>p+p]:mt-2">{children}</div>
        </div>
    );
}
