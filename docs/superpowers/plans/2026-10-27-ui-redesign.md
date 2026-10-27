# JSON PowerHouse UI v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current tool layout (hidden dropdown nav, bottom config panel, collapsed SEO accordion, shared config) with a sidebar app shell, a per-tool right settings panel backed by per-tool persisted config, visible SEO articles under every tool, and an MDX blog.

**Architecture:** A typed tool registry (`tool-registry.ts`) drives the sidebar, search, defaults, settings and article content. `ConfigContext` keeps its `useConfig()` API but resolves the active tool from the pathname and reads/writes `localStorage` key `jph:config:<toolId>` through a pure storage module. `/tools/layout.tsx` renders header + sidebar; each tool page renders `<ToolWorkspace>` (title bar, editors, settings panel) followed by a server-rendered `<ToolArticle>`. Blog posts are MDX files in `content/blog`, loaded with `gray-matter` and rendered with `next-mdx-remote/rsc`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4 (CSS variables), Radix/shadcn primitives, lucide-react, next-themes, Monaco, Jest + ts-jest (node env), next-mdx-remote 6, gray-matter 4, rehype-slug 6, rehype-autolink-headings 7, rehype-pretty-code 0.14 + shiki 4.

**Spec:** `docs/superpowers/specs/2026-10-27-ui-redesign-design.md`

## Global Constraints

- All commands run from `json-powerhouse/` (the git repo root).
- Header height 48px; sidebar 224px expanded / 56px collapsed; settings panel 288px; pane header 40px; controls 32px; status bar 28px.
- Dark tokens: background `#0b0f17`, card `#111827`, muted `#161e2e`, border `#1f2937`, foreground `#e5e7eb`, muted-foreground `#9ca3af`, primary `#3b82f6`.
- Light tokens: background `#ffffff`, card `#f8fafc`, muted `#f1f5f9`, border `#e2e8f0`, foreground `#0f172a`, muted-foreground `#64748b`, primary `#2563eb`.
- Status: success `#22c55e`, warning `#f59e0b`, destructive `#ef4444`.
- Default theme stays `dark` (`ThemeProvider defaultTheme="dark"`).
- Fonts: Inter (UI) + Geist Mono (code). Icons: lucide-react only by the end of the plan.
- localStorage keys: `jph:config:<toolId>`, `jph:sidebar-collapsed`, `jph:settings-open`. Every storage access wrapped in try/catch.
- Do not change tool processing logic (`src/core/**`, generators, diagnostics, workers) or `extension/`.
- Baseline: `npx tsc --noEmit` passes; `npx jest` has 3 pre-existing failing suites (`tests/generators/json-to-php.test.ts`, `tests/generators/batch-generators.test.ts`, `tests/performance/performance.test.ts`). These must not get worse; no new failures allowed.
- Jest runs in `testEnvironment: 'node'` — tests only cover pure `.ts` modules (no React rendering, no new test deps).
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Stage only the files the task touches (`git add <paths>`), never `git add -A`.

### Deviations from spec (decided while planning)

- The spec named a per-page `ToolConfigProvider` + `useToolConfig` hook. The plan instead keeps the existing `ConfigProvider`/`useConfig()` API (mounted once in `/tools/layout.tsx`) and makes it per-tool internally. Same behaviour (isolation, persistence, reset), far fewer call-site changes.
- Tools whose settings are all disabled/commented today (Diff, Transform) get no settings component; the ⚙ toggle is hidden for them. `TextViewerSettings` and `ViewerSettings` are created (viewer ports the unused `TreeSettings.tsx` options, which is then deleted).
- The spec's separate `StatusBar` row is dropped: validity/repair status is shown as badges in the pane headers (`StatusBadge`, Task 7), which keeps more height for the editors.
- Settings/content completeness is enforced by TypeScript (`Record<ToolId, …>`) and a Jest registry test, not by rendering tests.

## Prerequisite (before Task 1)

The working tree has uncommitted user work (text-viewer tool + edits to `BottomConfigurationPanel.tsx`, `tools-config.ts`, `ConfigContext.tsx`, `sitemap.ts`, `package.json`). Ask the user to commit it (or get explicit permission to commit it as `wip: text viewer`) before Task 1, because Tasks 3 and 6 rewrite/delete those files.

## File Map

| Path | Status | Responsibility |
|---|---|---|
| `src/app/config/tool-registry.ts` | create | Typed list of tools, groups, lookup helpers |
| `src/app/config/tool-defaults.ts` | create | Default config per tool id (presets folded in) |
| `src/app/lib/tool-config-storage.ts` | create | Pure read/write/clear of per-tool config in a KV storage |
| `src/app/context/ConfigContext.tsx` | rewrite | Per-tool config state keyed by active tool |
| `src/app/components/shell/AppHeader.tsx` | create | 48px sticky header |
| `src/app/components/shell/ToolSidebar.tsx` | create | Grouped tool nav, collapsible, mobile drawer |
| `src/app/components/shell/ToolSearch.tsx` | create | Ctrl/Cmd+K palette |
| `src/app/components/shell/ShellContext.tsx` | create | Sidebar drawer open state shared by header + sidebar |
| `src/app/components/shell/ToolWorkspace.tsx` | create | Tool title bar + content + settings panel frame |
| `src/app/components/shell/SettingsPanel.tsx` | create | Right panel / mobile bottom sheet |
| `src/app/components/shell/EditorPane.tsx` | create | Shared pane chrome (header + body) |
| `src/app/components/shell/PaneButton.tsx` | create | Small pane action button |
| `src/app/components/settings/fields.tsx` | create | `SettingsSection`, `SelectField`, `SwitchField`, `TextField`, `NumberField` |
| `src/app/components/settings/*Settings.tsx` | create | One per tool/family |
| `src/app/components/settings/index.ts` | create | `settingsByTool` map |
| `src/app/components/ToolArticle.tsx` | create | Visible SEO article + FAQ JSON-LD |
| `src/content/tools/*.ts`, `src/content/tools/index.ts` | create | Article content per tool |
| `src/app/lib/blog.ts` | create | Load/sort/filter MDX posts |
| `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/TagFilter.tsx` | create | Blog routes |
| `src/app/components/mdx/*.tsx` | create | MDX components |
| `content/blog/*.mdx` | create | Starter posts |
| `src/app/tools/layout.tsx`, `ToolsLayoutClient.tsx` | rewrite | New shell |
| `src/app/tools/**/page.tsx` | modify | Workspace + article |
| `src/app/globals.css`, `src/app/layout.tsx` | modify | Tokens, fonts, prose |
| `Header.tsx`, `BottomConfigurationPanel.tsx`, `SeoAccordion.tsx`, `ModeContext.tsx`, `tools-config.ts`, `tool-presets.ts`, `TreeSettings.tsx` | delete | Replaced |

---

### Task 1: Design tokens, fonts and dependencies

**Files:**
- Modify: `src/app/globals.css` (`:root` block lines 8–85, `.dark` block lines 87–157, `@layer base` lines 210–219; append prose + utility styles)
- Modify: `src/app/layout.tsx` (fonts, body class, Toaster theme, drop `ModeProvider` is done in Task 5 — not here)
- Modify: `package.json`, `package-lock.json` (blog deps)

**Interfaces:**
- Produces: CSS variables `--background --foreground --card --card-foreground --popover --popover-foreground --primary --primary-foreground --secondary --secondary-foreground --muted --muted-foreground --accent --accent-foreground --destructive --destructive-foreground --success --success-foreground --warning --warning-foreground --border --input --ring` (names unchanged so existing classes keep working), font variables `--font-inter`, `--font-geist-mono`, utility class `.prose-jph`.

- [ ] **Step 1: Install blog dependencies now (used in Tasks 10–12)**

Run: `npm install next-mdx-remote@6.0.0 gray-matter@4.0.3 rehype-slug@6.0.0 rehype-autolink-headings@7.1.0 rehype-pretty-code@0.14.5 shiki@4.5.0`
Expected: exits 0, `package.json` dependencies list the six packages.

- [ ] **Step 2: Replace the `:root` color block**

In `src/app/globals.css`, replace everything from `:root {` through its closing `}` (before `.dark {`) with:

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #f8fafc;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --secondary: #e2e8f0;
  --secondary-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --accent: #f1f5f9;
  --accent-foreground: #0f172a;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --success: #16a34a;
  --success-foreground: #ffffff;
  --warning: #d97706;
  --warning-foreground: #0f172a;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #2563eb;
  --radius: 0.5rem;

  --sidebar: #f8fafc;
  --sidebar-foreground: #0f172a;
  --sidebar-primary: #2563eb;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #eef2f7;
  --sidebar-accent-foreground: #0f172a;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #2563eb;

  --chart-1: #3b82f6;
  --chart-2: #06b6d4;
  --chart-3: #22c55e;
  --chart-4: #f59e0b;
  --chart-5: #ef4444;

  --syntax-string: #b45309;
  --syntax-number: #2563eb;
  --syntax-boolean: #7c3aed;
  --syntax-null: #dc2626;
  --syntax-key: #334155;
}
```

(Light success/warning are darkened one step from the spec values for text contrast on white; dark mode uses the exact spec values.)

- [ ] **Step 3: Replace the `.dark` block**

```css
.dark {
  --background: #0b0f17;
  --foreground: #e5e7eb;
  --card: #111827;
  --card-foreground: #e5e7eb;
  --popover: #111827;
  --popover-foreground: #e5e7eb;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --secondary: #1f2937;
  --secondary-foreground: #e5e7eb;
  --muted: #161e2e;
  --muted-foreground: #9ca3af;
  --accent: #1a2333;
  --accent-foreground: #e5e7eb;
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --success: #22c55e;
  --success-foreground: #0b0f17;
  --warning: #f59e0b;
  --warning-foreground: #0b0f17;
  --border: #1f2937;
  --input: #1f2937;
  --ring: #3b82f6;

  --sidebar: #0d121c;
  --sidebar-foreground: #e5e7eb;
  --sidebar-primary: #3b82f6;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #161e2e;
  --sidebar-accent-foreground: #e5e7eb;
  --sidebar-border: #1f2937;
  --sidebar-ring: #3b82f6;

  --chart-1: #3b82f6;
  --chart-2: #06b6d4;
  --chart-3: #22c55e;
  --chart-4: #f59e0b;
  --chart-5: #ef4444;

  --syntax-string: #fbbf24;
  --syntax-number: #60a5fa;
  --syntax-boolean: #a78bfa;
  --syntax-null: #f87171;
  --syntax-key: #9ca3af;
}
```

- [ ] **Step 4: Add success/warning to `@theme inline`, fix aliases, fix base font**

Inside `@theme inline { … }` add after `--color-destructive-foreground`:

```css
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
```

Replace the three hard-coded aliases with:

```css
  --color-background-dark: #0b0f17;
  --color-surface-dark: #111827;
  --color-border-dark: #1f2937;
```

In `@layer base`, change the `body` rule to:

```css
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    font-feature-settings: "cv11", "ss01";
  }
```

- [ ] **Step 5: Append prose and scrollbar styles at the end of `globals.css`**

```css
/* ---------- Article / blog typography ---------- */
.prose-jph {
  max-width: 72ch;
  color: var(--foreground);
  font-size: 1rem;
  line-height: 1.75;
}
.prose-jph > * + * { margin-top: 1.1em; }
.prose-jph h2 {
  font-size: 1.5rem; line-height: 1.3; font-weight: 700;
  margin-top: 2.2em; scroll-margin-top: 72px; letter-spacing: -0.01em;
}
.prose-jph h3 {
  font-size: 1.15rem; line-height: 1.4; font-weight: 600;
  margin-top: 1.8em; scroll-margin-top: 72px;
}
.prose-jph p, .prose-jph li { color: color-mix(in srgb, var(--foreground) 88%, transparent); }
.prose-jph a { color: var(--primary); text-decoration: underline; text-underline-offset: 3px; }
.prose-jph ul { list-style: disc; padding-left: 1.4em; }
.prose-jph ol { list-style: decimal; padding-left: 1.4em; }
.prose-jph li + li { margin-top: 0.35em; }
.prose-jph strong { color: var(--foreground); font-weight: 600; }
.prose-jph :not(pre) > code {
  font-family: var(--font-geist-mono), monospace; font-size: 0.875em;
  background: var(--muted); border: 1px solid var(--border);
  border-radius: 4px; padding: 0.1em 0.35em;
}
.prose-jph pre {
  font-family: var(--font-geist-mono), monospace; font-size: 0.85rem; line-height: 1.6;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; padding: 1rem 1.1rem; overflow-x: auto;
}
.prose-jph blockquote {
  border-left: 3px solid var(--primary); padding-left: 1em;
  color: var(--muted-foreground);
}
.prose-jph table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.prose-jph th, .prose-jph td { border: 1px solid var(--border); padding: 0.5em 0.75em; text-align: left; }
.prose-jph th { background: var(--muted); font-weight: 600; }
.prose-jph hr { border-color: var(--border); margin: 2.5em 0; }
.prose-jph .heading-anchor { text-decoration: none; color: inherit; }

/* rehype-pretty-code: dual themes */
.prose-jph pre [data-line] { padding: 0 0.25rem; }
html.dark .prose-jph pre, html.dark .prose-jph pre span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
html:not(.dark) .prose-jph pre, html:not(.dark) .prose-jph pre span {
  color: var(--shiki-light) !important;
  background-color: var(--shiki-light-bg) !important;
}

/* thin scrollbars for shell regions */
.scroll-thin { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
```

- [ ] **Step 6: Switch fonts in `src/app/layout.tsx`**

Replace the font import and the `poppins` declaration:

```tsx
import { Inter, Geist_Mono } from "next/font/google";
```

```tsx
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});
```

Change the body element to:

```tsx
<body className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
```

Change `<Toaster position="bottom-left" richColors theme="dark" />` to `<Toaster position="bottom-right" richColors theme="system" />`.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit`
Expected: no output, exit 0.
Run dev server (`npm run dev`), open `http://localhost:3000/tools/json/formatter`: page renders in Inter with the new dark palette; nothing is broken functionally.

- [ ] **Step 8: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat(ui): new design tokens, Inter font, blog deps

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Tool registry

**Files:**
- Create: `src/app/config/tool-registry.ts`
- Test: `tests/app/tool-registry.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ToolGroupId = 'json' | 'code';
  export interface ToolDef { id: string; name: string; shortName: string; path: string; group: ToolGroupId; icon: LucideIcon; tagline: string; keywords: readonly string[]; hidden?: boolean; }
  export const tools: readonly ToolDef[]   // `as const satisfies`
  export type ToolId = (typeof tools)[number]['id'];
  export const toolGroups: readonly { id: ToolGroupId; name: string }[];
  export function getToolById(id: string): ToolDef | undefined;
  export function getToolByPath(path: string | null | undefined): ToolDef | undefined;
  export function getVisibleTools(group?: ToolGroupId): ToolDef[];
  ```

- [ ] **Step 1: Write the failing test**

`tests/app/tool-registry.test.ts`:

