import { ReactNode } from "react";

export default function EditorPane({ label, status, actions, children, className = "" }: {
    label: string; status?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string;
}) {
    return (
        <section className={`flex min-h-0 min-w-0 flex-1 flex-col bg-background ${className}`}>
            <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-card px-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                {status}
                <div className="ml-auto flex items-center gap-1">{actions}</div>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
        </section>
    );
}

export function StatusBadge({ tone, children }: { tone: 'ok' | 'warn' | 'error'; children: ReactNode }) {
    const tones = {
        ok: "text-success bg-success/10 border-success/20",
        warn: "text-warning bg-warning/10 border-warning/20",
        error: "text-destructive bg-destructive/10 border-destructive/20",
    };
    return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${tones[tone]}`}>{children}</span>;
}
