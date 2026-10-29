"use client"

import type { LucideIcon } from "lucide-react";

const variants = {
    default: "text-muted-foreground hover:bg-accent hover:text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    danger: "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
};

export default function PaneButton({ icon: Icon, label, onClick, variant = 'default', disabled, hideLabelOnMobile = true }: {
    icon: LucideIcon; label: string; onClick: () => void; variant?: keyof typeof variants; disabled?: boolean; hideLabelOnMobile?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium transition-colors disabled:opacity-50 ${variants[variant]}`}
        >
            <Icon className="size-3.5" />
            <span className={hideLabelOnMobile ? "hidden sm:inline" : ""}>{label}</span>
        </button>
    );
}