```ts
import { tools, toolGroups, getToolById, getToolByPath, getVisibleTools } from '@/app/config/tool-registry';

describe('tool registry', () => {
    it('has unique ids and paths', () => {
        const ids = tools.map(t => t.id);
        const paths = tools.map(t => t.path);
        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(paths).size).toBe(paths.length);
    });

    it('puts every tool under /tools/ in a known group', () => {
        const groupIds = toolGroups.map(g => g.id);
        for (const t of tools) {
            expect(t.path.startsWith('/tools/')).toBe(true);
            expect(groupIds).toContain(t.group);
            expect(t.tagline.length).toBeGreaterThan(10);
        }
    });

    it('looks tools up by id and path', () => {
        expect(getToolById('json-formatter')?.path).toBe('/tools/json/formatter');
        expect(getToolByPath('/tools/code/json-to-csharp')?.id).toBe('json-to-csharp');
        expect(getToolByPath('/tools/code/json-to-csharp/')?.id).toBe('json-to-csharp');
        expect(getToolByPath('/nope')).toBeUndefined();
        expect(getToolByPath(null)).toBeUndefined();
    });

    it('hides normalize and php from visible lists', () => {
        const visible = getVisibleTools().map(t => t.id);
        expect(visible).not.toContain('json-normalize');
        expect(visible).not.toContain('json-to-php');
        expect(getVisibleTools('json').every(t => t.group === 'json')).toBe(true);
        expect(getVisibleTools('code')).toHaveLength(9);
        expect(getVisibleTools('json')).toHaveLength(8);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest tests/app/tool-registry.test.ts`
Expected: FAIL — `Cannot find module '@/app/config/tool-registry'`.

- [ ] **Step 3: Implement**

`src/app/config/tool-registry.ts`:

```ts
import type { LucideIcon } from 'lucide-react';
import {
    TextAlignStart, Minimize2, CircleCheck, ListTree, TextWrap, ArrowLeftRight,
    GitCompare, Shuffle, Eraser, FileCode, Coffee, Puzzle, Feather, Bird, Boxes,
    Hash, Code, Cog, Gem,
} from 'lucide-react';

export type ToolGroupId = 'json' | 'code';

export interface ToolDef {
    id: string;
    name: string;
    shortName: string;
    path: string;
    group: ToolGroupId;
    icon: LucideIcon;
    tagline: string;
    keywords: readonly string[]; // readonly so the `as const` list below satisfies it
    hidden?: boolean;
}

export const toolGroups: readonly { id: ToolGroupId; name: string }[] = [
    { id: 'json', name: 'JSON Tools' },
    { id: 'code', name: 'Code Generators' },
];

export const tools = [
    { id: 'json-formatter', name: 'JSON Formatter', shortName: 'Formatter', path: '/tools/json/formatter', group: 'json', icon: TextAlignStart, tagline: 'Format, beautify and auto-repair JSON', keywords: ['beautify', 'prettify', 'indent', 'repair'] },
    { id: 'json-minifier', name: 'JSON Minifier', shortName: 'Minifier', path: '/tools/json/minifier', group: 'json', icon: Minimize2, tagline: 'Compress JSON by stripping whitespace', keywords: ['minify', 'compress', 'compact'] },
    { id: 'json-validator', name: 'JSON Validator', shortName: 'Validator', path: '/tools/json/validator', group: 'json', icon: CircleCheck, tagline: 'Validate JSON and pinpoint syntax errors', keywords: ['validate', 'lint', 'check', 'errors'] },
    { id: 'json-viewer', name: 'JSON Tree Viewer', shortName: 'Tree Viewer', path: '/tools/json/viewer', group: 'json', icon: ListTree, tagline: 'Explore JSON as a collapsible tree', keywords: ['tree', 'explore', 'navigate'] },
    { id: 'json-text-viewer', name: 'JSON Text Viewer', shortName: 'Text Viewer', path: '/tools/json/text-viewer', group: 'json', icon: TextWrap, tagline: 'Read long text fields from JSON as a table', keywords: ['text', 'table', 'markdown', 'read'] },
    { id: 'json-json5', name: 'JSON ↔ JSON5', shortName: 'JSON5', path: '/tools/json/json5', group: 'json', icon: ArrowLeftRight, tagline: 'Convert between strict JSON and JSON5', keywords: ['json5', 'convert', 'comments'] },
    { id: 'json-diff', name: 'JSON Diff Checker', shortName: 'Diff', path: '/tools/json/diff', group: 'json', icon: GitCompare, tagline: 'Compare two JSON documents and merge changes', keywords: ['compare', 'diff', 'merge', 'patch'] },
    { id: 'json-transform', name: 'JSON Transform', shortName: 'Transform', path: '/tools/json/transform', group: 'json', icon: Shuffle, tagline: 'Reshape and transform JSON structures', keywords: ['transform', 'map', 'reshape'] },
    { id: 'json-normalize', name: 'Strip Comments / Normalize', shortName: 'Normalize', path: '/tools/json/normalize', group: 'json', icon: Eraser, tagline: 'Strip comments and normalize JSON output', keywords: ['normalize', 'comments'], hidden: true },
    { id: 'json-to-typescript', name: 'JSON → TypeScript', shortName: 'TypeScript', path: '/tools/code/json-to-typescript', group: 'code', icon: FileCode, tagline: 'Generate TypeScript interfaces or Zod schemas', keywords: ['typescript', 'ts', 'interface', 'zod'] },
    { id: 'json-to-java', name: 'JSON → Java', shortName: 'Java', path: '/tools/code/json-to-java', group: 'code', icon: Coffee, tagline: 'Generate Java POJOs from JSON', keywords: ['java', 'pojo', 'class'] },
    { id: 'json-to-kotlin', name: 'JSON → Kotlin', shortName: 'Kotlin', path: '/tools/code/json-to-kotlin', group: 'code', icon: Puzzle, tagline: 'Generate Kotlin data classes', keywords: ['kotlin', 'data class', 'android'] },
    { id: 'json-to-dart', name: 'JSON → Dart', shortName: 'Dart', path: '/tools/code/json-to-dart', group: 'code', icon: Feather, tagline: 'Generate Dart / Flutter models', keywords: ['dart', 'flutter', 'freezed'] },
    { id: 'json-to-swift', name: 'JSON → Swift Codable', shortName: 'Swift', path: '/tools/code/json-to-swift', group: 'code', icon: Bird, tagline: 'Generate Swift Codable structs', keywords: ['swift', 'codable', 'ios'] },
    { id: 'json-to-go', name: 'JSON → Go Struct', shortName: 'Go', path: '/tools/code/json-to-go', group: 'code', icon: Boxes, tagline: 'Generate Go structs with JSON tags', keywords: ['go', 'golang', 'struct'] },
    { id: 'json-to-csharp', name: 'JSON → C# Class', shortName: 'C#', path: '/tools/code/json-to-csharp', group: 'code', icon: Hash, tagline: 'Generate C# classes, records or structs', keywords: ['c#', 'csharp', 'dotnet', 'record'] },
    { id: 'json-to-python', name: 'JSON → Python Dataclass', shortName: 'Python', path: '/tools/code/json-to-python', group: 'code', icon: Code, tagline: 'Generate Python dataclasses or attrs', keywords: ['python', 'dataclass', 'pydantic'] },
    { id: 'json-to-rust', name: 'JSON → Rust Struct', shortName: 'Rust', path: '/tools/code/json-to-rust', group: 'code', icon: Cog, tagline: 'Generate Rust structs with serde', keywords: ['rust', 'serde', 'struct'] },
    { id: 'json-to-php', name: 'JSON → PHP Class', shortName: 'PHP', path: '/tools/code/json-to-php', group: 'code', icon: Gem, tagline: 'Generate PHP classes from JSON', keywords: ['php', 'class'], hidden: true },
] as const satisfies readonly ToolDef[];

export type ToolId = (typeof tools)[number]['id'];

const normalize = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

export function getToolById(id: string): ToolDef | undefined {
    return (tools as readonly ToolDef[]).find(t => t.id === id);
}

export function getToolByPath(path: string | null | undefined): ToolDef | undefined {
    if (!path) return undefined;
    const p = normalize(path);
    return (tools as readonly ToolDef[]).find(t => t.path === p);
}

export function getVisibleTools(group?: ToolGroupId): ToolDef[] {
    return (tools as readonly ToolDef[]).filter(t => !t.hidden && (!group || t.group === group));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest tests/app/tool-registry.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/config/tool-registry.ts tests/app/tool-registry.test.ts
git commit -m "feat(ui): typed tool registry

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Per-tool config storage, defaults and ConfigContext

**Files:**
- Create: `src/app/lib/tool-config-storage.ts`
- Create: `src/app/config/tool-defaults.ts`
- Rewrite: `src/app/context/ConfigContext.tsx`
- Modify: `src/app/components/JSONToolPage.tsx` (drop runtime preset merge)
- Test: `tests/app/tool-config-storage.test.ts`, extend `tests/app/tool-registry.test.ts`

**Interfaces:**
- Consumes: `ToolId`, `tools`, `getToolByPath` (Task 2).
- Produces:
  ```ts
  // tool-config-storage.ts
  export interface KeyValueStorage { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void; }
  export function configKey(toolId: string): string;                 // 'jph:config:<toolId>'
  export function readToolConfig<T extends object>(s: KeyValueStorage | null, toolId: string, defaults: T): T;
  export function writeToolConfig(s: KeyValueStorage | null, toolId: string, config: object): void;
  export function clearToolConfig(s: KeyValueStorage | null, toolId: string): void;
  export function getBrowserStorage(): KeyValueStorage | null;
  // tool-defaults.ts
  export const toolDefaults: Record<ToolId, object>;
  export function getToolDefaults(toolId: string | null | undefined): object;
  // ConfigContext.tsx
  export function ConfigProvider({ children }): JSX.Element;
  export function useConfig(): { toolId: ToolId | null; config: any; setConfig: (next: any | ((prev: any) => any)) => void; reset: () => void };
  ```

- [ ] **Step 1: Write the failing storage tests**

`tests/app/tool-config-storage.test.ts`:

```ts
import { configKey, readToolConfig, writeToolConfig, clearToolConfig, KeyValueStorage } from '@/app/lib/tool-config-storage';

function memoryStorage(): KeyValueStorage & { data: Record<string, string> } {
    const data: Record<string, string> = {};
    return {
        data,
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
        removeItem: (k) => { delete data[k]; },
    };
}

const defaults = { indent: '2', sort: false };

describe('tool-config-storage', () => {
    it('uses the jph:config: key prefix', () => {
        expect(configKey('json-formatter')).toBe('jph:config:json-formatter');
    });

    it('returns defaults when nothing is stored or storage is null', () => {
        expect(readToolConfig(memoryStorage(), 'a', defaults)).toEqual(defaults);
        expect(readToolConfig(null, 'a', defaults)).toBe(defaults);
    });

    it('round-trips a config', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: '4', sort: true });
        expect(readToolConfig(s, 'a', defaults)).toEqual({ indent: '4', sort: true });
    });

    it('keeps tools isolated', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: 'tab', sort: true });
        expect(readToolConfig(s, 'b', defaults)).toEqual(defaults);
    });

    it('merges stored values over defaults so new default keys appear', () => {
        const s = memoryStorage();
        s.setItem(configKey('a'), JSON.stringify({ indent: '4' }));
        expect(readToolConfig(s, 'a', { ...defaults, newKey: 1 })).toEqual({ indent: '4', sort: false, newKey: 1 });
    });

    it('ignores corrupt or non-object storage', () => {
        const s = memoryStorage();
        s.setItem(configKey('a'), '{not json');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
        s.setItem(configKey('a'), '[1,2]');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
        s.setItem(configKey('a'), 'null');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
    });

    it('clear removes the stored config', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: '4', sort: true });
        clearToolConfig(s, 'a');
        expect(s.data).toEqual({});
    });

    it('swallows storage exceptions', () => {
        const throwing: KeyValueStorage = {
            getItem: () => { throw new Error('denied'); },
            setItem: () => { throw new Error('quota'); },
            removeItem: () => { throw new Error('denied'); },
        };
        expect(readToolConfig(throwing, 'a', defaults)).toEqual(defaults);
        expect(() => writeToolConfig(throwing, 'a', defaults)).not.toThrow();
        expect(() => clearToolConfig(throwing, 'a')).not.toThrow();
    });
});
```

Append to `tests/app/tool-registry.test.ts`:

```ts
import { toolDefaults, getToolDefaults } from '@/app/config/tool-defaults';

