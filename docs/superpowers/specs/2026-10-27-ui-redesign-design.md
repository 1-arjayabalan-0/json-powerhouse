# JSON PowerHouse UI v2 — Design Spec

Date: 2026-10-27
Status: Approved (design), pending spec review

## Problem

- Tool navigation is hidden: the only tool switcher is a dropdown inside the bottom config panel; the header only has a JSON/Code mode toggle.
- The config panel sits under the output pane only, shrinking it and making input/output panes uneven.
- SEO content is a collapsed "About X" accordion at the bottom of a viewport-locked page — users rarely open it and hidden-by-default content is weaker for SEO. There is no blog.
- One shared `config` object (`ConfigContext`) is reused across tools; switching tools merges/overwrites settings and nothing is remembered per tool.
- Header is 80px with a large raster logo, wasting editor space. Spacing, label sizes and button styles are inconsistent across tools.

## Decisions (from Q&A)

| Topic | Decision |
|---|---|
| Navigation | Left sidebar listing all tools by group |
| Tool settings | Collapsible right settings panel, only current tool's options |
| Config storage | Separate per tool, persisted in localStorage, resettable |
| SEO content | Tool fills first viewport, visible article below + separate `/blog` |
| Blog format | MDX files in repo |
| Mode toggle | Removed (sidebar groups replace it) |
| Visual | Refined dark-first with light theme |
| Rollout | New shell + all tool pages in one pass |

## 1. App shell (`/tools/*`)

```
┌──────────────────────────────────────────────────────────────────┐
│ {}JSON PowerHouse    [Search tools…  Ctrl K]   Blog  ☾  VS Code   │ 48px header
├────────┬─────────────────────────────────────────────┬───────────┤
│JSON    │ JSON Formatter · tagline              [⚙ ◧] │ SETTINGS  │ tool bar 44px
│▸Format │─────────────────────┬───────────────────────│ sections… │
│ Minify │ INPUT  actions      │ OUTPUT  status  acts  │           │
│ …      │  Monaco             │  Monaco               │           │
│CODE    │                     │                       │           │
│ TS …   ├─────────────────────┴───────────────────────┤ Reset     │
│ «      │ status bar (issues · size · cursor)         │           │
└────────┴─────────────────────────────────────────────┴───────────┘
  ↓ document scrolls ↓  ToolArticle
```

- Document scrolls normally (no `h-screen` + inner `overflow-y-auto` on `<main>`). The workspace block has height `calc(100dvh - 48px)` with `min-height: 520px`, so the article is reached by plain page scroll.
- Header is `sticky top-0`, 48px.

### Components (new, in `src/app/components/shell/`)

| Component | Responsibility |
|---|---|
| `AppHeader` | Logo mark + wordmark (links `/`), `ToolSearch` trigger, Blog link, theme toggle (`next-themes`), VS Code extension link. Mobile: hamburger opens sidebar drawer. |
| `ToolSidebar` | Renders groups/tools from the tool registry; active item from `usePathname()`. Width 224px; collapse toggle to 56px icon rail (persisted in localStorage `jph:sidebar-collapsed`). Below `lg` it is a slide-over drawer. Sticky, own scroll. |
| `ToolSearch` | Ctrl/Cmd+K command palette: filter registry by name/tagline/keywords, arrow keys + Enter navigate. |
| `ToolWorkspace` | Layout frame for a tool: `ToolTitleBar` (name, tagline, settings-panel toggle) + content slot + optional `SettingsPanel`. |
| `EditorPane` | Shared pane chrome: header row (label, status badge slot, action buttons slot) + body. All panes in a split use the same header height (40px). |
| `SettingsPanel` | Right column 288px, collapsible (state persisted `jph:settings-open`). Below `lg` it becomes a bottom sheet opened by the ⚙ button. Renders the tool's settings component and a footer "Reset to defaults". |
| `StatusBar` | Optional 28px footer row inside the workspace (validity, issue count, byte size). |

Removed: `Header.tsx`, mode toggle usage of `ModeContext`, `BottomConfigurationPanel.tsx` (after migration), `SeoAccordion.tsx`.

Responsive:
- `≥ lg` (1024px): sidebar + split editors side-by-side + settings panel.
- `md`–`lg`: sidebar drawer, editors side-by-side, settings as bottom sheet.
- `< md`: editors stacked (each min 45vh), workspace height auto, settings bottom sheet.

