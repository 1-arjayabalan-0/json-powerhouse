"use client"

import { ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Switch } from "@/app/components/ui/switch";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export interface SettingsProps<T> {
    config: T;
    update: <K extends keyof T>(key: K, value: T[K]) => void;
}

export function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-3 py-4 first:pt-0 border-b border-border last:border-b-0">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
            {children}
        </section>
    );
}

function Hint({ text }: { text?: string }) {
    if (!text) return null;
    return <p className="text-[11px] leading-snug text-muted-foreground">{text}</p>;
}

export function SelectField({ id, label, value, options, onChange, disabled, hint }: {
    id: string; label: string; value: string; options: { value: string; label: string }[];
    onChange: (v: string) => void; disabled?: boolean; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={id} className="text-xs font-medium text-foreground">{label}</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id={id} className="h-8 w-full text-xs bg-background border-input">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map(o => (
                        <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Hint text={hint} />
        </div>
    );
}

export function SwitchField({ id, label, checked, onChange, disabled, hint }: {
    id: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; hint?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3 min-h-8">
                <Label htmlFor={id} className={`text-xs font-medium ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>{label}</Label>
                <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
            </div>
            <Hint text={hint} />
        </div>
    );
}

export function TextField({ id, label, value, onChange, placeholder }: {
    id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={id} className="text-xs font-medium text-foreground">{label}</Label>
            <Input id={id} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-8 text-xs bg-background border-input" />
        </div>
    );
}

export function NumberField({ id, label, value, min, max, onChange }: {
    id: string; label: string; value: number; min?: number; max?: number; onChange: (v: number) => void;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label htmlFor={id} className="text-xs font-medium text-foreground">{label}</Label>
            <Input
                id={id} type="number" value={value} min={min} max={max}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (raw.trim() === '') return;
                    const n = Number(raw);
                    if (Number.isFinite(n)) onChange(n);
                }}
                className="h-8 text-xs bg-background border-input"
            />
        </div>
    );
}