describe('tool defaults', () => {
    it('has defaults for every registered tool', () => {
        for (const t of tools) {
            expect(toolDefaults[t.id as keyof typeof toolDefaults]).toBeDefined();
        }
    });

    it('folds minifier preset into its defaults without touching formatter', () => {
        const min = getToolDefaults('json-minifier') as { pretty: boolean; indentation: string };
        const fmt = getToolDefaults('json-formatter') as { pretty: boolean };
        expect(min.pretty).toBe(false);
        expect(min.indentation).toBe('0');
        expect(fmt.pretty).not.toBe(false);
    });

    it('returns stable objects (same reference per call)', () => {
        expect(getToolDefaults('json-to-go')).toBe(getToolDefaults('json-to-go'));
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest tests/app`
Expected: FAIL — modules `tool-config-storage` and `tool-defaults` not found.

- [ ] **Step 3: Implement storage**

`src/app/lib/tool-config-storage.ts`:

```ts
export interface KeyValueStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export function configKey(toolId: string): string {
    return `jph:config:${toolId}`;
}

export function readToolConfig<T extends object>(storage: KeyValueStorage | null, toolId: string, defaults: T): T {
    if (!storage) return defaults;
    try {
        const raw = storage.getItem(configKey(toolId));
        if (raw === null) return defaults;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return defaults;
        return { ...defaults, ...(parsed as Partial<T>) };
    } catch {
        return defaults;
    }
}

export function writeToolConfig(storage: KeyValueStorage | null, toolId: string, config: object): void {
    if (!storage) return;
    try {
        storage.setItem(configKey(toolId), JSON.stringify(config));
    } catch {
        // storage full or blocked: settings simply won't persist
    }
}

export function clearToolConfig(storage: KeyValueStorage | null, toolId: string): void {
    if (!storage) return;
    try {
        storage.removeItem(configKey(toolId));
    } catch {
        // ignore
    }
}

export function getBrowserStorage(): KeyValueStorage | null {
    try {
        return typeof window === 'undefined' ? null : window.localStorage;
    } catch {
        return null;
    }
}
```

- [ ] **Step 4: Implement defaults**

`src/app/config/tool-defaults.ts` (moves the presets here; `tool-presets.ts` is deleted in Task 6):

```ts
import { defaultConfig as defaultFormatterConfig, JSONFormatterConfig } from '@/core/types/json-formatter-config';
import { defaultViewerConfig } from '@/core/types/json-viewer-config';
import { defaultJSON5Config } from '@/core/types/json5-converter-config';
import { defaultTextViewerConfig } from '@/core/types/text-viewer-config';
import { defaultDiffConfig } from '@/core/types/diff-config';
import {
    defaultTypeScriptConfig, defaultJavaConfig, defaultKotlinConfig, defaultDartConfig, defaultSwiftConfig,
    defaultGoConfig, defaultCSharpConfig, defaultPythonConfig, defaultRustConfig, defaultPHPConfig,
} from '@/core/types/code-generator-config';
import type { ToolId } from './tool-registry';

const formatterPresets: Record<'json-formatter' | 'json-minifier' | 'json-validator' | 'json-normalize', Partial<JSONFormatterConfig>> = {
    'json-formatter': {},
    'json-minifier': { pretty: false, indentation: '0', normalizeSpaces: true, normalizeLineBreaks: true },
    'json-validator': { pretty: true, indentation: '2', stripComments: false },
    'json-normalize': {
        pretty: true, indentation: '2', stripComments: true, normalizeSpaces: true, normalizeLineBreaks: true,
        removeNull: false, removeEmptyArrays: false, removeEmptyObjects: false,
    },
};

const formatter = (id: keyof typeof formatterPresets): JSONFormatterConfig => ({ ...defaultFormatterConfig, ...formatterPresets[id] });

export const toolDefaults: Record<ToolId, object> = {
    'json-formatter': formatter('json-formatter'),
    'json-minifier': formatter('json-minifier'),
    'json-validator': formatter('json-validator'),
    'json-normalize': formatter('json-normalize'),
    'json-viewer': defaultViewerConfig,
    'json-text-viewer': defaultTextViewerConfig,
    'json-json5': defaultJSON5Config,
    'json-diff': { ...defaultDiffConfig, diffStrategy: 'json-patch-6902' },
    'json-transform': {},
    'json-to-typescript': defaultTypeScriptConfig,
    'json-to-java': defaultJavaConfig,
    'json-to-kotlin': defaultKotlinConfig,
    'json-to-dart': defaultDartConfig,
    'json-to-swift': defaultSwiftConfig,
    'json-to-go': defaultGoConfig,
    'json-to-csharp': defaultCSharpConfig,
    'json-to-python': defaultPythonConfig,
    'json-to-rust': defaultRustConfig,
    'json-to-php': defaultPHPConfig,
};

export function getToolDefaults(toolId: string | null | undefined): object {
    return (toolId && toolDefaults[toolId as ToolId]) || toolDefaults['json-formatter'];
}
```

Before writing, open `src/app/config/tool-presets.ts` and confirm the `json-minifier`, `json-validator`, `json-normalize` entries match the values above exactly; if they differ, copy the file's values (the file is the source of truth).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx jest tests/app`
Expected: PASS (all tests in both files).

- [ ] **Step 6: Rewrite ConfigContext**

`src/app/context/ConfigContext.tsx`:

```tsx
"use client"

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { getToolByPath, ToolId } from '@/app/config/tool-registry';
import { getToolDefaults } from '@/app/config/tool-defaults';
import { clearToolConfig, getBrowserStorage, readToolConfig, writeToolConfig } from '@/app/lib/tool-config-storage';

interface ConfigContextType {
    toolId: ToolId | null;
    // Each tool narrows this to its own config type at the call site.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setConfig: (next: any | ((prev: any) => any)) => void;
    reset: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const toolId = (getToolByPath(pathname)?.id ?? null) as ToolId | null;

    // Server render and first client render use defaults; stored values load after mount.
    const [state, setState] = useState<{ toolId: ToolId | null; config: object }>(() => ({
        toolId,
        config: getToolDefaults(toolId),
    }));

    useEffect(() => {
        setState({ toolId, config: toolId ? readToolConfig(getBrowserStorage(), toolId, getToolDefaults(toolId)) : getToolDefaults(toolId) });
    }, [toolId]);

    // While switching tools, never expose the previous tool's config.
    const config = state.toolId === toolId ? state.config : getToolDefaults(toolId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setConfig = useCallback((next: any) => {
        setState(prev => {
            const base = prev.toolId === toolId ? prev.config : getToolDefaults(toolId);
            const value = typeof next === 'function' ? next(base) : next;
            if (toolId) writeToolConfig(getBrowserStorage(), toolId, value);
            return { toolId, config: value };
        });
    }, [toolId]);

    const reset = useCallback(() => {
        if (toolId) clearToolConfig(getBrowserStorage(), toolId);
        setState({ toolId, config: getToolDefaults(toolId) });
    }, [toolId]);

    return (
        <ConfigContext.Provider value={{ toolId, config, setConfig, reset }}>
            {children}
        </ConfigContext.Provider>
    );
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
}
```

- [ ] **Step 7: Remove runtime preset merge from `JSONToolPage.tsx`**

Delete the `toolPresets`/`toolMetadata` import, the `metadata` and `preset` constants, and the whole `// Apply preset configuration when tool loads` `useEffect`. Also delete the unused `handleCopy`, `handleDownload`, `handleClear` functions and the now-unused `toast` and `JSONFormatterConfig` imports. Change `const { config, setConfig } = useConfig();` to `const { config } = useConfig();`. Keep the `toolId` prop (still passed by pages) but prefix it: `export default function JSONToolPage(_props: JSONToolPageProps)`. The component body becomes:

```tsx
export default function JSONToolPage(_props: JSONToolPageProps) {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [formatted, setFormatted] = useState("");

    return (
        <JSONFormatter
            config={config}
            input={input}
            setInput={setInput}
            formatted={formatted}
            setFormatted={setFormatted}
        />
    );
}
```

Remove now-unused imports (`useEffect`, `toolPresets`, `toolMetadata`, `toast`, `JSONFormatterConfig`).

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit` → exit 0.
Run: `npx jest tests/app` → PASS.
Manual (dev server): on `/tools/json/formatter` set Indentation = 4 Spaces, navigate to `/tools/json/minifier` (output minified), back to formatter → still 4 Spaces after reload. DevTools → Application → localStorage shows `jph:config:json-formatter`.

- [ ] **Step 9: Commit**

```bash
git add src/app/lib/tool-config-storage.ts src/app/config/tool-defaults.ts src/app/context/ConfigContext.tsx src/app/components/JSONToolPage.tsx tests/app/tool-config-storage.test.ts tests/app/tool-registry.test.ts
git commit -m "feat(config): per-tool persisted config with reset

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Settings field primitives and per-tool settings components

**Files:**
- Create: `src/app/components/settings/fields.tsx`
- Create: `src/app/components/settings/FormatterSettings.tsx`, `Json5Settings.tsx`, `ViewerSettings.tsx`, `TextViewerSettings.tsx`, `TypeScriptSettings.tsx`, `JavaSettings.tsx`, `KotlinSettings.tsx`, `DartSettings.tsx`, `SwiftSettings.tsx`, `GoSettings.tsx`, `CSharpSettings.tsx`, `PythonSettings.tsx`, `RustSettings.tsx`, `PhpSettings.tsx`
- Create: `src/app/components/settings/index.ts`

**Interfaces:**
- Consumes: `ToolId` (Task 2); config types from `@/core/types/*`; `Select*`, `Switch`, `Input`, `Label` from `@/app/components/ui/*`.
- Produces:
  ```ts
  export interface SettingsProps<T> { config: T; update: <K extends keyof T>(key: K, value: T[K]) => void; }
  export function SettingsSection(props: { title: string; children: ReactNode }): JSX.Element;
  export function SelectField(props: { id: string; label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void; disabled?: boolean; hint?: string }): JSX.Element;
  export function SwitchField(props: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; hint?: string }): JSX.Element;
  export function TextField(props: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string }): JSX.Element;
  export function NumberField(props: { id: string; label: string; value: number; min?: number; max?: number; onChange: (v: number) => void }): JSX.Element;
  export const settingsByTool: Partial<Record<ToolId, ComponentType<SettingsProps<any>>>>;
  ```

- [ ] **Step 1: Create the field primitives**

`src/app/components/settings/fields.tsx`:

```tsx
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
                    const n = Number(e.target.value);
                    if (Number.isFinite(n)) onChange(n);
                }}
                className="h-8 text-xs bg-background border-input"
            />
        </div>
    );
}
```

- [ ] **Step 2: Formatter family settings** (options ported 1:1 from `BottomConfigurationPanel.tsx` lines 395–481; `stripComments` stays disabled as today)

`src/app/components/settings/FormatterSettings.tsx`:

```tsx
"use client"

import { JSONFormatterConfig, IndentationType, KeySorting, KeyCase, QuoteStyle } from "@/core/types/json-formatter-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function FormatterSettings({ config, update }: SettingsProps<JSONFormatterConfig>) {
    return (
        <>
            <SettingsSection title="Layout">
                <SelectField id="fmt-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as IndentationType)}
                    options={[
                        { value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' },
                        { value: 'tab', label: 'Tabs' }, { value: '0', label: 'Minify (no spaces)' },
                    ]} />
                <SelectField id="fmt-sort" label="Sort keys" value={config.keySorting}
                    onChange={(v) => update('keySorting', v as KeySorting)}
                    options={[
                        { value: 'none', label: 'None' }, { value: 'asc', label: 'Ascending (A–Z)' },
                        { value: 'desc', label: 'Descending (Z–A)' },
                    ]} />
            </SettingsSection>
            <SettingsSection title="Keys & quotes">
                <SelectField id="fmt-case" label="Key case" value={config.keyCase}
                    onChange={(v) => update('keyCase', v as KeyCase)}
                    options={[
                        { value: 'none', label: 'Original' }, { value: 'camelCase', label: 'camelCase' },
                        { value: 'PascalCase', label: 'PascalCase' }, { value: 'snake_case', label: 'snake_case' },
                        { value: 'kebab-case', label: 'kebab-case' },
                    ]} />
                <SelectField id="fmt-quote" label="Quote style" value={config.quoteStyle}
                    onChange={(v) => update('quoteStyle', v as QuoteStyle)}
                    options={[{ value: 'double', label: 'Double (")' }, { value: 'single', label: "Single (')" }]} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="fmt-comments" label="Keep comments" checked={config.stripComments}
                    onChange={(v) => update('stripComments', v)} disabled hint="Comment handling follows the input format." />
                <SwitchField id="fmt-nulls" label="Remove null values" checked={config.removeNull}
                    onChange={(v) => update('removeNull', v)} />
                <SwitchField id="fmt-trailing" label="Trailing commas" checked={config.trailingCommas}
                    onChange={(v) => update('trailingCommas', v)} />
            </SettingsSection>
        </>
    );
}
```

Before writing, check the exported type names in `src/core/types/json-formatter-config.ts` (`IndentationType`, `KeySorting`, `KeyCase`, `QuoteStyle` are imported by `BottomConfigurationPanel.tsx` today, so they exist). If `indentation` does not accept `'0'`, cast with `as JSONFormatterConfig['indentation']`.

- [ ] **Step 3: JSON5 settings** (port of lines 484–548; disabled flags preserved)

`src/app/components/settings/Json5Settings.tsx`:

```tsx
"use client"

import { JSON5ConverterConfig } from "@/core/types/json5-converter-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function Json5Settings({ config, update }: SettingsProps<JSON5ConverterConfig>) {
    return (
        <>
            <SettingsSection title="Layout">
                <SelectField id="j5-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as JSON5ConverterConfig['indentation'])}
                    options={[{ value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tabs' }]} />
                <SelectField id="j5-case" label="Key case" value={config.keyCase}
                    onChange={(v) => update('keyCase', v as JSON5ConverterConfig['keyCase'])}
                    options={[
                        { value: 'none', label: 'Original' }, { value: 'camelCase', label: 'camelCase' },
                        { value: 'PascalCase', label: 'PascalCase' }, { value: 'snake_case', label: 'snake_case' },
                        { value: 'kebab-case', label: 'kebab-case' },
                    ]} />
            </SettingsSection>
            <SettingsSection title="JSON5 syntax">
                <SelectField id="j5-quotes" label="Quotes" value={config.quoteStyle} disabled
                    onChange={(v) => update('quoteStyle', v as JSON5ConverterConfig['quoteStyle'])}
                    options={[{ value: 'single', label: "Single (')" }, { value: 'double', label: 'Double (")' }]} />
                <SwitchField id="j5-comments" label="Strip comments" checked={config.stripComments}
                    onChange={(v) => update('stripComments', v)} />
                <SwitchField id="j5-trailing" label="Trailing commas" checked={config.trailingCommas} disabled
                    onChange={(v) => update('trailingCommas', v)} />
                <SwitchField id="j5-unquoted" label="Unquoted keys" checked={config.unquotedKeys} disabled
                    onChange={(v) => update('unquotedKeys', v)} />
            </SettingsSection>
        </>
    );
}
```

- [ ] **Step 4: Viewer and Text Viewer settings**

`src/app/components/settings/ViewerSettings.tsx` (ports `TreeSettings.tsx` options + expand depth):

```tsx
"use client"

import { JsonTreeViewerConfig, IndentationType } from "@/core/types/json-viewer-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, NumberField } from "./fields";

export default function ViewerSettings({ config, update }: SettingsProps<JsonTreeViewerConfig>) {
    return (
        <>
            <SettingsSection title="Tree">
                <SelectField id="tv-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as IndentationType)}
                    options={[{ value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tab' }]} />
                <NumberField id="tv-depth" label="Auto-expand depth" value={config.autoExpandDepth} min={0} max={100}
                    onChange={(v) => update('autoExpandDepth', v)} />
            </SettingsSection>
            <SettingsSection title="Display">
                <SwitchField id="tv-types" label="Show data types" checked={config.showDataTypes} onChange={(v) => update('showDataTypes', v)} />
                <SwitchField id="tv-counts" label="Show item counts" checked={config.showItemCounts} onChange={(v) => update('showItemCounts', v)} />
                <SwitchField id="tv-brackets" label="Show brackets" checked={config.showBrackets} onChange={(v) => update('showBrackets', v)} />
                <SwitchField id="tv-commas" label="Show commas" checked={config.showCommas} onChange={(v) => update('showCommas', v)} />
            </SettingsSection>
        </>
    );
}
```

`src/app/components/settings/TextViewerSettings.tsx`:

```tsx
"use client"

import { TextViewerConfig } from "@/core/types/text-viewer-config";
import { SettingsProps, SettingsSection, SwitchField, NumberField } from "./fields";

export default function TextViewerSettings({ config, update }: SettingsProps<TextViewerConfig>) {
    return (
        <>
            <SettingsSection title="Detection">
                <NumberField id="txt-threshold" label="Text length threshold" value={config.textThreshold} min={1} max={10000}
                    onChange={(v) => update('textThreshold', v)} />
            </SettingsSection>
            <SettingsSection title="Display">
                <SwitchField id="txt-md" label="Markdown document view" checked={config.markdownMode} onChange={(v) => update('markdownMode', v)} />
                <SwitchField id="txt-collapse" label="Collapse long cells" checked={config.collapsedMaxHeight} onChange={(v) => update('collapsedMaxHeight', v)} />
            </SettingsSection>
        </>
    );
}
```

- [ ] **Step 5: Code generator settings** (ports of lines 50–387, same keys/values/labels)

`TypeScriptSettings.tsx`:

```tsx
"use client"

import { TypeScriptConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField } from "./fields";

export default function TypeScriptSettings({ config, update }: SettingsProps<TypeScriptConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="ts-kind" label="Type kind" value={config.typeKind}
                onChange={(v) => update('typeKind', v as TypeScriptConfig['typeKind'])}
                options={[{ value: 'interface', label: 'Interface' }, { value: 'type', label: 'Type alias' }]} />
            <SelectField id="ts-runtime" label="Runtime check" value={config.runtimeTypecheck}
                onChange={(v) => update('runtimeTypecheck', v as TypeScriptConfig['runtimeTypecheck'])}
                options={[{ value: 'none', label: 'None' }, { value: 'zod', label: 'Zod schema' }]} />
        </SettingsSection>
    );
}
```

`JavaSettings.tsx`:

```tsx
"use client"

import { JavaConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, TextField } from "./fields";

export default function JavaSettings({ config, update }: SettingsProps<JavaConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="java-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Types">
                <SelectField id="java-array" label="Array type" value={config.arrayType}
                    onChange={(v) => update('arrayType', v as JavaConfig['arrayType'])}
                    options={[{ value: 'list', label: 'List<T>' }, { value: 'array', label: 'Array []' }]} />
                <SwitchField id="java-getters" label="Getters & setters" checked={config.useGettersSetters} onChange={(v) => update('useGettersSetters', v)} />
                <SwitchField id="java-bigdec" label="Use BigDecimal" checked={config.useBigDecimal} onChange={(v) => update('useBigDecimal', v)} />
            </SettingsSection>
        </>
    );
}
```

`KotlinSettings.tsx`:

```tsx
"use client"

import { KotlinConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, TextField } from "./fields";

export default function KotlinSettings({ config, update }: SettingsProps<KotlinConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="kt-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SelectField id="kt-fw" label="Framework" value={config.framework}
                    onChange={(v) => update('framework', v as KotlinConfig['framework'])}
                    options={[{ value: 'none', label: 'None' }, { value: 'kotlinx', label: 'Kotlinx Serialization' }, { value: 'jackson', label: 'Jackson' }]} />
                <SwitchField id="kt-data" label="Data classes" checked={config.useDataClasses} onChange={(v) => update('useDataClasses', v)} />
            </SettingsSection>
        </>
    );
}
```

`DartSettings.tsx`:

```tsx
"use client"

import { DartConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField } from "./fields";

export default function DartSettings({ config, update }: SettingsProps<DartConfig>) {
    return (
        <SettingsSection title="Output">
            <SwitchField id="dart-null" label="Null safety" checked={config.nullSafety} onChange={(v) => update('nullSafety', v)} />
            <SwitchField id="dart-freezed" label="Use Freezed" checked={config.useFreezed} onChange={(v) => update('useFreezed', v)} />
            <SwitchField id="dart-serial" label="JSON Serializable" checked={config.useJsonSerializable} onChange={(v) => update('useJsonSerializable', v)} />
        </SettingsSection>
    );
}
```

`SwiftSettings.tsx`:

```tsx
"use client"

import { SwiftConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function SwiftSettings({ config, update }: SettingsProps<SwiftConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="swift-kind" label="Type kind" value={config.typeKind}
                onChange={(v) => update('typeKind', v as SwiftConfig['typeKind'])}
                options={[{ value: 'struct', label: 'Struct' }, { value: 'class', label: 'Class' }]} />
            <SelectField id="swift-access" label="Access level" value={config.accessLevel}
                onChange={(v) => update('accessLevel', v as SwiftConfig['accessLevel'])}
                options={[{ value: 'public', label: 'Public' }, { value: 'internal', label: 'Internal' }]} />
            <SwitchField id="swift-codable" label="Codable protocol" checked={config.useCodable} onChange={(v) => update('useCodable', v)} />
        </SettingsSection>
    );
}
```

`GoSettings.tsx`:

```tsx
"use client"

import { GoConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function GoSettings({ config, update }: SettingsProps<GoConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="go-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Tags">
                <SwitchField id="go-omit" label="omitempty" checked={config.useOmitEmpty} onChange={(v) => update('useOmitEmpty', v)} />
            </SettingsSection>
        </>
    );
}
```

`CSharpSettings.tsx`:

```tsx
"use client"

import { CSharpConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function CSharpSettings({ config, update }: SettingsProps<CSharpConfig>) {
    return (
        <>
            <SettingsSection title="Types">
                <SelectField id="cs-kind" label="Output type" value={config.recordType}
                    onChange={(v) => update('recordType', v as CSharpConfig['recordType'])}
                    options={[{ value: 'record', label: 'Records' }, { value: 'class', label: 'Classes' }, { value: 'struct', label: 'Structs' }]} />
                <SelectField id="cs-access" label="Access level" value={config.accessLevel}
                    onChange={(v) => update('accessLevel', v as CSharpConfig['accessLevel'])}
                    options={[{ value: 'public', label: 'public' }, { value: 'internal', label: 'internal' }]} />
                <SwitchField id="cs-nullable" label="Nullable reference types" checked={config.nullable} onChange={(v) => update('nullable', v)} />
            </SettingsSection>
            <SettingsSection title="Serializer">
                <SwitchField id="cs-stj" label="System.Text.Json attributes" checked={config.systemTextJson}
                    onChange={(v) => update('systemTextJson', v)} hint="Off = Newtonsoft.Json attributes." />
            </SettingsSection>
        </>
    );
}
```

`PythonSettings.tsx`:

```tsx
"use client"

import { PythonConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function PythonSettings({ config, update }: SettingsProps<PythonConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="py-ver" label="Python version" value={config.pythonVersion}
                onChange={(v) => update('pythonVersion', v as PythonConfig['pythonVersion'])}
                options={[{ value: '3.10+', label: '3.10+' }, { value: '3.9', label: '3.9' }, { value: '3.8', label: '3.8' }]} />
            <SelectField id="py-class" label="Class type" value={config.classType}
                onChange={(v) => update('classType', v as PythonConfig['classType'])}
                options={[{ value: 'dataclasses', label: 'Dataclasses' }, { value: 'attrs', label: 'Attrs' }, { value: 'plain', label: 'Plain class' }]} />
            <SwitchField id="py-hints" label="Type hints" checked={config.useTypeHints} onChange={(v) => update('useTypeHints', v)} />
        </SettingsSection>
    );
}
```

`RustSettings.tsx`:

```tsx
"use client"

import { RustConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function RustSettings({ config, update }: SettingsProps<RustConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="rs-vis" label="Visibility" value={config.visibility}
                onChange={(v) => update('visibility', v as RustConfig['visibility'])}
                options={[{ value: 'public', label: 'pub' }, { value: 'crate', label: 'pub(crate)' }, { value: 'private', label: 'private' }]} />
            <SwitchField id="rs-debug" label="Derive Debug" checked={config.deriveDebug} onChange={(v) => update('deriveDebug', v)} />
            <SwitchField id="rs-clone" label="Derive Clone" checked={config.deriveClone} onChange={(v) => update('deriveClone', v)} />
        </SettingsSection>
    );
}
```

`PhpSettings.tsx`:

```tsx
"use client"

import { PHPConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function PhpSettings({ config, update }: SettingsProps<PHPConfig>) {
    return (
        <>
            <SettingsSection title="Namespace">
                <TextField id="php-ns" label="Namespace" value={config.namespace} onChange={(v) => update('namespace', v)} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="php-strict" label="Strict types" checked={config.strictTypes} onChange={(v) => update('strictTypes', v)} />
                <SwitchField id="php-getters" label="Getters / setters" checked={config.useGettersSetters} onChange={(v) => update('useGettersSetters', v)} />
            </SettingsSection>
        </>
    );
}
```

- [ ] **Step 6: Settings map**

`src/app/components/settings/index.ts`:

```ts
import type { ComponentType } from "react";
import type { ToolId } from "@/app/config/tool-registry";
import type { SettingsProps } from "./fields";
import FormatterSettings from "./FormatterSettings";
import Json5Settings from "./Json5Settings";
import ViewerSettings from "./ViewerSettings";
import TextViewerSettings from "./TextViewerSettings";
import TypeScriptSettings from "./TypeScriptSettings";
import JavaSettings from "./JavaSettings";
import KotlinSettings from "./KotlinSettings";
import DartSettings from "./DartSettings";
import SwiftSettings from "./SwiftSettings";
import GoSettings from "./GoSettings";
import CSharpSettings from "./CSharpSettings";
import PythonSettings from "./PythonSettings";
import RustSettings from "./RustSettings";
import PhpSettings from "./PhpSettings";

// Diff and Transform currently expose no user settings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const settingsByTool: Partial<Record<ToolId, ComponentType<SettingsProps<any>>>> = {
    'json-formatter': FormatterSettings,
    'json-minifier': FormatterSettings,
    'json-validator': FormatterSettings,
    'json-normalize': FormatterSettings,
    'json-json5': Json5Settings,
    'json-viewer': ViewerSettings,
    'json-text-viewer': TextViewerSettings,
    'json-to-typescript': TypeScriptSettings,
    'json-to-java': JavaSettings,
    'json-to-kotlin': KotlinSettings,
    'json-to-dart': DartSettings,
    'json-to-swift': SwiftSettings,
    'json-to-go': GoSettings,
    'json-to-csharp': CSharpSettings,
    'json-to-python': PythonSettings,
    'json-to-rust': RustSettings,
    'json-to-php': PhpSettings,
};
```

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit`
Expected: exit 0. If a config field name differs from `BottomConfigurationPanel.tsx` usage, the compiler reports it — fix using the name in `src/core/types/code-generator-config.ts`.

- [ ] **Step 8: Commit**

```bash
git add src/app/components/settings
git commit -m "feat(settings): per-tool settings components on shared fields

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: App shell — header, sidebar, search, tools layout

**Files:**
- Create: `src/app/components/shell/ShellContext.tsx`, `AppHeader.tsx`, `ToolSidebar.tsx`, `ToolSearch.tsx`
- Rewrite: `src/app/tools/ToolsLayoutClient.tsx`
- Modify: `src/app/layout.tsx` (remove `ModeProvider`), `src/app/components/Footer.tsx` (Blog link)
- Delete: `src/app/components/Header.tsx`, `src/app/context/ModeContext.tsx`

**Interfaces:**
- Consumes: `getVisibleTools`, `toolGroups`, `getToolByPath`, `ToolDef` (Task 2); `ConfigProvider` (Task 3).
- Produces:
  ```ts
  export function ShellProvider({ children }): JSX.Element;
  export function useShell(): { drawerOpen: boolean; setDrawerOpen: (v: boolean) => void };
  export default function AppHeader({ showMenuButton }: { showMenuButton?: boolean }): JSX.Element;
  export default function ToolSidebar(): JSX.Element;
  export default function ToolSearch(): JSX.Element;   // renders its own trigger button
  ```

- [ ] **Step 1: Find remaining `useMode` consumers**

Run: `grep -rn "useMode\|ModeProvider\|ModeContext" src`
Expected: only `Header.tsx`, `BottomConfigurationPanel.tsx`, `layout.tsx`, `ModeContext.tsx`. `BottomConfigurationPanel.tsx` is deleted in Task 6; until then, in that file replace `const { mode } = useMode();` with `const mode = 'all' as string;` and delete its `useMode` import so the build keeps passing.

- [ ] **Step 2: ShellContext**

`src/app/components/shell/ShellContext.tsx`:

```tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react";

const ShellContext = createContext<{ drawerOpen: boolean; setDrawerOpen: (v: boolean) => void } | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return <ShellContext.Provider value={{ drawerOpen, setDrawerOpen }}>{children}</ShellContext.Provider>;
}

export function useShell() {
    const ctx = useContext(ShellContext);
    // Pages outside the tools shell (home, blog) have no drawer.
    return ctx ?? { drawerOpen: false, setDrawerOpen: () => {} };
}
```

- [ ] **Step 3: ToolSearch**

`src/app/components/shell/ToolSearch.tsx`:

```tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getVisibleTools, toolGroups } from "@/app/config/tool-registry";

export default function ToolSearch() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const all = getVisibleTools();
        if (!q) return all;
        return all.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.tagline.toLowerCase().includes(q) ||
            t.keywords.some(k => k.includes(q)));
    }, [query]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActive(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    const go = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex h-8 w-full max-w-[320px] items-center gap-2 rounded-md border border-border bg-muted/60 px-3 text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                aria-label="Search tools"
            >
                <Search className="size-3.5" />
                <span className="hidden sm:inline">Search tools…</span>
                <kbd className="ml-auto hidden sm:inline rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
            </button>

            {open && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
                    <div
                        role="dialog"
                        aria-label="Search tools"
                        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2 border-b border-border px-3">
                            <Search className="size-4 text-muted-foreground" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setOpen(false);
                                    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
                                    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
                                    if (e.key === 'Enter' && results[active]) go(results[active].path);
                                }}
                                placeholder="Search tools…"
                                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <ul className="max-h-[50vh] overflow-y-auto p-1 scroll-thin">
                            {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No tools found</li>}
                            {results.map((t, i) => {
                                const Icon = t.icon;
                                return (
                                    <li key={t.id}>
                                        <button
                                            type="button"
                                            onMouseEnter={() => setActive(i)}
                                            onClick={() => go(t.path)}
                                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left ${i === active ? 'bg-accent text-foreground' : 'text-muted-foreground'}`}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span className="flex min-w-0 flex-col">
                                                <span className="text-sm text-foreground">{t.name}</span>
                                                <span className="truncate text-xs">{t.tagline}</span>
                                            </span>
                                            <span className="ml-auto text-[10px] uppercase tracking-wide">
                                                {toolGroups.find(g => g.id === t.group)?.name}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}
```

- [ ] **Step 4: AppHeader**

`src/app/components/shell/AppHeader.tsx`:

```tsx
"use client"

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun, BookOpen } from "lucide-react";
import ToolSearch from "./ToolSearch";
import { useShell } from "./ShellContext";

const VSCODE_URL = "https://marketplace.visualstudio.com/search?term=JSON%20PowerHouse&target=VSCode";

export default function AppHeader({ showMenuButton = false }: { showMenuButton?: boolean }) {
    const { resolvedTheme, setTheme } = useTheme();
    const { setDrawerOpen } = useShell();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 sm:px-4">
            {showMenuButton && (
                <button type="button" onClick={() => setDrawerOpen(true)} className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Open tool menu">
                    <Menu className="size-5" />
                </button>
            )}
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="JSON PowerHouse home">
                <Image src="/JSON-PowerHouse-Logo.png" alt="" width={84} height={28} className="h-7 w-auto" priority />
            </Link>
            <div className="flex flex-1 justify-center px-2">
                <ToolSearch />
            </div>
            <nav className="flex items-center gap-1">
                <Link href="/blog" className="hidden sm:flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                    <BookOpen className="size-4" /> Blog
                </Link>
                <a href={VSCODE_URL} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                    VS Code
                </a>
                <button
                    type="button"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="Toggle theme"
                >
                    {mounted && resolvedTheme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                </button>
            </nav>
        </header>
    );
}
```

Before writing, check `extension/package.json` for `publisher` and `name`; if both exist, set `VSCODE_URL` to `https://marketplace.visualstudio.com/items?itemName=<publisher>.<name>` instead of the search URL.

- [ ] **Step 5: ToolSidebar**

`src/app/components/shell/ToolSidebar.tsx`:

```tsx
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { getVisibleTools, toolGroups, getToolByPath } from "@/app/config/tool-registry";
import { useShell } from "./ShellContext";

const COLLAPSE_KEY = "jph:sidebar-collapsed";

function readCollapsed(): boolean {
    try { return localStorage.getItem(COLLAPSE_KEY) === "1"; } catch { return false; }
}

function ToolNav({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
    const pathname = usePathname();
    const activeId = getToolByPath(pathname)?.id;
    return (
        <nav aria-label="Tools" className="flex flex-col gap-4 py-3">
            {toolGroups.map(group => (
                <div key={group.id} className="flex flex-col gap-0.5 px-2">
                    {!collapsed && (
                        <h2 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group.name}</h2>
                    )}
                    {getVisibleTools(group.id).map(tool => {
                        const Icon = tool.icon;
                        const active = tool.id === activeId;
                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                onClick={onNavigate}
                                title={collapsed ? tool.name : undefined}
                                aria-current={active ? "page" : undefined}
                                className={`group flex h-8 items-center gap-2.5 rounded-md px-2 text-sm transition-colors ${collapsed ? 'justify-center' : ''} ${
                                    active
                                        ? 'bg-primary/12 text-primary font-medium'
                                        : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                                }`}
                            >
                                <Icon className="size-4 shrink-0" />
                                {!collapsed && <span className="truncate">{tool.shortName}</span>}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}

export default function ToolSidebar() {
    const { drawerOpen, setDrawerOpen } = useShell();
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => setCollapsed(readCollapsed()), []);
    useEffect(() => setDrawerOpen(false), [pathname, setDrawerOpen]);

    const toggle = () => {
        setCollapsed(c => {
            try { localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1"); } catch { /* ignore */ }
            return !c;
        });
    };

    return (
        <>
            {/* Desktop rail */}
            <aside
                className={`sticky top-12 hidden h-[calc(100dvh-48px)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex transition-[width] duration-200 ${collapsed ? 'w-14' : 'w-56'}`}
            >
                <div className="flex-1 overflow-y-auto scroll-thin">
                    <ToolNav collapsed={collapsed} />
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="flex h-10 items-center gap-2 border-t border-sidebar-border px-4 text-xs text-muted-foreground hover:text-foreground"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <PanelLeftOpen className="size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}
                </button>
            </aside>

            {/* Mobile drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-label="Tools">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
                    <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar shadow-2xl">
                        <div className="flex h-12 items-center justify-between border-b border-sidebar-border px-4">
                            <span className="text-sm font-semibold">Tools</span>
                            <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent" aria-label="Close tool menu">
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto scroll-thin">
                            <ToolNav collapsed={false} onNavigate={() => setDrawerOpen(false)} />
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
```

`bg-primary/12` requires Tailwind v4 arbitrary opacity steps — supported. If it does not render, use `bg-primary/10`.

- [ ] **Step 6: Tools layout**

`src/app/tools/ToolsLayoutClient.tsx`:

```tsx
"use client";

import { ConfigProvider } from "@/app/context/ConfigContext";
import { ShellProvider } from "@/app/components/shell/ShellContext";
import AppHeader from "@/app/components/shell/AppHeader";
import ToolSidebar from "@/app/components/shell/ToolSidebar";
import Footer from "@/app/components/Footer";

export default function ToolsLayoutClient({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider>
            <ShellProvider>
                <div className="min-h-dvh bg-background text-foreground">
                    <AppHeader showMenuButton />
                    <div className="flex">
                        <ToolSidebar />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <main className="min-w-0 flex-1">{children}</main>
                            <Footer />
                        </div>
                    </div>
                </div>
            </ShellProvider>
        </ConfigProvider>
    );
}
```

- [ ] **Step 7: Remove ModeProvider and the old header**

In `src/app/layout.tsx` delete the `ModeProvider` import and unwrap its children (keep `AlertService`, `children`, `Toaster`, analytics inside `ThemeProvider`).

Run: `git rm src/app/components/Header.tsx src/app/context/ModeContext.tsx`

In `src/app/components/Footer.tsx`, add a Blog link before the About link, using the same `className` as the About `Link`:

```tsx
<Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
    Blog
</Link>
```

Run: `grep -rn "components/Header\|useMode\|ModeContext" src` → no output (home/about/privacy/terms pages may import `Header`; if they do, replace with `import AppHeader from "@/app/components/shell/AppHeader"` and `<AppHeader />`).

- [ ] **Step 8: Verify**

Run: `npx tsc --noEmit` → exit 0.
Manual (dev server, 1440px): header 48px with search/blog/theme; sidebar shows JSON Tools (8) and Code Generators (9), active item highlighted; collapse persists across reload; Ctrl+K opens search, typing "c#" + Enter navigates to C#; theme toggle switches light/dark. At 375px: hamburger opens drawer, selecting a tool closes it. The old bottom panel still renders inside tools at this point — expected until Task 6.

- [ ] **Step 9: Commit**

```bash
git add src/app/components/shell src/app/tools/ToolsLayoutClient.tsx src/app/layout.tsx src/app/components/Footer.tsx src/app/components/BottomConfigurationPanel.tsx
git add -u src/app/components/Header.tsx src/app/context/ModeContext.tsx
git commit -m "feat(shell): header, tool sidebar and Ctrl+K search

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Also `git add` any home/about/privacy/terms files changed in Step 7.)

---

### Task 6: ToolWorkspace + SettingsPanel; remove bottom panel

**Files:**
- Create: `src/app/components/shell/ToolWorkspace.tsx`, `SettingsPanel.tsx`
- Modify: `src/app/components/CodeGeneratorBase.tsx`, `src/app/tools/json/formatter/JSONFormatter.tsx`, `src/app/tools/json/viewer/components/JsonTreeViewer.tsx`, `src/app/tools/json/diff/components/JsonDiffViewer.tsx`, `src/app/tools/json/diff/components/UnifiedJsonDiffMerge.tsx`, `src/app/tools/json/json5/client.tsx` (remove `BottomConfigurationPanel` embeds; remove "initialize config if missing" effects)
- Modify: every `src/app/tools/**/page.tsx` (wrap client in `ToolWorkspace`)
- Delete: `src/app/components/BottomConfigurationPanel.tsx`, `src/app/config/tools-config.ts`, `src/app/config/tool-presets.ts`, `src/app/tools/json/viewer/components/TreeSettings.tsx`

**Interfaces:**
- Consumes: `useConfig()` (Task 3), `settingsByTool` (Task 4), `getToolById` (Task 2).
- Produces:
  ```ts
  export default function ToolWorkspace({ toolId, children }: { toolId: ToolId; children: ReactNode }): JSX.Element;
  export default function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }): JSX.Element | null;
  ```
  Contract for tool clients: the root element rendered inside `ToolWorkspace` must fill its parent (`h-full min-h-0 flex …`), not size itself to the viewport.

- [ ] **Step 1: SettingsPanel**

`src/app/components/shell/SettingsPanel.tsx`:

```tsx
"use client"