## 2. Tool registry & per-tool config

### Registry — `src/app/config/tools-config.ts`

```ts
interface ToolDef {
  id: string;            // 'json-formatter'
  name: string;          // 'JSON Formatter'
  shortName: string;     // sidebar label: 'Formatter'
  path: string;
  group: 'json' | 'code';
  icon: LucideIcon;
  tagline: string;       // one line under title
  keywords?: string[];   // for ToolSearch
}
```
Groups: `json` (Formatter, Minifier, Validator, Tree Viewer, Text Viewer, JSON↔JSON5, Diff, Transform) and `code` (TypeScript, Java, Kotlin, Dart, Swift, Go, C#, Python, Rust). Commented-out tools (normalize, PHP, SQL, YAML…) stay commented out. Their existing pages (`/tools/json/normalize`, `/tools/code/json-to-php`) are moved onto the new shell too (so `SeoAccordion` can be deleted) but remain hidden from sidebar and search.

### Config hook — `src/app/hooks/useToolConfig.ts`

```ts
function useToolConfig<T>(toolId: string, defaults: T): {
  config: T;
  setConfig: (patch: Partial<T> | ((c: T) => T)) => void;
  reset: () => void;
}
```
- Storage key `jph:config:<toolId>` in localStorage; stored value is shallow-merged over `defaults` on read (so new default keys appear for existing users).
- SSR-safe: initial render uses `defaults`; hydrates from storage in effect. Invalid/corrupt JSON in storage → ignored, defaults used.
- Per-tool defaults live in `src/app/config/tool-defaults.ts` (`toolDefaults[toolId]`). Formatter-family tools (formatter, minifier, validator) derive defaults as `{ ...defaultFormatterConfig, ...toolPresets[id] }`, replacing the runtime preset-merge in `JSONToolPage`.
- `ConfigContext` is replaced by a `ToolConfigProvider` mounted per tool page that exposes the hook result to both the tool client and its settings component (so settings panel and editor read the same state).

### Settings components — `src/app/components/settings/`

- Shared fields: `SettingsSection` (title + children), `SelectField`, `SwitchField`, `TextField` — each label + control on its own row, consistent 32px controls, 12px labels.
- One file per tool or family: `FormatterSettings` (shared by formatter, minifier, validator — each with its own stored config), `ViewerSettings`, `TextViewerSettings`, `Json5Settings`, `DiffSettings`, `TransformSettings`, and code generators `TypeScriptSettings`, `JavaSettings`, `KotlinSettings`, `DartSettings`, `SwiftSettings`, `GoSettings`, `CSharpSettings`, `PythonSettings`, `RustSettings`.
- Options/values ported 1:1 from `BottomConfigurationPanel.tsx`; grouped into sections (e.g. Formatter: Layout → indentation, sort keys; Keys → key case, quote style; Output → comments, trailing commas, nulls).
- Tools that currently embed `BottomConfigurationPanel` inside their own component (`JSONFormatter`, `CodeGeneratorBase`, `JsonTreeViewer`, `JsonDiffViewer`, `UnifiedJsonDiffMerge`, json5 client, transform client) have that embed removed; they read config from the provider instead of props/context.

## 3. Tool article (replaces `SeoAccordion`)

- `src/content/tools/<toolId>.ts` exports `ToolContent`:
  ```ts
  interface ToolContent {
    intro: string;                                  // 1–2 paragraphs
    features: string[];
    howTo: { title: string; description: string }[];
    examples?: { title: string; input: string; output: string; lang: string }[];
    faq: { question: string; answer: string }[];
    related: string[];                              // tool ids
  }
  ```
  Existing copy from each page's `SeoAccordion` props moves here verbatim, plus one example per tool.
- `ToolArticle` (server component) renders below the workspace: `<article>` max-width ~72ch, H2 sections "What is {tool}", "Features", "How to use", "Examples", "FAQ", "Related tools", "Guides" (blog posts whose `relatedTools` include this id). Sticky table of contents on `≥ xl`.
- FAQ rendered as visible headings + paragraphs (no collapse). FAQPage JSON-LD emitted by `ToolArticle`; SoftwareApplication JSON-LD stays in each `page.tsx`.
- Each `page.tsx` keeps its `metadata` export and becomes: `<JsonLd/>` + `<ToolPage toolId=… ><Client/></ToolPage>` + `<ToolArticle toolId=… />`.

## 4. Blog

- Content: `content/blog/<slug>.mdx` with frontmatter `title, description, date, updated?, tags[], relatedTools[] (tool ids), cover?`.
- Deps: `@next/mdx` is not used; use `next-mdx-remote/rsc` + `gray-matter` for file-based loading at build time, `rehype-slug` + `rehype-autolink-headings` for heading anchors, `rehype-pretty-code` (shiki) for code highlighting.
- `src/app/lib/blog.ts`: `getAllPosts()` (sorted by date desc), `getPost(slug)`, `getPostsForTool(toolId)`.
- Routes:
  - `/blog` — header + tag filter chips (client, query `?tag=`) + post cards (title, description, date, tags).
  - `/blog/[slug]` — `generateStaticParams`, `generateMetadata` (title, description, canonical, OG `article`), Article JSON-LD, TOC from H2/H3, prose typography, "Try the tool" CTA cards for `relatedTools`, prev/next links.
- Blog pages use `AppHeader` + `Footer` (no tool sidebar).
- `sitemap.ts` adds `/blog` and every post (`lastModified` = updated ?? date).
- MDX components: `Callout`, `ToolLink` (link card to a tool by id), styled `pre/code`.
- Starter posts (real content, ~800–1200 words each):
  1. `fix-invalid-json-errors` — common invalid JSON errors and fixes (related: formatter, validator).
  2. `json-to-typescript-best-practices` — generating TS types from API JSON (related: json-to-typescript).
  3. `json-vs-json5` — differences and when to use each (related: json-json5).

## 5. Visual system

- Tokens in `globals.css` (`:root` = light, `.dark` = dark; default theme dark via `ThemeProvider defaultTheme="dark"`):
  - Dark: background `#0b0f17`, surface/card `#111827`, muted `#161e2e`, border `#1f2937`, foreground `#e5e7eb`, muted-foreground `#9ca3af`, primary `#3b82f6`.
  - Light: background `#ffffff`, surface `#f8fafc`, muted `#f1f5f9`, border `#e2e8f0`, foreground `#0f172a`, muted-foreground `#64748b`, primary `#2563eb`.
  - Status: success `#22c55e`, warning `#f59e0b`, destructive `#ef4444` — used only for status badges/destructive actions.
- Spacing on 4/8px grid; controls 32px; radius 6px (controls) / 8px (panels); 1px borders.
- Fonts: Inter (UI, via `next/font/google`, replaces Poppins), Geist Mono (editors/code). Monaco theme follows site theme (`vs-dark` / `vs`).
- Icons: lucide-react everywhere; remove the Material Symbols stylesheet link and all `material-symbols-outlined` spans.
- Buttons: single `Button` variants — `primary`, `secondary`, `ghost`, `destructive-ghost`; sizes `sm` (28px) and `md` (32px).
- Prose styles for article/blog via a scoped `.prose` class in `globals.css` (no new Tailwind plugin needed).

## 6. Home page

- `/` keeps its content but uses `AppHeader` + `Footer`, adopts new tokens/fonts, and its "Get Started" links to `/tools/json/formatter`. Adds a tool grid (from registry) and "Latest guides" (3 newest posts). No other redesign of home in this scope.

## Out of scope

- Tool processing logic, generators, diagnostics engine, workers.
- VS Code extension (`extension/`).
- Uncommitted text-viewer work stays as-is functionally; it only gets a registry entry (already present), a `TextViewerSettings` file and the new shell.
- New tools (SQL, YAML, etc.).

## Error handling

- `useToolConfig`: storage read/parse/write wrapped in try/catch; failures fall back to defaults silently.
- Blog: unknown slug → `notFound()`; malformed frontmatter fails the build (explicit, caught early).
- `ToolArticle`: missing content file for a tool id → renders nothing (build-time type check ensures every registry id has content).

## Testing

- Existing Jest suite must stay green.
- New unit tests:
  - `useToolConfig`: isolation between two tool ids; persistence round-trip; merge of new default keys over stored value; reset; corrupt storage → defaults.
  - `blog.ts`: sorting, `getPostsForTool` filtering, frontmatter parsing (fixture dir).
  - Registry: every tool id has defaults, settings component and content entry.
- Manual browser verification of every tool page at 1440px and 375px, dark and light: sidebar navigation, settings change → output updates, settings persist across reload and do not leak between tools, article visible on scroll; `/blog` and each post render; `npm run build` and `npm run lint` pass.
