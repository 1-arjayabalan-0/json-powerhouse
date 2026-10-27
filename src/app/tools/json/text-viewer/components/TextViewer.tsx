"use client"

import { memo, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import CodeEditor from "@/app/components/CodeEditor";
import { useConfig } from "@/app/context/ConfigContext";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { useAutoRepair } from "@/app/hooks/useAutoRepair";
import { useJsonWorker } from "@/app/hooks/useJsonWorker";
import { defaultTextViewerConfig, TextViewerConfig } from "@/core/types/text-viewer-config";
import { extractTextTable, TableColumn } from "@/core/lib/text-viewer/extractTextTable";

const TEXT_VIEWER_SAMPLE = JSON.stringify([
    {
        id: 1,
        query_id: "q1",
        answer_text: "There's no objective \"best,\" but **Shanahan Orthodontics is a strong place to start** if you want a local specialist. [AAO profile](https://aaoinfo.org/locator/dr-kenneth-f-shanahan/) · [Practice site](https://napaorthodontics.com/)\n\nOther Napa options worth comparing:\n\n- **Hello Ortho — Dr. Jordan Lamberton:** Zocdoc shows **4.68/5 from 19 patient reviews**. [Zocdoc profile](https://www.zocdoc.com/dentist/jordan-lamberton-dds-368230)\n- **Cooke Orthodontics:** Yelp lists **4.6/5 from 51 reviews**. [Yelp profile](https://www.yelp.com/biz/cooke-orthodontics-napa)\n\nI'd book consultations with two offices and compare the proposed treatment, total cost, insurance coverage, and follow-up arrangements before choosing."
    },
    {
        id: 2,
        query_id: "q2",
        answer_text: "For emergency dental care in Napa, **Napa Dental Care** offers same-day appointments. Call ahead to confirm availability.\n\n- Hours: Mon–Fri 8am–5pm\n- Phone: (707) 555-0142\n\nBring your insurance card and a list of current medications."
    }
], null, 2);

type ChipState = 'auto' | 'text' | 'compact';

function chipStateFor(key: string, cfg: TextViewerConfig): ChipState {
    if (cfg.forceTextFields.includes(key)) return 'text';
    if (cfg.excludeTextFields.includes(key)) return 'compact';
    return 'auto';
}

function cycleChip(key: string, cfg: TextViewerConfig, setConfig: (c: TextViewerConfig) => void) {
    const state = chipStateFor(key, cfg);
    const force = cfg.forceTextFields.filter(f => f !== key);
    const exclude = cfg.excludeTextFields.filter(f => f !== key);
    if (state === 'auto') {
        force.push(key);
    } else if (state === 'text') {
        exclude.push(key);
    }
    setConfig({ ...cfg, forceTextFields: force, excludeTextFields: exclude });
}

function MarkdownCell({ text }: { text: string }) {
    return (
        <div className="text-[13px] leading-relaxed [overflow-wrap:anywhere] [&_a]:text-primary [&_a]:underline [&_a]:break-all [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_p]:[overflow-wrap:anywhere] [&_li]:[overflow-wrap:anywhere] [&_h1]:[overflow-wrap:anywhere] [&_h2]:[overflow-wrap:anywhere] [&_h3]:[overflow-wrap:anywhere] [&_pre]:[overflow-wrap:anywhere] [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded [&_code]:text-xs">
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => {
                        void node;
                        return <a {...props} target="_blank" rel="noopener noreferrer" />;
                    },
                }}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
}

const CellView = memo(function CellView({ text, mode, collapsed }: { text: string; mode: TableColumn['mode']; collapsed: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = text.length > 500;
    const showToggle = collapsed && isLong && !expanded;

    const content = mode === 'compact'
        ? <span className="font-mono text-xs whitespace-pre-wrap break-all">{text}</span>
        : <span className="whitespace-pre-wrap [overflow-wrap:anywhere] text-[13px] leading-relaxed">{text}</span>;

    return (
        <div>
            <div className={showToggle ? "max-h-64 overflow-hidden relative" : ""}>
                {content}
            </div>
            {isLong && collapsed && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-1 text-[11px] text-primary hover:underline"
                >
                    {expanded ? "Show less" : `Show more (${text.length.toLocaleString()} chars)`}
                </button>
            )}
        </div>
    );
});