import { RotateCcw, X } from "lucide-react";
import { useConfig } from "@/app/context/ConfigContext";
import { settingsByTool } from "@/app/components/settings";

export default function SettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { toolId, config, setConfig, reset } = useConfig();
    const Settings = toolId ? settingsByTool[toolId] : undefined;
    if (!Settings || !open) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = (key: any, value: any) => setConfig((prev: any) => ({ ...prev, [key]: value }));

    const body = (
        <>
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Settings</span>
                <button type="button" onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Close settings">
                    <X className="size-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 scroll-thin">
                <Settings config={config} update={update} />
            </div>
            <div className="flex h-11 shrink-0 items-center justify-between border-t border-border px-4">
                <span className="text-[11px] text-muted-foreground">Saved for this tool</span>
                <button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                    <RotateCcw className="size-3.5" /> Reset to defaults
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop column */}
            <aside className="hidden w-72 shrink-0 flex-col border-l border-border bg-card lg:flex" aria-label="Tool settings">
                {body}
            </aside>
            {/* Mobile / tablet bottom sheet */}
            <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-label="Tool settings">
                <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                <div className="absolute inset-x-0 bottom-0 flex max-h-[75dvh] flex-col rounded-t-xl border-t border-border bg-card shadow-2xl">
                    {body}
                </div>
            </div>
        </>
    );
}
```

Note: on `lg+` the fixed overlay is hidden by `lg:hidden`; below `lg` the desktop column is hidden. The panel defaults to open on desktop and closed on mobile (Step 2).

- [ ] **Step 2: ToolWorkspace**

`src/app/components/shell/ToolWorkspace.tsx`:

```tsx
"use client"

