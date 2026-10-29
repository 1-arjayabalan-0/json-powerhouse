"use client"

import { ArrowDown, ArrowUp, CaseSensitive, Eye, EyeOff, Layers, ListTree, Pencil, Plus, Scissors, Trash2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { cn } from "@/app/lib/utils";
import { CaseType, TransformOperation, TransformOperationType, generateOpId } from "@/core/lib/transformations/types";
import { SettingsProps, SettingsSection } from "./fields";

export interface TransformConfig {
    operations: TransformOperation[];
}

const OPERATIONS: { type: TransformOperationType; label: string; hint: string; icon: LucideIcon }[] = [
    { type: 'rename-key', label: 'Rename key', hint: 'Give a key at a path a new name', icon: Pencil },
    { type: 'remove-key', label: 'Remove key', hint: 'Drop a key by path or regex', icon: Trash2 },
    { type: 'case-convert', label: 'Convert case', hint: 'camelCase, snake_case and more', icon: CaseSensitive },
    { type: 'extract-subtree', label: 'Extract subtree', hint: 'Keep only the value at a path', icon: Scissors },
    { type: 'flatten', label: 'Flatten', hint: 'Nested objects to dotted keys', icon: Layers },
    { type: 'unflatten', label: 'Unflatten', hint: 'Dotted keys back to objects', icon: ListTree },
];

const opMeta = (type: TransformOperationType) => OPERATIONS.find(o => o.type === type) ?? OPERATIONS[0];

export default function TransformSettings({ config, update }: SettingsProps<TransformConfig>) {
    const operations = config.operations ?? [];
    const setOperations = (next: TransformOperation[]) => update('operations', next);

    const add = (type: TransformOperationType) =>
        setOperations([...operations, { id: generateOpId(), type, enabled: true, separator: '.', scope: 'keys' }]);
    const patch = (id: string, changes: Partial<TransformOperation>) =>
        setOperations(operations.map(op => (op.id === id ? { ...op, ...changes } : op)));
    const remove = (id: string) => setOperations(operations.filter(op => op.id !== id));
    const move = (index: number, delta: -1 | 1) => {
        const target = index + delta;
        if (target < 0 || target >= operations.length) return;
        const next = [...operations];
        [next[index], next[target]] = [next[target], next[index]];
        setOperations(next);
    };

    return (
        <>
            <SettingsSection title={`Pipeline (${operations.length})`}>
                {operations.length === 0 && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                        No operations yet. Add one below. Operations run top to bottom on the input.
                    </p>
                )}
                {operations.map((op, index) => (
                    <OperationCard
                        key={op.id}
                        op={op}
                        index={index}
                        total={operations.length}
                        onChange={(changes) => patch(op.id, changes)}
                        onRemove={() => remove(op.id)}
                        onMove={(delta) => move(index, delta)}
                    />
                ))}
            </SettingsSection>
            <SettingsSection title="Add operation">
                <div className="grid grid-cols-1 gap-1.5">
                    {OPERATIONS.map(({ type, label, hint, icon: Icon }) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => add(type)}
                            className="flex items-center gap-2.5 rounded-md border border-border bg-background px-2.5 py-2 text-left transition-colors hover:border-primary/50 hover:bg-accent"
                        >
                            <Icon className="size-4 shrink-0 text-primary" />
                            <span className="flex min-w-0 flex-col">
                                <span className="text-xs font-medium text-foreground">{label}</span>
                                <span className="truncate text-[11px] text-muted-foreground">{hint}</span>
                            </span>
                            <Plus className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
                        </button>
                    ))}
                </div>
            </SettingsSection>
        </>
    );
}

function OperationCard({ op, index, total, onChange, onRemove, onMove }: {
    op: TransformOperation;
    index: number;
    total: number;
    onChange: (changes: Partial<TransformOperation>) => void;
    onRemove: () => void;
    onMove: (delta: -1 | 1) => void;
}) {
    const { label, icon: Icon } = opMeta(op.type);
    const iconButton = "rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent";

    return (
        <div className={cn("rounded-md border border-border bg-background p-2.5", !op.enabled && "opacity-60")}>
            <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">{index + 1}</span>
                <Icon className="size-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">{label}</span>
                <div className="ml-auto flex items-center">
                    <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className={iconButton} aria-label="Move up">
                        <ArrowUp className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className={iconButton} aria-label="Move down">
                        <ArrowDown className="size-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange({ enabled: !op.enabled })}
                        className={iconButton}
                        aria-label={op.enabled ? "Disable operation" : "Enable operation"}
                        aria-pressed={op.enabled}
                    >
                        {op.enabled ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button type="button" onClick={onRemove} className={cn(iconButton, "hover:text-destructive")} aria-label="Remove operation">
                        <X className="size-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                {(op.type === 'rename-key' || op.type === 'remove-key' || op.type === 'extract-subtree') && (
                    <Input
                        value={op.path ?? ''}
                        onChange={(e) => onChange({ path: e.target.value })}
                        placeholder="Path, e.g. user.address"
                        aria-label="Path"
                        className="h-8 bg-card text-xs"
                    />
                )}
                {op.type === 'rename-key' && (
                    <Input
                        value={op.newKey ?? ''}
                        onChange={(e) => onChange({ newKey: e.target.value })}
                        placeholder="New key name"
                        aria-label="New key name"
                        className="h-8 bg-card text-xs"
                    />
                )}
                {op.type === 'remove-key' && (
                    <Input
                        value={op.pattern ?? ''}
                        onChange={(e) => onChange({ pattern: e.target.value })}
                        placeholder="Or regex pattern, e.g. ^_"
                        aria-label="Key pattern"
                        className="h-8 bg-card text-xs"
                    />
                )}
                {op.type === 'case-convert' && (
                    <div className="flex gap-1.5">
                        <Select value={op.caseType ?? 'camelCase'} onValueChange={(v) => onChange({ caseType: v as CaseType })}>
                            <SelectTrigger aria-label="Target case" className="h-8 flex-1 bg-card text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="camelCase" className="text-xs">camelCase</SelectItem>
                                <SelectItem value="snake_case" className="text-xs">snake_case</SelectItem>
                                <SelectItem value="kebab-case" className="text-xs">kebab-case</SelectItem>
                                <SelectItem value="PascalCase" className="text-xs">PascalCase</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={op.scope ?? 'keys'} onValueChange={(v) => onChange({ scope: v as TransformOperation['scope'] })}>
                            <SelectTrigger aria-label="Apply to" className="h-8 w-24 bg-card text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="keys" className="text-xs">Keys</SelectItem>
                                <SelectItem value="values" className="text-xs">Values</SelectItem>
                                <SelectItem value="both" className="text-xs">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
                {(op.type === 'flatten' || op.type === 'unflatten') && (
                    <Input
                        value={op.separator ?? '.'}
                        onChange={(e) => onChange({ separator: e.target.value })}
                        placeholder="Separator (default .)"
                        aria-label="Separator"
                        className="h-8 bg-card text-xs"
                    />
                )}
            </div>
        </div>
    );
}