function DocumentView({ table }: { table: ReturnType<typeof extractTextTable> }) {
    const textCols = table.columns.filter(c => c.mode === 'text');
    const metaCols = table.columns.filter(c => c.mode !== 'text');

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            {table.rows.map((row, i) => (
                <article key={i} className="pb-8 mb-8 border-b border-border last:border-b-0 last:mb-0">
                    <header className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="text-[11px] font-mono font-semibold text-muted-foreground">#{i + 1}</span>
                        {metaCols.map(col => (
                            <span key={col.key} className="text-xs">
                                <span className="font-mono font-semibold text-foreground">{col.key}</span>
                                <span className="text-muted-foreground">: </span>
                                <span className="text-muted-foreground [overflow-wrap:anywhere]">{row.cells[col.key]}</span>
                            </span>
                        ))}
                    </header>
                    {textCols.length === 0 && (
                        <p className="text-xs text-muted-foreground">No text fields in this item.</p>
                    )}
                    {textCols.map(col => (
                        <section key={col.key} className="mb-5 last:mb-0">
                            {textCols.length > 1 && (
                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">{col.key}</div>
                            )}
                            <MarkdownCell text={row.cells[col.key]} />
                        </section>
                    ))}
                </article>
            ))}
        </div>
    );
}

function ThresholdInput({ value, onCommit }: { value: number; onCommit: (n: number) => void }) {
    const [draft, setDraft] = useState<string>(String(value));

    useEffect(() => {
        setDraft(String(value));
    }, [value]);

    const commit = () => {
        const trimmed = draft.trim();
        if (trimmed === "" || Number(trimmed) === value) {
            setDraft(String(value));
            return;
        }
        const n = Number(trimmed);
        if (!Number.isFinite(n) || n < 1) {
            toast.error("Threshold must be a positive number");
            setDraft(String(value));
            return;
        }
        onCommit(Math.floor(n));
    };

    return (
        <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground" title="String fields with a value at least this long get wrapped into full-width text">
            <span>Text wrap at</span>
            <input
                type="number"
                min={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
                className="w-16 px-1.5 py-0.5 text-xs bg-background border border-border rounded text-foreground"
            />
            <span>chars</span>
        </label>
    );
}

export default function TextViewer() {
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const { config, setConfig } = useConfig();

    const { repaired, error: repairError } = useAutoRepair(input);
    const { data: parsedJson, error: parseError } = useJsonWorker(repaired);

    const viewerConfig = ('textThreshold' in config ? config : defaultTextViewerConfig) as TextViewerConfig;

    const error = parseError || repairError;

    const table = useMemo(() => {
        if (error || parsedJson === null || parsedJson === undefined) {
            return { columns: [], rows: [], isEmpty: true };
        }
        return extractTextTable(parsedJson, viewerConfig);
    }, [parsedJson, error, viewerConfig]);

    return (
        <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">
            {/* Left: Input */}
            <section className="flex-none lg:flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-border relative bg-background h-[45vh] lg:h-full min-h-[300px] lg:min-h-0">
                <div className="h-10 px-4 border-b border-border flex items-center bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] shrink-0">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mr-4">Input Editor</span>
                    <div className="ml-auto flex gap-2 items-center">
                        {error && (
                            <span className="text-[10px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] text-destructive px-2 py-0.5 rounded border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)]">
                                Invalid JSON
                            </span>
                        )}
                        <button
                            onClick={() => { setInput(TEXT_VIEWER_SAMPLE); toast.success("Sample JSON loaded"); }}
                            className="px-2 py-1 text-[11px] bg-primary hover:opacity-90 text-primary-foreground rounded border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] flex items-center gap-1"
                            title="Load Sample JSON"
                        >
                            <span className="material-symbols-outlined !text-[12px]">auto_fix_high</span>
                            <span>Sample</span>
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    if (text) { setInput(text); toast.success("Pasted from clipboard"); }
                                } catch { toast.error("Failed to paste"); }
                            }}
                            className="px-2 py-1 text-[11px] bg-secondary hover:opacity-80 text-secondary-foreground rounded border border-border flex items-center gap-1"
                            title="Paste from clipboard"
                        >
                            <span className="material-symbols-outlined !text-[12px]">content_paste</span>
                            <span>Paste</span>
                        </button>
                        <button
                            onClick={() => setInput("")}
                            className="px-2 py-1 text-[11px] bg-[color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--destructive)_20%,transparent)] text-destructive border border-[color-mix(in_srgb,var(--destructive)_20%,transparent)] rounded flex items-center gap-1"
                            title="Clear Input"
                        >
                            <span className="material-symbols-outlined !text-[12px]">delete</span>
                            <span>Clear</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-1 h-full overflow-hidden relative">
                    <CodeEditor
                        value={input}
                        language="json"
                        onChange={(val) => setInput(val || "")}
                        placeholder="Paste JSON array here..."
                        className="rounded-none border-none bg-transparent"
                    />
                </div>
            </section>

            {/* Right: Table */}
            <section className="flex-none lg:flex-[1.5] min-w-0 flex flex-col bg-background w-full h-[55vh] lg:h-full min-h-[400px] lg:min-h-0">
                <div className="h-10 px-4 flex items-center justify-between bg-card border-b border-border shrink-0 gap-3 overflow-x-auto whitespace-nowrap">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        {viewerConfig.markdownMode ? "Markdown Document" : "Text Table"}
                    </span>
                    <div className="flex items-center gap-3">
                        <ThresholdInput
                            value={viewerConfig.textThreshold}
                            onCommit={(n) => setConfig({ ...viewerConfig, textThreshold: n })}
                        />
                        <button
                            onClick={() => setConfig({ ...viewerConfig, markdownMode: !viewerConfig.markdownMode })}
                            className={`px-2 py-1 text-[11px] rounded border flex items-center gap-1 ${
                                viewerConfig.markdownMode
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary text-secondary-foreground border-border hover:opacity-80"
                            }`}
                            title={viewerConfig.markdownMode ? "Switch to table view" : "Switch to markdown document view"}
                        >
                            <span className="material-symbols-outlined !text-[12px]">markdown</span>
                            <span>{viewerConfig.markdownMode ? "Document" : "Table"}</span>
                        </button>
                        <span className="text-[10px] text-muted-foreground">
                            {table.rows.length} rows · {table.columns.length} cols
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    {!input.trim() && (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            Paste a JSON array on the left, or load the sample.
                        </div>
                    )}
                    {input.trim() && error && (
                        <div className="h-full flex items-center justify-center text-sm text-destructive px-4 text-center">
                            {error}
                        </div>
                    )}
                    {input.trim() && !error && table.isEmpty && (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            No displayable fields found.
                        </div>
                    )}
                    {!error && !table.isEmpty && viewerConfig.markdownMode && (
                        <DocumentView table={table} />
                    )}
                    {!error && !table.isEmpty && !viewerConfig.markdownMode && (
                        <table className="w-full border-collapse text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr>
                                    <th className="bg-card border-b border-border px-3 py-2 text-left text-[10px] uppercase tracking-widest text-muted-foreground w-10">#</th>
                                    {table.columns.map(col => {
                                        const chip = chipStateFor(col.key, viewerConfig);
                                        return (
                                            <th
                                                key={col.key}
                                                className="bg-card border-b border-border border-r border-r-border/50 px-3 py-2 text-left min-w-[120px]"
                                            >
                                                <button
                                                    onClick={() => cycleChip(col.key, viewerConfig, setConfig)}
                                                    className="flex items-center gap-1.5 group"
                                                    title="Click to cycle auto → text → compact"
                                                >
                                                    <span className="font-mono text-xs font-semibold text-foreground group-hover:text-primary">{col.key}</span>
                                                    <span className={`text-[9px] px-1 py-0.5 rounded border ${
                                                        chip === "text"
                                                            ? "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary border-[color-mix(in_srgb,var(--primary)_30%,transparent)]"
                                                            : chip === "compact"
                                                                ? "bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-muted-foreground border-border"
                                                                : "bg-muted text-muted-foreground border-transparent"
                                                    }`}>
                                                        {chip === "auto" ? col.mode : chip}
                                                    </span>
                                                </button>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row, i) => (
                                    <tr key={i} className="border-b border-border align-top hover:bg-[color-mix(in_srgb,var(--muted)_30%,transparent)]">
                                        <td className="border-r border-border/50 px-3 py-2 text-[11px] text-muted-foreground font-mono">{i + 1}</td>
                                        {table.columns.map(col => (
                                            <td key={col.key} className="border-r border-border/50 px-3 py-2">
                                                {row.cells[col.key] === "" ? (
                                                    <span className="text-muted-foreground text-xs">—</span>
                                                ) : (
                                                    <CellView
                                                        text={row.cells[col.key]}
                                                        mode={col.mode}
                                                        collapsed={viewerConfig.collapsedMaxHeight}
                                                    />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </main>
    );
}