import { ReactNode, useEffect, useState } from "react";
import { Settings2 } from "lucide-react";
import { getToolById, ToolId } from "@/app/config/tool-registry";
import { settingsByTool } from "@/app/components/settings";
import SettingsPanel from "./SettingsPanel";

const OPEN_KEY = "jph:settings-open";

export default function ToolWorkspace({ toolId, children }: { toolId: ToolId; children: ReactNode }) {
    const tool = getToolById(toolId);
    const hasSettings = Boolean(settingsByTool[toolId]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 1024px)").matches;
        let stored: string | null = null;
        try { stored = localStorage.getItem(OPEN_KEY); } catch { /* ignore */ }
        setOpen(desktop ? stored !== "0" : false);
    }, []);

    const setPersisted = (v: boolean) => {
        setOpen(v);
        if (window.matchMedia("(min-width: 1024px)").matches) {
            try { localStorage.setItem(OPEN_KEY, v ? "1" : "0"); } catch { /* ignore */ }
        }
    };

    if (!tool) return <>{children}</>;
    const Icon = tool.icon;

    return (
        <section className="flex h-auto min-h-[520px] flex-col border-b border-border md:h-[calc(100dvh-48px)]" aria-label={tool.name}>
            <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4">
                <Icon className="size-4 text-primary" />
                <h1 className="text-sm font-semibold text-foreground">{tool.name}</h1>
                <p className="hidden truncate text-xs text-muted-foreground md:block">{tool.tagline}</p>
                {hasSettings && (
                    <button
                        type="button"
                        onClick={() => setPersisted(!open)}
                        aria-pressed={open}
                        className={`ml-auto flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors ${open ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    >
                        <Settings2 className="size-4" /> Settings
                    </button>
                )}
            </div>
            <div className="flex min-h-0 flex-1">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
                {hasSettings && <SettingsPanel open={open} onClose={() => setPersisted(false)} />}
            </div>
        </section>
    );
}
```

- [ ] **Step 3: Remove embedded bottom panels**

In each file below, delete the `import BottomConfigurationPanel …` line and the `<BottomConfigurationPanel />` element:
- `src/app/components/CodeGeneratorBase.tsx` (line ~222)
- `src/app/tools/json/formatter/JSONFormatter.tsx`
- `src/app/tools/json/viewer/components/JsonTreeViewer.tsx` (line ~251)
- `src/app/tools/json/diff/components/JsonDiffViewer.tsx` (line ~496)
- `src/app/tools/json/diff/components/UnifiedJsonDiffMerge.tsx` (line ~1255)
- `src/app/tools/json/json5/client.tsx` and `src/app/tools/json/transform/client.tsx` (if present)

Run afterwards: `grep -rn "BottomConfigurationPanel" src` → only the file itself.

Also delete the config-initialization effects, which are now redundant because the provider always supplies that tool's defaults:
- `JsonTreeViewer.tsx` lines ~38–45 (`if (!('showDataTypes' in config)) …` effect).
- `json5/client.tsx` lines ~28–33 (`if (!('useJSON5' in config)) …` effect).
- `TextViewer.tsx` line 171: change to `const viewerConfig = config as TextViewerConfig;` and remove the `defaultTextViewerConfig` import if unused.
- `JsonDiffViewer.tsx` line 19: keep `|| defaultDiffConfig` (harmless).

- [ ] **Step 4: Make tool roots fill the workspace**

Each tool's root element currently sizes itself (`flex-1 … overflow-hidden` inside a `calc(100vh-…)` wrapper). Change only the root element's className, keeping inner markup:
- `JSONFormatter.tsx` line 163: `<main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">` → `<div className="flex h-full min-h-0 w-full flex-col md:flex-row">` (and its closing `</main>` → `</div>`; a page must have a single `<main>`, which the layout now provides).
- `CodeGeneratorBase.tsx` line 90: `<main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden w-full">` → `<div className="flex h-full min-h-0 w-full flex-col md:flex-row">` (closing tag too).
- In both, the input `<section>` and output `<section>` get `md:w-1/2 flex-1 min-h-[45vh] md:min-h-0` (drop the `lg:w-[40%] lg:flex-[0.7]` / `lg:w-[60%] lg:flex-[1.3]` split so both panes are equal) and `border-b md:border-b-0 md:border-r border-border` on the input section.
- For `JsonTreeViewer.tsx`, `JsonDiffViewer.tsx`, `UnifiedJsonDiffMerge.tsx`, json5 `client.tsx`, transform `client.tsx`, `TextViewer.tsx`, normalize `client.tsx`: open each, find the outermost returned element, replace any `h-screen`, `h-[calc(100vh…)]`, `min-h-screen` or `<main>` with `<div className="flex h-full min-h-0 w-full flex-col …existing-layout-classes">`; keep other classes.

- [ ] **Step 5: Update every page.tsx**

For each page, replace the wrapper `<div className="lg:h-[calc(100vh-48px)] md:h-[calc(100vh-130px)] w-full relative flex flex-col">` with `<ToolWorkspace toolId="…">` around the client only, and move `<SeoAccordion … />` **outside** the workspace (it is replaced in Task 8). Example — `src/app/tools/json/formatter/page.tsx`:

```tsx
import ToolWorkspace from "@/app/components/shell/ToolWorkspace";
// …existing imports and metadata unchanged…

export default function JSONFormatterPage() {
    return (
        <>
            <JsonLd data={{ /* unchanged */ }} />
            <ToolWorkspace toolId="json-formatter">
                <JSONToolPage toolId="json-formatter" />
            </ToolWorkspace>
            <SeoAccordion /* unchanged props */ />
        </>
    );
}
```

Page → toolId mapping (path → id is the registry's): formatter `json-formatter`, minifier `json-minifier`, validator `json-validator`, normalize `json-normalize`, viewer `json-viewer`, text-viewer `json-text-viewer`, json5 `json-json5`, diff `json-diff`, transform `json-transform`, and `code/json-to-<lang>` → `json-to-<lang>` for typescript, java, kotlin, dart, swift, go, csharp, python, rust, php.

Run: `grep -rln "calc(100vh" src/app/tools` → no output.

- [ ] **Step 6: Delete replaced files**

```bash
git rm src/app/components/BottomConfigurationPanel.tsx src/app/config/tools-config.ts src/app/config/tool-presets.ts src/app/tools/json/viewer/components/TreeSettings.tsx
```

Run: `grep -rn "tools-config\|tool-presets\|TreeSettings" src` → no output. If `src/app/page.tsx` or `JSONToolPage.tsx` still imports `tools-config`/`tool-presets`, switch it to `tool-registry`/`tool-defaults`.

- [ ] **Step 7: Verify**

Run: `npx tsc --noEmit` → exit 0. Run: `npx jest tests/app` → PASS.
Manual (1440px): every tool in the sidebar loads; input/output panes equal height and fill the workspace; Settings button toggles right panel; changing Formatter indentation updates output immediately; C# "Output type" change regenerates code; reload keeps settings; Formatter settings don't appear on C#. Diff and Transform show no Settings button. At 375px: Settings opens a bottom sheet; editors stack.

- [ ] **Step 8: Commit**

```bash
git add src/app/components/shell src/app/components/CodeGeneratorBase.tsx src/app/tools src/app/components/JSONToolPage.tsx
git add -u src/app/components/BottomConfigurationPanel.tsx src/app/config src/app/tools/json/viewer/components/TreeSettings.tsx
git commit -m "feat(shell): tool workspace with right settings panel; remove bottom panel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: EditorPane chrome, lucide icons, Monaco theme

**Files:**
- Create: `src/app/components/shell/EditorPane.tsx`, `src/app/components/shell/PaneButton.tsx`
- Modify: `JSONFormatter.tsx`, `CodeGeneratorBase.tsx`, `CodeEditor.tsx`, `DiagnosticsPanel.tsx`, and every file listed by `grep -rln "material-symbols-outlined" src`
- Modify: `src/app/layout.tsx` (remove Material Symbols `<link>`)

**Interfaces:**
- Produces:
  ```ts
  export default function EditorPane(props: { label: string; status?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }): JSX.Element;
  export default function PaneButton(props: { icon: LucideIcon; label: string; onClick: () => void; variant?: 'default' | 'primary' | 'danger'; disabled?: boolean; hideLabelOnMobile?: boolean }): JSX.Element;
  ```

- [ ] **Step 1: PaneButton + EditorPane**

`src/app/components/shell/PaneButton.tsx`:

```tsx
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
```

`src/app/components/shell/EditorPane.tsx`:

```tsx
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
```

Status badges use one shared style — add to `EditorPane.tsx`:

```tsx
export function StatusBadge({ tone, children }: { tone: 'ok' | 'warn' | 'error'; children: ReactNode }) {
    const tones = {
        ok: "text-success bg-success/10 border-success/20",
        warn: "text-warning bg-warning/10 border-warning/20",
        error: "text-destructive bg-destructive/10 border-destructive/20",
    };
    return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${tones[tone]}`}>{children}</span>;
}
```

- [ ] **Step 2: Adopt EditorPane in JSONFormatter and CodeGeneratorBase**

In `JSONFormatter.tsx`, replace the input `<section>` (header `div` with "Input Editor" + buttons, and body) with:

```tsx
<EditorPane
    label="Input"
    className="md:border-r border-border min-h-[45vh] md:min-h-0"
    status={error
        ? <StatusBadge tone="error"><CircleAlert className="size-3" /><span className="hidden sm:inline max-w-[240px] truncate">{error}</span></StatusBadge>
        : input.trim() ? <StatusBadge tone="ok"><Check className="size-3" />Valid</StatusBadge> : null}
    actions={<>
        {/* keep the existing onClick handlers from the old buttons */}
        <PaneButton icon={Sparkles} label="Sample" onClick={/* existing sample handler */} />
        <PaneButton icon={ClipboardPaste} label="Paste" onClick={/* existing paste handler */} />
        <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={/* existing clear handler */} />
    </>}
>
    {/* existing <CodeEditor …/> for input, unchanged */}
</EditorPane>
```

and the output `<section>` with:

```tsx
<EditorPane
    label="Output"
    className="min-h-[45vh] md:min-h-0"
    status={appliedFixIds.size > 0 ? <StatusBadge tone="warn"><Wrench className="size-3" />Repaired {appliedFixIds.size}</StatusBadge> : null}
    actions={<>
        <PaneButton icon={Copy} label="Copy" variant="primary" onClick={/* existing copy handler */} hideLabelOnMobile={false} />
        <PaneButton icon={Download} label="Download" onClick={/* existing download handler, or add one using the Blob pattern from JSONToolPage history: new Blob([formatted], { type: 'application/json' }) → a[download="formatted.json"] */} />
        <PaneButton icon={Trash2} label="Clear" variant="danger" onClick={/* existing clear handler */} />
    </>}
>
    {/* existing output editor + DiagnosticsPanel, unchanged */}
</EditorPane>
```

The `/* existing … */` markers mean: move the exact `onClick` expression from the button being replaced — do not change logic. Imports: `EditorPane, { StatusBadge }` from `@/app/components/shell/EditorPane`, `PaneButton` from `@/app/components/shell/PaneButton`, and icons `CircleAlert, Check, Sparkles, ClipboardPaste, Trash2, Wrench, Copy, Download` from `lucide-react`.

Apply the same pattern to `CodeGeneratorBase.tsx` (labels "JSON input" and the language name, e.g. `` `${languageDisplayName} output` ``; actions Sample/Paste/Clear on input, Copy/Download on output, Download using `fileExtension` as `model.${fileExtension}`).

- [ ] **Step 3: Replace all Material Symbols with lucide**

Run: `grep -rn "material-symbols-outlined" src` to list every usage. Replace each `<span className="material-symbols-outlined …">name</span>` with the lucide component below, size `className="size-3.5"` (or `size-4` where the old class was `text-sm`/`text-base` or larger), keeping any color classes:

| Material | lucide | Material | lucide |
|---|---|---|---|
| build | Wrench | delete | Trash2 |
| content_paste | ClipboardPaste | content_copy | Copy |
| check_circle | CircleCheck | auto_fix_high / auto_fix | Sparkles |
| error | CircleAlert | check | Check |
| history | History | swap_horiz | ArrowLeftRight |
| security | ShieldCheck | play_arrow | Play |
| lightbulb | Lightbulb | close | X |
| bolt | Zap | account_tree | ListTree |
| unfold_more | ChevronsUpDown | unfold_less | ChevronsDownUp |
| undo | Undo2 | timer | Timer |
| task_alt | CircleCheck | tag | Tag |
| sync_alt | ArrowLeftRight | settings | Settings2 |
| search | Search | restart_alt | RotateCcw |
| remove | Minus | progress_activity | LoaderCircle (+`animate-spin`) |
| markdown | FileText | mail | Mail |
| info | Info | format_align_left | TextAlignStart |
| edit | Pencil | done_all | CheckCheck |
| difference | GitCompare | devices | MonitorSmartphone |
| data_usage | Gauge | construction | Construction |
| compress | Minimize2 | code | Code |
| chevron_right | ChevronRight | chevron_left | ChevronLeft |
| cancel | CircleX | bug_report | Bug |
| arrow_upward | ArrowUp | arrow_downward | ArrowDown |
| arrow_right_alt / arrow_forward | ArrowRight | arrow_back | ArrowLeft |

If an icon name is computed at runtime (e.g. `{issue.icon}` inside the span), build a `Record<string, LucideIcon>` from this table in that file and render `const I = map[name] ?? Info; <I className="size-3.5" />`. Before using a lucide name not already verified in this plan, confirm it exists: `grep -c "declare const <Name>:" node_modules/lucide-react/dist/lucide-react.d.ts` → `1`.

Then delete the Material Symbols `<link …family=Material+Symbols+Outlined… />` from `src/app/layout.tsx`.

Run: `grep -rn "material-symbols" src` → no output.

- [ ] **Step 4: Monaco follows the resolved theme and new fonts**

In `src/app/components/CodeEditor.tsx`:
- line 51: `const { theme } = useTheme();` → `const { resolvedTheme } = useTheme();`
- line 132 (and any other `theme === 'dark'`): use `resolvedTheme === 'light' ? 'json-powerhouse-light' : 'json-powerhouse-dark'`, and add `resolvedTheme` to that effect's dependency array if it is in an effect.
- In the `json-powerhouse-dark` theme definition (line ~102) set `'editor.background': '#0b0f17'`, `'editor.lineHighlightBackground': '#111827'`, `'editorGutter.background': '#0b0f17'`; in the light theme `'editor.background': '#ffffff'`, `'editor.lineHighlightBackground': '#f8fafc'`. Keep all token rules.
- line 242: `fontFamily: "var(--font-geist-mono), 'Cascadia Code', Consolas, monospace"`, `fontSize: 13`.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` → exit 0. Run: `npm run lint` → no new errors in touched files.
Manual: Formatter and a code generator show identical pane headers (40px, same buttons); toggling theme switches Monaco instantly; no empty icon boxes anywhere (check Diff, Viewer, Text Viewer, Diagnostics panel).

- [ ] **Step 6: Commit**

```bash
git add src/app/components src/app/tools src/app/layout.tsx
git commit -m "feat(ui): shared editor pane chrome, lucide icons, themed Monaco

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Tool article content and ToolArticle

**Files:**
- Create: `src/content/tools/types.ts`, `src/content/tools/index.ts`, one file per tool id `src/content/tools/<toolId>.ts` (19 files)
- Create: `src/app/components/ToolArticle.tsx`
- Modify: every `src/app/tools/**/page.tsx` (replace `SeoAccordion` with `ToolArticle`)
- Delete: `src/app/components/SeoAccordion.tsx`
- Test: extend `tests/app/tool-registry.test.ts`

**Interfaces:**
- Consumes: `ToolId`, `getToolById` (Task 2). `getPostsForTool(toolId)` from Task 9 is wired in Task 10 — until then `ToolArticle` takes an optional `guides` prop.
- Produces:
  ```ts
  export interface ToolContent {
    intro: string[];   // paragraphs
    features: string[];
    howTo: { title: string; description: string }[];
    examples: { title: string; description?: string; input: string; output: string; lang: string }[];
    faq: { question: string; answer: string }[];
    related: ToolId[];
  }
  export const toolContent: Record<ToolId, ToolContent>;
  export default async function ToolArticle({ toolId }: { toolId: ToolId }): Promise<JSX.Element>;
  ```

- [ ] **Step 1: Failing completeness test**

Append to `tests/app/tool-registry.test.ts`:

```ts
import { toolContent } from '@/content/tools';

describe('tool content', () => {
    it('has complete content for every tool', () => {
        for (const t of tools) {
            const c = toolContent[t.id as keyof typeof toolContent];
            expect(c).toBeDefined();
            expect(c.intro.length).toBeGreaterThan(0);
            expect(c.howTo.length).toBeGreaterThanOrEqual(3);
            expect(c.faq.length).toBeGreaterThanOrEqual(2);
            expect(c.examples.length).toBeGreaterThanOrEqual(1);
            for (const r of c.related) expect(getToolById(r)).toBeDefined();
        }
    });
});
```

Run: `npx jest tests/app/tool-registry.test.ts` → FAIL (`@/content/tools` not found).

- [ ] **Step 2: Types and the formatter content (template for all others)**

`src/content/tools/types.ts`:

```ts
import type { ToolId } from '@/app/config/tool-registry';

export interface ToolContent {
    intro: string[];
    features: string[];
    howTo: { title: string; description: string }[];
    examples: { title: string; description?: string; input: string; output: string; lang: string }[];
    faq: { question: string; answer: string }[];
    related: ToolId[];
}
```

`src/content/tools/json-formatter.ts`:

```ts
import type { ToolContent } from './types';

const content: ToolContent = {
    intro: [
        "JSON PowerHouse Formatter instantly formats and beautifies your JSON data. Paste raw, minified, or messy JSON and get properly indented, readable output. All processing happens in your browser — your data never leaves your device.",
        "Unlike basic formatters, it also repairs common mistakes such as trailing commas, single quotes and unquoted keys, and tells you exactly what it changed.",
    ],
    features: [
        "Customizable indentation (2 spaces, 4 spaces, tabs)",
        "Sort keys alphabetically for consistent structure",
        "Toggle trailing commas on or off",
        "Strip JSON comments for clean output",
        "Remove null values with one click",
        "Copy to clipboard or download formatted file",
    ],
    howTo: [
        { title: "Paste your JSON", description: "Drop your raw JSON into the input editor, or click Sample to load example data." },
        { title: "Adjust settings", description: "Choose indentation style, enable key sorting, toggle comments and trailing commas." },
        { title: "Copy or download", description: "Get your formatted JSON instantly from the output panel." },
    ],
    examples: [
        {
            title: "Minified API response",
            description: "A one-line payload becomes readable with 2-space indentation.",
            lang: "json",
            input: '{"id":7,"name":"Ada","roles":["admin","dev"],"active":true}',
            output: '{\n  "id": 7,\n  "name": "Ada",\n  "roles": [\n    "admin",\n    "dev"\n  ],\n  "active": true\n}',
        },
    ],
    faq: [
        { question: "What is a JSON Formatter?", answer: "A JSON Formatter takes raw or minified JSON and reformats it with proper indentation, line breaks, and spacing to make it human-readable." },
        { question: "Is my data safe?", answer: "Yes. All formatting happens in your browser. Your JSON data is never sent to any server." },
        { question: "Can I format JSON with comments?", answer: "Yes. JSON PowerHouse supports JSONC (JSON with comments). You can strip or preserve comments during formatting." },
    ],
    related: ['json-validator', 'json-minifier', 'json-viewer', 'json-diff', 'json-to-typescript'],
};

export default content;
```

- [ ] **Step 3: Content for the remaining 18 tools**

For each remaining tool id create `src/content/tools/<toolId>.ts` with the same shape. Source rules:
- `intro[0]` = the `description` prop of that page's `<SeoAccordion>`, verbatim. Add `intro[1]`: one sentence on the tool's distinctive behaviour (read the tool's client to describe it accurately).
- `features`, `howTo`, `faq` = the page's `SeoAccordion` props verbatim. If `howTo` has fewer than 3 steps or `faq` fewer than 2 entries, add entries that describe real UI behaviour (e.g. "Adjust settings — open the Settings panel on the right to …" listing that tool's actual settings from Task 4).
- `related` = the page's `relatedTools` mapped from path to id via the registry; drop entries whose path is not in the registry.
- `examples`: one realistic example. Generate `output` by running the tool itself in the dev server with default settings on the `input` and pasting the result — do not hand-write generator output.
- Hidden tools (`json-normalize`, `json-to-php`) also need content (their pages still render).

`src/content/tools/index.ts`:

```ts
import type { ToolId } from '@/app/config/tool-registry';
import type { ToolContent } from './types';
import jsonFormatter from './json-formatter';
import jsonMinifier from './json-minifier';
import jsonValidator from './json-validator';
import jsonViewer from './json-viewer';
import jsonTextViewer from './json-text-viewer';
import jsonJson5 from './json-json5';
import jsonDiff from './json-diff';
import jsonTransform from './json-transform';
import jsonNormalize from './json-normalize';
import jsonToTypescript from './json-to-typescript';
import jsonToJava from './json-to-java';
import jsonToKotlin from './json-to-kotlin';
import jsonToDart from './json-to-dart';
import jsonToSwift from './json-to-swift';
import jsonToGo from './json-to-go';
import jsonToCsharp from './json-to-csharp';
import jsonToPython from './json-to-python';
import jsonToRust from './json-to-rust';
import jsonToPhp from './json-to-php';

export type { ToolContent };

export const toolContent: Record<ToolId, ToolContent> = {
    'json-formatter': jsonFormatter,
    'json-minifier': jsonMinifier,
    'json-validator': jsonValidator,
    'json-viewer': jsonViewer,
    'json-text-viewer': jsonTextViewer,
    'json-json5': jsonJson5,
    'json-diff': jsonDiff,
    'json-transform': jsonTransform,
    'json-normalize': jsonNormalize,
    'json-to-typescript': jsonToTypescript,
    'json-to-java': jsonToJava,
    'json-to-kotlin': jsonToKotlin,
    'json-to-dart': jsonToDart,
    'json-to-swift': jsonToSwift,
    'json-to-go': jsonToGo,
    'json-to-csharp': jsonToCsharp,
    'json-to-python': jsonToPython,
    'json-to-rust': jsonToRust,
    'json-to-php': jsonToPhp,
};
```

Run: `npx jest tests/app/tool-registry.test.ts` → PASS.

- [ ] **Step 4: ToolArticle**

`src/app/components/ToolArticle.tsx` (server component — no `"use client"`):

```tsx
import Link from "next/link";
import { getToolById, ToolId } from "@/app/config/tool-registry";
import { toolContent } from "@/content/tools";
import JsonLd from "./JsonLd";

export interface GuideLink { slug: string; title: string; description: string }

const sections = [
    { id: "what-is", label: (n: string) => `What is ${n}?` },
    { id: "features", label: () => "Features" },
    { id: "how-to", label: () => "How to use" },
    { id: "examples", label: () => "Examples" },
    { id: "faq", label: () => "FAQ" },
    { id: "related", label: () => "Related tools" },
];

export default function ToolArticle({ toolId, guides = [] }: { toolId: ToolId; guides?: GuideLink[] }) {
    const tool = getToolById(toolId);
    const content = toolContent[toolId];
    if (!tool || !content) return null;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map(f => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:py-16">
            <JsonLd data={faqSchema} />
            <article className="prose-jph min-w-0 flex-1">
                <h2 id="what-is">What is {tool.name}?</h2>
                {content.intro.map((p, i) => <p key={i}>{p}</p>)}

                <h2 id="features">Features</h2>
                <ul>{content.features.map(f => <li key={f}>{f}</li>)}</ul>

                <h2 id="how-to">How to use {tool.name}</h2>
                <ol>
                    {content.howTo.map(s => (
                        <li key={s.title}><strong>{s.title}.</strong> {s.description}</li>
                    ))}
                </ol>

                <h2 id="examples">Examples</h2>
                {content.examples.map(ex => (
                    <div key={ex.title}>
                        <h3>{ex.title}</h3>
                        {ex.description && <p>{ex.description}</p>}
                        <p><strong>Input</strong></p>
                        <pre><code>{ex.input}</code></pre>
                        <p><strong>Output</strong></p>
                        <pre><code>{ex.output}</code></pre>
                    </div>
                ))}

                <h2 id="faq">Frequently asked questions</h2>
                {content.faq.map(f => (
                    <div key={f.question}>
                        <h3>{f.question}</h3>
                        <p>{f.answer}</p>
                    </div>
                ))}

                <h2 id="related">Related tools</h2>
                <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {content.related.map(id => {
                        const r = getToolById(id);
                        if (!r) return null;
                        const Icon = r.icon;
                        return (
                            <Link key={id} href={r.path} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 no-underline hover:border-primary/50 transition-colors">
                                <Icon className="mt-0.5 size-4 text-primary" />
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium text-foreground">{r.name}</span>
                                    <span className="text-xs text-muted-foreground">{r.tagline}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {guides.length > 0 && (
                    <>
                        <h2 id="guides">Guides</h2>
                        <ul>
                            {guides.map(g => (
                                <li key={g.slug}><Link href={`/blog/${g.slug}`}>{g.title}</Link> — {g.description}</li>
                            ))}
                        </ul>
                    </>
                )}
            </article>

            <aside className="sticky top-20 hidden h-fit w-52 shrink-0 xl:block" aria-label="On this page">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
                <ul className="flex flex-col gap-2 text-sm">
                    {sections.map(s => (
                        <li key={s.id}><a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground">{s.label(tool.name)}</a></li>
                    ))}
                    {guides.length > 0 && <li><a href="#guides" className="text-muted-foreground hover:text-foreground">Guides</a></li>}
                </ul>
            </aside>
        </div>
    );
}
```

Add to `globals.css` (end of the prose block): `.prose-jph .not-prose a { text-decoration: none; }` and `.prose-jph .not-prose { margin-top: 1.25em; }`.

- [ ] **Step 5: Swap SeoAccordion → ToolArticle in every page**

In each `src/app/tools/**/page.tsx`: delete the `SeoAccordion` import and the whole `<SeoAccordion … />` element (its copy now lives in `src/content/tools`), and add after `</ToolWorkspace>`:

```tsx
<ToolArticle toolId="json-formatter" />
```

(use the page's tool id; import `ToolArticle from "@/app/components/ToolArticle"`).

Run: `git rm src/app/components/SeoAccordion.tsx` then `grep -rn "SeoAccordion" src` → no output.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit` → exit 0; `npx jest tests/app` → PASS.
Manual: on `/tools/json/formatter`, scrolling below the workspace shows the full article with headings, examples, FAQ, related tool cards; TOC visible ≥1280px. View page source (Ctrl+U) contains "Frequently asked questions" and the FAQ answers (server-rendered) and a `FAQPage` JSON-LD script.

- [ ] **Step 7: Commit**

```bash
git add src/content/tools src/app/components/ToolArticle.tsx src/app/tools src/app/globals.css tests/app/tool-registry.test.ts
git add -u src/app/components/SeoAccordion.tsx
git commit -m "feat(seo): visible tool articles with FAQ schema replace accordion

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Blog content library

**Files:**
- Create: `src/app/lib/blog.ts`
- Create: `tests/fixtures/blog/first-post.mdx`, `tests/fixtures/blog/second-post.mdx`, `tests/fixtures/blog/draft-post.mdx`
- Test: `tests/app/blog.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface PostMeta { slug: string; title: string; description: string; date: string; updated?: string; tags: string[]; relatedTools: string[]; draft: boolean; readingMinutes: number; }
  export interface Post extends PostMeta { content: string; }       // raw MDX body (no frontmatter)
  export const BLOG_DIR: string;                                    // path.join(process.cwd(), 'content', 'blog')
  export function getAllPosts(dir?: string): PostMeta[];            // non-draft, date desc
  export function getPost(slug: string, dir?: string): Post | null; // null if missing or slug invalid
  export function getPostsForTool(toolId: string, dir?: string): PostMeta[];
  export function getAllTags(dir?: string): string[];               // unique, sorted
  ```

Note: `tests/fixtures/` is in `testPathIgnorePatterns`, so fixture files are not run as tests.

- [ ] **Step 1: Fixtures**

`tests/fixtures/blog/first-post.mdx`:

```mdx
---
title: First Post
description: The first fixture post.
date: 2026-01-10
tags: [json, errors]
relatedTools: [json-formatter, json-validator]
---

## Heading

Body text for the first post with exactly twelve words in this line here.
```

`tests/fixtures/blog/second-post.mdx`:

```mdx
---
title: Second Post
description: The second fixture post.
date: 2026-03-02
updated: 2026-03-05
tags: [typescript]
relatedTools: [json-to-typescript]
---

Second body.
```

`tests/fixtures/blog/draft-post.mdx`:

```mdx
---
title: Draft
description: Not published.
date: 2026-04-01
tags: [json]
relatedTools: [json-formatter]
draft: true
---

Draft body.
```

- [ ] **Step 2: Failing tests**

`tests/app/blog.test.ts`:

```ts
import path from 'path';
import { getAllPosts, getPost, getPostsForTool, getAllTags } from '@/app/lib/blog';

const dir = path.join(__dirname, '..', 'fixtures', 'blog');

describe('blog lib', () => {
    it('lists published posts newest first', () => {
        const posts = getAllPosts(dir);
        expect(posts.map(p => p.slug)).toEqual(['second-post', 'first-post']);
    });

    it('parses frontmatter', () => {
        const [second] = getAllPosts(dir);
        expect(second).toMatchObject({
            title: 'Second Post',
            description: 'The second fixture post.',
            date: '2026-03-02',
            updated: '2026-03-05',
            tags: ['typescript'],
            relatedTools: ['json-to-typescript'],
            draft: false,
        });
        expect(second.readingMinutes).toBeGreaterThanOrEqual(1);
    });

    it('returns a post with body and null for unknown or unsafe slugs', () => {
        const post = getPost('first-post', dir);
        expect(post?.content).toContain('## Heading');
        expect(post?.content).not.toContain('title:');
        expect(getPost('missing', dir)).toBeNull();
        expect(getPost('../secret', dir)).toBeNull();
    });

    it('filters posts by related tool and skips drafts', () => {
        expect(getPostsForTool('json-formatter', dir).map(p => p.slug)).toEqual(['first-post']);
        expect(getPostsForTool('json-to-go', dir)).toEqual([]);
    });

    it('collects unique sorted tags from published posts', () => {
        expect(getAllTags(dir)).toEqual(['errors', 'json', 'typescript']);
    });
});
```

Run: `npx jest tests/app/blog.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement**

`src/app/lib/blog.ts`:

```ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
    slug: string;
    title: string;
    description: string;
    date: string;
    updated?: string;
    tags: string[];
    relatedTools: string[];
    draft: boolean;
    readingMinutes: number;
}

export interface Post extends PostMeta {
    content: string;
}

export const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toDateString(value: unknown, field: string, file: string): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    throw new Error(`Blog post ${file}: "${field}" must be a YYYY-MM-DD date`);
}

function requireString(value: unknown, field: string, file: string): string {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Blog post ${file}: missing "${field}"`);
    return value;
}

function stringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.map(String) : [];
}

function readPostFile(dir: string, slug: string): Post {
    const file = path.join(dir, `${slug}.mdx`);
    const { data, content } = matter(fs.readFileSync(file, 'utf8'));
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return {
        slug,
        title: requireString(data.title, 'title', file),
        description: requireString(data.description, 'description', file),
        date: toDateString(data.date, 'date', file),
        updated: data.updated ? toDateString(data.updated, 'updated', file) : undefined,
        tags: stringArray(data.tags),
        relatedTools: stringArray(data.relatedTools),
        draft: data.draft === true,
        readingMinutes: Math.max(1, Math.round(words / 220)),
        content,
    };
}

function slugsIn(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith('.mdx'))
        .map(f => f.slice(0, -4))
        .filter(s => SLUG_RE.test(s));
}

export function getAllPosts(dir: string = BLOG_DIR): PostMeta[] {
    return slugsIn(dir)
        .map(slug => readPostFile(dir, slug))
        .filter(p => !p.draft)
        .map(({ content: _content, ...meta }) => meta)
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string, dir: string = BLOG_DIR): Post | null {
    if (!SLUG_RE.test(slug)) return null;
    if (!fs.existsSync(path.join(dir, `${slug}.mdx`))) return null;
    const post = readPostFile(dir, slug);
    return post.draft ? null : post;
}

export function getPostsForTool(toolId: string, dir: string = BLOG_DIR): PostMeta[] {
    return getAllPosts(dir).filter(p => p.relatedTools.includes(toolId));
}

export function getAllTags(dir: string = BLOG_DIR): string[] {
    return Array.from(new Set(getAllPosts(dir).flatMap(p => p.tags))).sort();
}
```

If eslint flags `_content` as unused, add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` above that line.

- [ ] **Step 4: Run tests**

Run: `npx jest tests/app/blog.test.ts` → PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/lib/blog.ts tests/app/blog.test.ts tests/fixtures/blog
git commit -m "feat(blog): MDX post loader with frontmatter validation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Blog routes, MDX components, sitemap, guides on tool pages

**Files:**
- Create: `src/app/blog/layout.tsx`, `src/app/blog/page.tsx`, `src/app/blog/TagFilter.tsx`, `src/app/blog/[slug]/page.tsx`
- Create: `src/app/components/mdx/Callout.tsx`, `src/app/components/mdx/ToolLink.tsx`, `src/app/components/mdx/index.tsx`
- Create: `content/blog/.gitkeep` (removed once posts exist in Task 11)
- Modify: `src/app/sitemap.ts`, `src/app/components/ToolArticle.tsx` (load guides itself)

**Interfaces:**
- Consumes: `getAllPosts`, `getPost`, `getPostsForTool`, `getAllTags`, `PostMeta` (Task 9); `getToolById` (Task 2); `AppHeader` (Task 5).
- Produces: routes `/blog`, `/blog/[slug]`; `mdxComponents` map.

- [ ] **Step 1: MDX components**

`src/app/components/mdx/Callout.tsx`:

```tsx
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
```

`src/app/components/mdx/ToolLink.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolById } from "@/app/config/tool-registry";

export default function ToolLink({ id }: { id: string }) {
    const tool = getToolById(id);
    if (!tool) return null;
    const Icon = tool.icon;
    return (
        <Link href={tool.path} className="not-prose my-6 flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
            <Icon className="size-5 text-primary" />
            <span className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">Try the {tool.name}</span>
                <span className="text-xs text-muted-foreground">{tool.tagline}</span>
            </span>
            <ArrowRight className="ml-auto size-4 text-muted-foreground" />
        </Link>
    );
}
```

`src/app/components/mdx/index.tsx`:

```tsx
import Callout from "./Callout";
import ToolLink from "./ToolLink";

export const mdxComponents = { Callout, ToolLink };
```

- [ ] **Step 2: Blog layout**

`src/app/blog/layout.tsx`:

```tsx
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
```

- [ ] **Step 3: Blog index with tag filter**

`src/app/blog/TagFilter.tsx`:

```tsx
"use client"

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PostMeta } from "@/app/lib/blog";

export default function TagFilter({ tags, posts }: { tags: string[]; posts: PostMeta[] }) {
    const active = useSearchParams().get("tag");
    const shown = active ? posts.filter(p => p.tags.includes(active)) : posts;

    return (
        <>
            <div className="mb-8 flex flex-wrap gap-2">
                <Link href="/blog" className={`rounded-full border px-3 py-1 text-xs ${!active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>All</Link>
                {tags.map(t => (
                    <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={`rounded-full border px-3 py-1 text-xs ${active === t ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>{t}</Link>
                ))}
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
                {shown.map(p => (
                    <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`} className="flex h-full flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors">
                            <time dateTime={p.date} className="text-xs text-muted-foreground">
                                {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })} · {p.readingMinutes} min read
                            </time>
                            <h2 className="text-lg font-semibold leading-snug text-foreground">{p.title}</h2>
                            <p className="text-sm text-muted-foreground">{p.description}</p>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                                {p.tags.map(t => <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{t}</span>)}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {shown.length === 0 && <p className="text-sm text-muted-foreground">No posts with this tag yet.</p>}
        </>
    );
}
```

`src/app/blog/page.tsx`:

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/app/lib/blog";
import TagFilter from "./TagFilter";

export const metadata: Metadata = {
    title: "JSON Guides & Tutorials | JSON PowerHouse Blog",
    description: "Practical guides on fixing invalid JSON, generating types from JSON, JSON5, diffing and more.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "JSON Guides & Tutorials | JSON PowerHouse Blog",
        description: "Practical guides on fixing invalid JSON, generating types from JSON, JSON5, diffing and more.",
        url: "https://json-powerhouse.codarivu.com/blog",
        type: "website",
    },
};

export default function BlogIndexPage() {
    const posts = getAllPosts();
    const tags = getAllTags();
    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Guides & tutorials</h1>
                <p className="mt-2 text-muted-foreground">Practical, no-fluff guides for working with JSON.</p>
            </header>
            <Suspense fallback={null}>
                <TagFilter tags={tags} posts={posts} />
            </Suspense>
        </div>
    );
}
```

- [ ] **Step 4: Post page**

`src/app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPost } from "@/app/lib/blog";
import { mdxComponents } from "@/app/components/mdx";
import ToolLink from "@/app/components/mdx/ToolLink";
import JsonLd from "@/app/components/JsonLd";

const BASE_URL = "https://json-powerhouse.codarivu.com";

export const dynamicParams = false;

export function generateStaticParams() {
    return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) return {};
    return {
        title: `${post.title} | JSON PowerHouse`,
        description: post.description,
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.description,
            url: `${BASE_URL}/blog/${post.slug}`,
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.updated ?? post.date,
            tags: post.tags,
        },
        twitter: { card: "summary_large_image", title: post.title, description: post.description },
    };
}

function headingsOf(mdx: string): { id: string; text: string; depth: 2 | 3 }[] {
    const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const out: { id: string; text: string; depth: 2 | 3 }[] = [];
    let inFence = false;
    for (const line of mdx.split("\n")) {
        if (line.trim().startsWith("```")) inFence = !inFence;
        if (inFence) continue;
        const m = /^(##|###)\s+(.+)$/.exec(line);
        if (m) out.push({ depth: m[1].length as 2 | 3, text: m[2].replace(/`/g, ""), id: slugify(m[2].replace(/`/g, "")) });
    }
    return out;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPost(slug);
    if (!post) notFound();

    const all = getAllPosts();
    const idx = all.findIndex(p => p.slug === post.slug);
    const newer = idx > 0 ? all[idx - 1] : null;
    const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    const toc = headingsOf(post.content);

    return (
        <div className="mx-auto flex w-full max-w-6xl gap-12 px-4 py-12 sm:px-6 lg:py-16">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                dateModified: post.updated ?? post.date,
                url: `${BASE_URL}/blog/${post.slug}`,
                author: { "@type": "Organization", name: "JSON PowerHouse" },
                publisher: { "@type": "Organization", name: "JSON PowerHouse" },
                keywords: post.tags.join(", "),
            }} />
            <article className="min-w-0 flex-1">
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">← All guides</Link>
                <header className="mb-8 mt-4">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
                    <p className="mt-3 text-lg text-muted-foreground">{post.description}</p>
                    <p className="mt-4 text-xs text-muted-foreground">
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
                        {post.updated && <> · Updated <time dateTime={post.updated}>{post.updated}</time></>}
                        {" · "}{post.readingMinutes} min read
                    </p>
                </header>
                <div className="prose-jph">
                    <MDXRemote
                        source={post.content}
                        components={mdxComponents}
                        options={{
                            mdxOptions: {
                                rehypePlugins: [
                                    rehypeSlug,
                                    [rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } }],
                                    [rehypePrettyCode, { theme: { dark: "github-dark-dimmed", light: "github-light" }, keepBackground: true }],
                                ],
                            },
                        }}
                    />
                </div>
                {post.relatedTools.length > 0 && (
                    <section className="mt-12 border-t border-border pt-8">
                        <h2 className="text-lg font-semibold">Try it yourself</h2>
                        {post.relatedTools.map(id => <ToolLink key={id} id={id} />)}
                    </section>
                )}
                <nav className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2" aria-label="More posts">
                    {older ? <Link href={`/blog/${older.slug}`} className="rounded-lg border border-border p-4 hover:border-primary/50"><span className="text-xs text-muted-foreground">Previous</span><p className="text-sm font-medium">{older.title}</p></Link> : <span />}
                    {newer && <Link href={`/blog/${newer.slug}`} className="rounded-lg border border-border p-4 text-right hover:border-primary/50"><span className="text-xs text-muted-foreground">Next</span><p className="text-sm font-medium">{newer.title}</p></Link>}
                </nav>
            </article>
            {toc.length > 0 && (
                <aside className="sticky top-20 hidden h-fit w-56 shrink-0 xl:block" aria-label="On this page">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
                    <ul className="flex flex-col gap-2 text-sm">
                        {toc.map(h => (
                            <li key={h.id} className={h.depth === 3 ? "pl-3" : ""}>
                                <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground">{h.text}</a>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}
        </div>
    );
}
```

The TOC slugify approximates `rehype-slug` (github-slugger). After Task 11, click every TOC link once; if any heading's anchor differs, change the heading text in the post (avoid punctuation other than `-`) rather than the slugger.

- [ ] **Step 5: Guides on tool pages**

In `src/app/components/ToolArticle.tsx`: add `import { getPostsForTool } from "@/app/lib/blog";`, remove the `guides` prop from the signature (`export default function ToolArticle({ toolId }: { toolId: ToolId })`), and compute inside: `const guides = getPostsForTool(toolId).map(p => ({ slug: p.slug, title: p.title, description: p.description }));`. Keep the `GuideLink` interface.

- [ ] **Step 6: Sitemap**

In `src/app/sitemap.ts`: add `{ path: '/blog', priority: 0.7, changeFrequency: 'weekly' }` to `routes`, import `getAllPosts`, and change the default export to:

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...pages, ...posts];
}
```

(Keep whatever extra fields the existing `routes.map` sets — read the file's current return first and preserve them.)

- [ ] **Step 7: Verify**

Create `content/blog/.gitkeep` (empty). Run: `npx tsc --noEmit` → exit 0. Dev server: `/blog` renders header, "Guides & tutorials", empty list without error; `/sitemap.xml` includes `/blog`. Post pages are verified in Task 11.

- [ ] **Step 8: Commit**

```bash
git add src/app/blog src/app/components/mdx src/app/components/ToolArticle.tsx src/app/sitemap.ts content/blog/.gitkeep
git commit -m "feat(blog): blog index, MDX post pages, sitemap and tool guides

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Starter blog posts

**Files:**
- Create: `content/blog/fix-invalid-json-errors.mdx`, `content/blog/json-to-typescript-best-practices.mdx`, `content/blog/json-vs-json5.mdx`
- Delete: `content/blog/.gitkeep`

Each post: 800–1200 words, original prose, frontmatter as in Task 9, at least four `##` sections, at least two fenced code blocks with a language (` ```json `, ` ```ts `), one `<Callout>` and one `<ToolLink id="…" />` in the body. Every technical claim must be checked against the actual behaviour of the linked tool in the dev server (e.g. which errors the formatter auto-repairs — see `.trae/rules/json-fix-implement-rule.md`).

- [ ] **Step 1: `fix-invalid-json-errors.mdx`**

Frontmatter:

```yaml
---
title: "How to Fix the 7 Most Common Invalid JSON Errors"
description: "Trailing commas, single quotes, unquoted keys and more — what each JSON error means and how to fix it fast."
date: 2026-10-27
tags: [json, errors, debugging]
relatedTools: [json-formatter, json-validator]
---
```

Sections (`##`): `Why JSON is so strict`; `1. Trailing commas`; `2. Single quotes instead of double quotes`; `3. Unquoted keys`; `4. Comments in JSON`; `5. Unescaped characters in strings`; `6. Missing commas or brackets`; `7. A BOM or invisible characters at the start`; `Fixing errors automatically`; `Key takeaways`. Each numbered section shows a broken ` ```json ` snippet, the parser error it causes, and the fixed snippet. In "Fixing errors automatically" state precisely which of the seven the Formatter auto-repairs (mechanical fixes only, per the repair rules) and which (structural, #6) it reports but does not change; include `<Callout type="tip">` about validating before shipping config and `<ToolLink id="json-formatter" />`.

- [ ] **Step 2: `json-to-typescript-best-practices.mdx`**

```yaml
---
title: "Generating TypeScript Types from JSON: A Practical Guide"
description: "Turn real API responses into accurate TypeScript interfaces — and when to add a Zod schema for runtime safety."
date: 2026-10-20
tags: [typescript, codegen, api]
relatedTools: [json-to-typescript]
---
```

Sections: `Why generate types instead of writing them`; `Start from a representative sample`; `Interfaces vs type aliases`; `Optional and nullable fields`; `Arrays of mixed objects`; `Adding runtime validation with Zod`; `A workflow that scales`. Include a sample API JSON, the generated interface (produced by the tool with default settings — paste real output), and the Zod output (Runtime check = Zod). `<Callout type="warn">` that types inferred from one sample can miss optional fields. `<ToolLink id="json-to-typescript" />`.

- [ ] **Step 3: `json-vs-json5.mdx`**

```yaml
---
title: "JSON vs JSON5: Differences and When to Use Each"
description: "Comments, trailing commas, unquoted keys — what JSON5 adds, where it is supported, and when strict JSON is still the right choice."
date: 2026-10-13
tags: [json, json5, config]
relatedTools: [json-json5, json-formatter]
---
```

Sections: `What JSON5 is`; `Syntax JSON5 allows` (a markdown table: feature | JSON | JSON5 — comments, trailing commas, single quotes, unquoted keys, hex numbers, Infinity/NaN, multi-line strings); `Where JSON5 is used`; `When to stay with strict JSON`; `Converting between the two`. Show the same config in JSON and JSON5. `<Callout>` noting APIs should send strict JSON. `<ToolLink id="json-json5" />`.

- [ ] **Step 4: Verify**

Run: `git rm content/blog/.gitkeep`.
Run: `npx jest tests/app` → PASS.
Dev server: `/blog` lists the three posts newest first; tag chips filter (`/blog?tag=typescript` shows one post); each post renders highlighted code in dark and light theme, callout, tool card, prev/next links, TOC links jump to the right heading; `/tools/json/formatter` article shows a "Guides" section listing the fix-invalid-json post; `/sitemap.xml` includes all three post URLs.

- [ ] **Step 5: Commit**

```bash
git add content/blog
git add -u content/blog/.gitkeep
git commit -m "content(blog): three starter guides

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Home page refresh

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getVisibleTools`, `toolGroups` (Task 2), `getAllPosts` (Task 9), `AppHeader` (Task 5), `Footer`.

- [ ] **Step 1: Read the current page**

Read `src/app/page.tsx` fully. Keep its hero copy, "Why JSON PowerHouse" section and any metadata/JSON-LD. Fix the broken links found at lines ~194 and ~206 (`/tools/json-to-typescript` → `/tools/code/json-to-typescript`, `/tools/json-formatter` → `/tools/json/formatter`).

- [ ] **Step 2: Shell + tool grid + latest guides**

Wrap the page content as:

```tsx
<div className="flex min-h-dvh flex-col bg-background text-foreground">
    <AppHeader />
    <main className="flex-1">{/* existing sections, with the hand-written tool card section replaced by ToolGrid below */}</main>
    <Footer />
</div>
```

If `page.tsx` is a client component (`"use client"`), move the existing body into `src/app/HomeClient.tsx` unchanged and make `page.tsx` a server component that renders the wrapper above with `<HomeClient />` inside `<main>`, followed by the two sections below — `getAllPosts()` uses `fs` and must run on the server.

Replace the existing hand-written tool link section (the `<section>` containing the list of `href="/tools/..."` cards, lines ~144–213) with:

```tsx
<section className="border-b border-border">
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">All tools</h2>
        {toolGroups.map(group => (
            <div key={group.id} className="mt-8">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.name}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {getVisibleTools(group.id).map(t => {
                        const Icon = t.icon;
                        return (
                            <Link key={t.id} href={t.path} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors">
                                <Icon className="mt-0.5 size-4 text-primary" />
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium">{t.name}</span>
                                    <span className="text-xs text-muted-foreground">{t.tagline}</span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        ))}
    </div>
</section>
```

and add after it:

```tsx
{posts.length > 0 && (
    <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Latest guides</h2>
                <Link href="/blog" className="text-sm text-primary hover:underline">All guides →</Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
                {posts.slice(0, 3).map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors">
                        <span className="text-xs text-muted-foreground">{p.readingMinutes} min read</span>
                        <span className="font-semibold leading-snug">{p.title}</span>
                        <span className="text-sm text-muted-foreground">{p.description}</span>
                    </Link>
                ))}
            </div>
        </div>
    </section>
)}
```

with `const posts = getAllPosts();` at the top of the server component. Replace any `material-symbols-outlined` spans left on the home page per the Task 7 table, and remove any import of the deleted `Header`.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` → exit 0. Dev server `/`: new header/footer, tool grid with 8 + 9 tools, 3 latest guides, all links resolve (click each).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/HomeClient.tsx
git commit -m "feat(home): shared shell, registry tool grid, latest guides

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Omit `HomeClient.tsx` from `git add` if it was not created.)

---

### Task 13: Docs update and full verification

**Files:**
- Modify: `AGENTS.md` (State + Architecture sections)

- [ ] **Step 1: Update AGENTS.md**

Replace the `## State` section with:

```markdown
## State

- Tool registry: `src/app/config/tool-registry.ts` (ids, paths, groups, icons). Add new tools here first.
- Per-tool config: `ConfigContext` resolves the active tool from the pathname; `useConfig()` returns `{ toolId, config, setConfig, reset }`, persisted in localStorage `jph:config:<toolId>`. Defaults in `src/app/config/tool-defaults.ts`.
- Settings UI: `src/app/components/settings/<Tool>Settings.tsx`, registered in `settings/index.ts`.
- Zustand: alert store only (`src/app/lib/utils/alert-store.ts`)
```

Add under `## Architecture`:

```markdown
- Shell: `src/app/components/shell/` (AppHeader, ToolSidebar, ToolSearch, ToolWorkspace, SettingsPanel, EditorPane)
- Tool SEO copy: `src/content/tools/<toolId>.ts`, rendered by `ToolArticle`
- Blog: MDX in `content/blog/*.mdx` (frontmatter: title, description, date, tags, relatedTools), loaded by `src/app/lib/blog.ts`
```

- [ ] **Step 2: Automated checks**

Run: `npx tsc --noEmit` → exit 0.
Run: `npm run lint` → no errors in files touched by this plan.
Run: `npx jest` → only the 3 pre-existing failing suites fail; `tests/app/*` all pass.
Run: `npm run build` → succeeds; output lists `/blog`, `/blog/[slug]` (3 SSG paths) and all tool routes.
Run: `grep -rn "material-symbols\|SeoAccordion\|BottomConfigurationPanel\|useMode\|tools-config\|tool-presets\|calc(100vh" src` → no output.

- [ ] **Step 3: Browser pass**

With `npm run dev`, for every visible tool at 1440×900 dark, 1440×900 light, and 375×812:
- sidebar/drawer navigation reaches it and highlights it;
- input and output panes are equal height; no horizontal page scroll at 375px;
- Settings panel (or sheet) shows only that tool's options; a change updates output; reload keeps it; Reset restores defaults;
- after visiting C# and changing a setting, Formatter settings are unchanged;
- article below the workspace is visible, readable, and the related links work.
Also: `/`, `/blog`, each post, `/about`, `/privacy`, `/terms`, a 404 URL.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document new shell, per-tool config and blog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
