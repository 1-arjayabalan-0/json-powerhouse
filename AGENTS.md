# JSON PowerHouse

Next.js 16 App Router + VS Code extension. 100% client-side JSON tooling.

## Commands

```bash
npm run dev          # dev server → localhost:3000
npm run build        # production build
npm run lint         # eslint
npm run test         # jest
npm run test:coverage # jest + coverage
```

Extension (in `extension/`):
```bash
npm run compile      # build extension
```

## Architecture

- `src/app/` — Next.js App Router, tool pages under `src/app/tools/`
- `src/core/` — shared logic between web app and VS Code extension
- `extension/` — VS Code extension, shares `src/core/` via path aliases
- Shell: `src/app/components/shell/` (AppHeader, ToolSidebar, ToolSearch, ToolWorkspace, SettingsPanel, EditorPane)
- Tool SEO copy: `src/content/tools/<toolId>.ts`, rendered by `ToolArticle`
- Blog: MDX in `content/blog/*.mdx` (frontmatter: title, description, date, tags, relatedTools), loaded by `src/app/lib/blog.ts`
- No API routes — all processing client-side
- Web Worker (`src/workers/json-parse.worker.ts`) for JSON >100KB

## Path Aliases

```json
"@/*": "./src/*"
"@/core/*": "./src/core/*"
```

## Testing

Jest + ts-jest. Setup: `tests/setup.ts` (custom matchers: `toBeValidJSON`, `toContainJSON`).
Tests in `tests/`. Run single test: `npx jest tests/path/to/file.test.ts`.

## Styling

Tailwind CSS v4 + CSS variables. Dark mode via `next-themes` with `class` strategy.
Fonts: Inter (UI) + Geist Mono (code). Icons: `lucide-react` only.
UI primitives: Radix UI + shadcn/ui pattern in `src/app/components/ui/`.

## State

- Tool registry: `src/app/config/tool-registry.ts` (ids, paths, groups, icons). Add new tools here first.
- Per-tool config: `ConfigContext` resolves the active tool from the pathname; `useConfig()` returns `{ toolId, config, setConfig, reset }`, persisted in localStorage `jph:config:<toolId>`. Defaults in `src/app/config/tool-defaults.ts`.
- Settings UI: `src/app/components/settings/<Tool>Settings.tsx`, registered in `settings/index.ts`.
- Zustand: alert store only (`src/app/lib/utils/alert-store.ts`)

## Notable

- React Compiler enabled (`next.config.ts`)
- Monaco Editor for code editing
- Code generators use `quicktype-core`
- Diff engine uses `@dmsnell/diff-match-patch` + `jsondiffpatch`

## JSON Fixing Rules

Domain-specific rules in `.trae/rules/json-fix-implement-rule.md`:
- Mechanical fixes only (trailing commas, whitespace, quotes, BOM)
- Never change values, add/remove keys, or fix structural issues
- Confidence scoring: 1.0 (safe) → 0.0 (fatal)
