<p align="center">
  <img src="public/JSON-PowerHouse-Logo.png" alt="JSON PowerHouse" width="120">
</p>

<h1 align="center">JSON PowerHouse</h1>

<p align="center">
  Fix, format and convert JSON — in the browser or in VS Code.
  <br>
  <a href="https://json-powerhouse.codarivu.com">Website</a> ·
  <a href="https://marketplace.visualstudio.com/items?itemName=arjayabalan.json-powerhouse-vscode">VS Code extension</a> ·
  <a href="https://open-vsx.org/extension/arjayabalan/json-powerhouse-vscode">Open VSX</a> ·
  <a href="https://json-powerhouse.codarivu.com/blog">Blog</a> ·
  <a href="https://github.com/1-arjayabalan-0/json-powerhouse/issues">Report a problem</a>
</p>

---

You paste an API response and it won't parse. Someone sent a config file full of comments and trailing commas. You need TypeScript types, or a database table, for a payload you've never seen before.

JSON PowerHouse handles those jobs in one place. Open a tool, paste your JSON, and the result updates as you type. Nothing is uploaded: every tool runs in your browser.

## Tools

### Work with JSON

| Tool | What it does |
|---|---|
| [Formatter](https://json-powerhouse.codarivu.com/tools/json/formatter) | Pretty-prints JSON and repairs common mistakes: single quotes, unquoted keys, trailing commas, comments |
| [Validator](https://json-powerhouse.codarivu.com/tools/json/validator) | Shows each error with its line and column and a plain explanation, and offers a fix |
| [Minifier](https://json-powerhouse.codarivu.com/tools/json/minifier) | Strips whitespace to make JSON as small as possible |
| [Tree Viewer](https://json-powerhouse.codarivu.com/tools/json/viewer) | Explore large documents as a collapsible tree |
| [Text Viewer](https://json-powerhouse.codarivu.com/tools/json/text-viewer) | Read long text fields (descriptions, Markdown, logs) as a table |
| [Diff Checker](https://json-powerhouse.codarivu.com/tools/json/diff) | Compare two documents and merge the changes |
| [JSON ↔ JSON5](https://json-powerhouse.codarivu.com/tools/json/json5) | Convert between strict JSON and JSON5 |
| [Transform](https://json-powerhouse.codarivu.com/tools/json/transform) | Flatten or unflatten, rename or remove keys, change key case, or pull out part of a document |

### Generate code

Turn a JSON sample into typed models: [TypeScript](https://json-powerhouse.codarivu.com/tools/code/json-to-typescript), [C#](https://json-powerhouse.codarivu.com/tools/code/json-to-csharp), [Java](https://json-powerhouse.codarivu.com/tools/code/json-to-java), [Python](https://json-powerhouse.codarivu.com/tools/code/json-to-python), [Go](https://json-powerhouse.codarivu.com/tools/code/json-to-go), [Kotlin](https://json-powerhouse.codarivu.com/tools/code/json-to-kotlin), [Swift](https://json-powerhouse.codarivu.com/tools/code/json-to-swift), [Dart](https://json-powerhouse.codarivu.com/tools/code/json-to-dart) and [Rust](https://json-powerhouse.codarivu.com/tools/code/json-to-rust).

Nested objects become their own types, and each generator has its own options, such as namespaces and packages, serialization libraries (System.Text.Json, Pydantic, kotlinx, Codable…), or interfaces with or without runtime checks.

### Database & schema

| Tool | What it does |
|---|---|
| [JSON → PostgreSQL](https://json-powerhouse.codarivu.com/tools/schema/json-to-postgresql) | `CREATE TABLE` statements, with optional `INSERT`s for the data |
| [JSON → MySQL](https://json-powerhouse.codarivu.com/tools/schema/json-to-mysql) | The same for MySQL |
| [JSON → SQLite](https://json-powerhouse.codarivu.com/tools/schema/json-to-sqlite) | The same for SQLite |
| [JSON → Prisma](https://json-powerhouse.codarivu.com/tools/schema/json-to-prisma) | Prisma models with relations |
| [JSON → JSON Schema](https://json-powerhouse.codarivu.com/tools/schema/json-to-json-schema) | A JSON Schema (draft 2020-12 or draft-07) you can validate other documents against |

Nested objects become child tables linked by foreign keys, or JSON columns if you prefer. Column types come from the data: dates, timestamps, UUIDs and big integers are recognised. If your JSON is an array of records, every record is taken into account, so a field missing from some of them becomes nullable.

## In VS Code

The [JSON PowerHouse extension](https://marketplace.visualstudio.com/items?itemName=arjayabalan.json-powerhouse-vscode) brings the same tools into your editor:

- Right-click in a JSON file and open **JSON PowerHouse**, or click the ✨ button in the editor's title bar.
- Generators work on the selection, or on the whole file when nothing is selected. Files with comments or trailing commas (JSONC, JSON5) are fine.
- Click ⚙ next to a generator to change its options. Any output you have open updates straight away.
- Settings live under `json-powerhouse` in VS Code's Settings, one section per generator, so a team can share them through `.vscode/settings.json`.

Install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=arjayabalan.json-powerhouse-vscode), or search for **JSON PowerHouse** in the Extensions view. Using Cursor, Windsurf or VSCodium? It's on [Open VSX](https://open-vsx.org/extension/arjayabalan/json-powerhouse-vscode) too. See the [extension's README](extension/README.md) for the full list of commands and settings.

## Your data

- **Your JSON stays on your device.** The website processes everything in the browser, and the extension processes everything locally. Large files are parsed in a background worker, so the page stays responsive.
- **Usage statistics.** The website uses Vercel Analytics and Microsoft Clarity to see which pages are used. The extension sends anonymous usage events, such as which command ran, to PostHog. It never sends your JSON, file names or setting values. It follows VS Code's telemetry setting, and you can also turn it off with `json-powerhouse.telemetry.enabled`. The details are in the [extension's README](extension/README.md#-telemetry).

## Running it locally

You need Node.js 20 or later.

```bash
git clone https://github.com/1-arjayabalan-0/json-powerhouse.git
cd json-powerhouse
npm install
npm run dev
```

Then open http://localhost:3000.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run lint` | Lint |
| `npm test` | Run the tests (Jest) |

### The extension

The extension lives in [`extension/`](extension) and reuses the website's core code from `src/core/`.

```bash
cd extension
npm install
npm run compile                 # type-check and bundle
npx @vscode/vsce package        # build a .vsix you can install
```

To try your changes, open the `extension/` folder in VS Code and press **F5**.

### Where things are

| Path | Contents |
|---|---|
| `src/core/` | The JSON engines (repair, diff, generators, schema inference), shared with the extension |
| `src/app/tools/` | One page per tool |
| `src/app/config/tool-registry.ts` | The list of tools; start here when adding one |
| `src/content/tools/` | The text shown under each tool (help, examples, FAQ) |
| `content/blog/` | Blog posts (MDX) |
| `extension/` | The VS Code extension |
| `tests/` | Tests |

## Feedback

Found a bug, or JSON that doesn't come out right? [Open an issue](https://github.com/1-arjayabalan-0/json-powerhouse/issues) and include a small sample if you can. Pull requests are welcome too.

## License

Copyright © 2024–2026 Arjayabalan. The VS Code extension is released under the [MIT License](extension/LICENSE).
