const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } = require("docx");
const fs = require("fs");
const path = require("path");

function heading(text, level = HeadingLevel.HEADING_1) {
    return new Paragraph({ text, heading: level, spacing: { before: 300, after: 100 } });
}

function para(text, opts = {}) {
    return new Paragraph({
        children: [new TextRun({ text, ...opts })],
        spacing: { after: 80 },
    });
}

function boldPara(label, text) {
    return new Paragraph({
        children: [
            new TextRun({ text: label, bold: true }),
            new TextRun({ text }),
        ],
        spacing: { after: 80 },
    });
}

function bullet(text) {
    return new Paragraph({
        children: [new TextRun({ text })],
        bullet: { level: 0 },
        spacing: { after: 40 },
    });
}

function bulletBold(label, text) {
    return new Paragraph({
        children: [
            new TextRun({ text: label, bold: true }),
            new TextRun({ text }),
        ],
        bullet: { level: 0 },
        spacing: { after: 40 },
    });
}

function codeLine(text) {
    return new Paragraph({
        children: [new TextRun({ text, font: "Consolas", size: 18, color: "444444" })],
        spacing: { after: 40 },
        indent: { left: 360 },
    });
}

function spacer() {
    return new Paragraph({ text: "", spacing: { after: 100 } });
}

function makeTable(headers, rows) {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                tableHeader: true,
                children: headers.map(h => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20 })] })],
                    shading: { type: ShadingType.SOLID, color: "2D3748" },
                    width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
                })),
            }),
            ...rows.map(row => new TableRow({
                children: row.map(cell => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20 })] })],
                    width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
                })),
            })),
        ],
    });
}

const doc = new Document({
    styles: {
        default: {
            document: {
                run: { size: 22, font: "Calibri" },
            },
        },
    },
    sections: [{
        properties: {},
        children: [
            // ============================================================
            // TITLE
            // ============================================================
            new Paragraph({
                children: [new TextRun({ text: "JSON PowerHouse — VSCode Extension Integration & Product Enhancement", bold: true, size: 36, color: "1a1a2e" })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            }),
            new Paragraph({
                children: [new TextRun({ text: "Full Implementation Report — March 2026", size: 24, color: "666666", italics: true })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
            }),

            // ============================================================
            // TABLE OF CONTENTS
            // ============================================================
            heading("Table of Contents"),
            para("1. Project Overview & Architecture Mapping"),
            para("2. Phase 0 — VSCode Extension Core Integration"),
            para("3. Phase 1 — Auto-Repair Broken JSON (Task 1.1)"),
            para("4. Phase 1 — Zero-Decision Defaults (Task 1.2)"),
            para("5. Phase 1 — Performance for Large JSON (Task 1.3)"),
            para("6. Phase 2 — Structural JSON Diff Enhancements (Task 2.1)"),
            para("7. Phase 2 — Visual Transformations Tool (Task 2.2)"),
            para("8. Consistency Rules & Patterns"),
            para("9. Build Verification & Test Results"),
            para("10. Remaining Tasks & Future Phases"),

            // ============================================================
            // SECTION 1: PROJECT OVERVIEW
            // ============================================================
            heading("1. Project Overview & Architecture Mapping"),

            heading("1.1 Repository Structure", HeadingLevel.HEADING_2),
            para("The JSON PowerHouse project is a single-package repository with two distinct build targets:"),
            spacer(),
            bulletBold("Next.js Web App: ", "Built via next build from the root package.json. Uses React 19, App Router, Tailwind CSS 4, Monaco Editor, Zustand, and quicktype-core."),
            bulletBold("VSCode Extension: ", "Built via tsc -p ./ from extension/package.json. Uses CommonJS modules, shares src/core/ library via path aliases."),
            spacer(),

            heading("1.2 Shared Core (src/core/)", HeadingLevel.HEADING_2),
            para("The src/core/ directory is the shared library consumed by both the web app and the VSCode extension:"),
            spacer(),
            bulletBold("generators/ ", "— 10 language code generators (TypeScript, Java, Kotlin, Dart, Swift, Go, C#, Python, Rust, PHP)"),
            bulletBold("lib/converters/ ", "— prettifyJson.ts, validateJson.ts"),
            bulletBold("lib/diff/ ", "— Structural diff engine, merge engine, parser, visual-diff"),
            bulletBold("lib/diagnostics/ ", "— Comprehensive JSON diagnostics and auto-repair engine"),
            bulletBold("lib/transformations/ ", "— NEW: Visual transformations engine (rename, remove, case-convert, flatten, unflatten, extract)"),
            bulletBold("types/ ", "— Shared TypeScript interfaces for all tool configurations"),
            bulletBold("utils/ ", "— quicktype-helper.ts wrapper"),
            spacer(),

            heading("1.3 Integration Mechanism", HeadingLevel.HEADING_2),
            para("The extension imports shared core code via the @/core/* path alias, which works at two levels:"),
            spacer(),
            bulletBold("Compile time: ", "tsconfig.json maps @/core/* to ../src/core/*, so tsc resolves imports and compiles them into extension/dist/src/core/."),
            bulletBold("Runtime: ", "register-paths.ts patches Module._resolveFilename so require('@/core/...') resolves correctly inside VS Code."),
            spacer(),

            heading("1.4 tools_efficient.md Analysis", HeadingLevel.HEADING_2),
            para("The product improvement plan from src/docs/tools_efficient.md identifies 5 phases with 10 feature areas. The core principle is:"),
            spacer(),
            para('"Every task must remove mental effort, context switching, or broken-JSON pain. If it does not — do not build it."', { italics: true }),
            spacer(),

            makeTable(
                ["Feature", "Web App Before", "Extension Before", "Gap"],
                [
                    ["Auto-repair", "JSONFormatter only", "Via diagnostics", "Needs: all tools, paste event, toast"],
                    ["Keyboard shortcuts", "Ctrl+K only", "None", "Needs: Ctrl+Enter, Ctrl+S, help"],
                    ["Copy button", "Most tools", "N/A", "Needs: tree viewer copy"],
                    ["Large JSON perf", "No virtualization", "Monaco native", "Needs: Web Worker, virtualized tree"],
                    ["Structural diff", "Exists", "Exists", "Needs: collapse unchanged toggle"],
                    ["Visual transforms", "Case convert only", "None", "Needs: full transform tool"],
                    ["JSON explainer", "None", "None", "Needs: entire feature"],
                    ["Smarter types", "Basic quicktype", "Basic quicktype", "Needs: post-processing"],
                    ["One-screen flow", "Separate pages", "Command palette", "Needs: unified layout"],
                    ["Offline-first", "Client-side, no SW", "Native", "Needs: PWA, service worker"],
                ]
            ),

            // ============================================================
            // SECTION 2: PHASE 0 — EXTENSION CORE INTEGRATION
            // ============================================================
            spacer(),
            heading("2. Phase 0 — VSCode Extension Core Integration"),

            para("Before implementing the tools_efficient.md features, the VSCode extension needed to be brought to full feature parity with the web app."),
            spacer(),

            heading("2.1 What Was Already Working", HeadingLevel.HEADING_2),
            bullet("14 commands: format, minify, normalize, toJson5 + 10 code generators"),
            bullet("All operating on active editor text (selection or full document)"),
            bullet("Results open in new editor tabs beside the current one"),
            bullet("Context menu with submenu under 'JSON PowerHouse'"),
            spacer(),

            heading("2.2 What Was Added", HeadingLevel.HEADING_2),

            boldPara("Validate Command: ", "New validate.ts using core/lib/diagnostics/engine.ts. Shows VS Code inline diagnostics (errors/warnings/info), auto-validates on save/change with debounce, supports 'Apply All Fixes' action. Creates DiagnosticCollection and maps JsonIssue types to VS Code DiagnosticSeverity."),
            spacer(),

            boldPara("JSON Tree Viewer: ", "New tree-view.ts creating a WebviewPanel. Parses JSON, renders as interactive collapsible tree with type-colored values, search highlighting, expand/collapse all, copy JSON, copy individual values. Uses CSS variables matching VS Code theme."),
            spacer(),

            boldPara("JSON Diff/Merge: ", "New diff-view.ts creating a WebviewPanel. Uses core/lib/diff/engine parseAndDiff() for structural comparison. Displays side-by-side rows with color-coded added/removed/modified/type-changed markers. Shows summary badges and toggle for unchanged nodes."),
            spacer(),

            boldPara("Flatten/Unflatten: ", "New commands using core/lib/transformations/engine.ts. Takes active editor JSON, applies flatten/unflatten with '.' separator, opens result in new tab."),
            spacer(),

            boldPara("Configuration Settings: ", "Added VS Code settings under json-powerhouse namespace: formatting.indentation, formatting.keySorting, formatting.quoteStyle, formatting.trailingCommas, formatting.stripComments, diff.allowComments, diff.arrayStrategy, diff.arrayMatchKey, diff.showUnchanged, validateOnSave, validateOnChange."),
            spacer(),

            heading("2.3 Extension Files Modified/Created", HeadingLevel.HEADING_2),
            makeTable(
                ["File", "Action", "Description"],
                [
                    ["extension/package.json", "Modified", "20 commands (was 14), json5 dependency, configuration settings, grouped context menus"],
                    ["extension/src/extension.ts", "Rewritten", "All commands + validate/tree/diff/flatten integration"],
                    ["extension/src/validate.ts", "Created", "ValidateHandler class with DiagnosticCollection"],
                    ["extension/src/tree-view.ts", "Created", "TreeViewPanel webview with interactive tree"],
                    ["extension/src/diff-view.ts", "Created", "DiffViewPanel webview with structural diff"],
                    ["extension/unit-test.cjs", "Updated", "20 commands tested, flatten operation test"],
                    ["extension/test-loader.cjs", "Fixed", "Complete vscode mock for smoke test"],
                ]
            ),

            // ============================================================
            // SECTION 3: TASK 1.1 — AUTO-REPAIR
            // ============================================================
            spacer(),
            heading("3. Phase 1 — Auto-Repair Broken JSON (Task 1.1)"),

            para("Core principle: 'Paste anything — get usable JSON. This alone makes people bookmark.'"),
            spacer(),

            heading("3.1 The Problem", HeadingLevel.HEADING_2),
            para("Real JSON from APIs is almost never valid. It has trailing commas, single quotes, unquoted keys, comments, escaped JSON inside strings, or is partial/truncated. Most tools just show an error. JSON PowerHouse should fix it automatically."),
            spacer(),

            heading("3.2 Implementation: useAutoRepair Hook", HeadingLevel.HEADING_2),
            para("Created src/app/hooks/useAutoRepair.ts — a shared React hook used by ALL tools that accept JSON input."),
            spacer(),
            para("The hook:"),
            bullet("Runs diagnoseJson() from core/lib/diagnostics/engine on every input change"),
            bullet("Aggressively auto-applies safe fixes: autoApplied, FORMAT_ONLY, and SYNTAX_RECOVERABLE issues"),
            bullet("Applies patches by sorting fixes by range start descending and replacing substrings"),
            bullet("Returns: issues, appliedFixIds, repaired string, repairCount, isValid, error, toggleFix(), applyAllFixes()"),
            spacer(),

            heading("3.3 What diagnoseJson Detects & Fixes", HeadingLevel.HEADING_2),
            bullet("BOM (Byte Order Mark) — auto-removed"),
            bullet("Comments (// and /* */) — auto-stripped"),
            bullet("Trailing commas — auto-removed"),
            bullet("Single quotes — converted to double quotes"),
            bullet("Unquoted keys — wrapped in double quotes"),
            bullet("Unquoted string values — wrapped in double quotes"),
            bullet("Non-standard values (undefined, NaN, Infinity) — flagged"),
            bullet("Escaped/stringified JSON — unescaped"),
            bullet("JSON embedded in log text — extracted"),
            bullet("Partial/truncated JSON — auto-closed braces/quotes"),
            bullet("JSON5 syntax — tolerated when configured"),
            spacer(),

            heading("3.4 Where Auto-Repair Was Wired", HeadingLevel.HEADING_2),
            makeTable(
                ["Component", "How Auto-Repair Is Used"],
                [
                    ["JSONFormatter.tsx", "Was already using diagnoseJson directly. Kept existing logic."],
                    ["CodeGeneratorBase.tsx", "NEW: Uses useAutoRepair hook. Passes repaired JSON to generateCode() instead of raw input. Shows 'Repaired X' badge in workspace header."],
                    ["JsonTreeViewer.tsx", "NEW: Uses useAutoRepair hook. Parses repaired JSON for tree building. Shows repair count in stats bar."],
                    ["JSON5 client.tsx", "NEW: Uses useAutoRepair with allowComments:true. Shows 'Repaired X' badge in workspace header."],
                    ["JsonDiffViewer.tsx", "NEW: Uses useAutoRepair for BOTH left and right inputs. Diff comparison uses repaired JSON. Click-to-jump navigation uses repaired JSON."],
                    ["extension (extension.ts)", "Uses diagnoseJson directly in validate.ts handler. Shows repair info in output channel."],
                ]
            ),
            spacer(),

            heading("3.5 Visual Indicator", HeadingLevel.HEADING_2),
            para("Every tool shows a consistent 'Repaired X' badge in the workspace header toolbar:"),
            codeLine('<div className="...bg-[color-mix(in_srgb,var(--warning)_10%,transparent)]...">'),
            codeLine('  <span className="material-symbols-outlined">build</span>'),
            codeLine('  <span>Repaired {repairCount}</span>'),
            codeLine('</div>'),
            para("The badge uses the warning color and the 'build' icon, making it subtle but visible."),

            // ============================================================
            // SECTION 4: TASK 1.2 — ZERO-DECISION DEFAULTS
            // ============================================================
            spacer(),
            heading("4. Phase 1 — Zero-Decision Defaults (Task 1.2)"),

            para("Core principle: 'Faster than VS Code + extension. Tools make users think too much.'"),
            spacer(),

            heading("4.1 KeyboardShortcuts Component", HeadingLevel.HEADING_2),
            para("Created src/app/components/KeyboardShortcuts.tsx — a behavior-only component (renders null) that registers global keyboard listeners."),
            spacer(),
            para("Shortcuts implemented:"),
            bulletBold("Ctrl+Enter / Cmd+Enter: ", "Process — triggers the primary action (apply all fixes in formatter, etc.)"),
            bulletBold("Ctrl+Shift+C / Cmd+Shift+C: ", "Copy output — copies the generated/formatted output to clipboard"),
            bulletBold("Escape: ", "Clear — resets state (only when not focused on an input)"),
            spacer(),

            para("The component accepts callbacks as props and is wired into:"),
            bullet("JSONFormatter — Ctrl+Enter applies all fixes, Ctrl+Shift+C copies output"),
            bullet("CodeGeneratorBase — Ctrl+Shift+C copies generated code"),
            bullet("JsonTreeViewer — Ctrl+Shift+C copies JSON tree output"),
            bullet("JSON5 client — Ctrl+Shift+C copies converted output"),
            spacer(),

            heading("4.2 Copy Path on Tree Nodes", HeadingLevel.HEADING_2),
            para("Modified src/app/tools/json/viewer/components/JsonTreeNode.tsx to add 'Copy Path' and 'Copy' buttons on every node (visible on hover via group-hover)."),
            spacer(),
            para("The Copy Path button copies the dot-notation path (e.g., user.address.city) to clipboard. The Copy button copies the value at that node. Both show toast confirmation."),

            // ============================================================
            // SECTION 5: TASK 1.3 — PERFORMANCE
            // ============================================================
            spacer(),
            heading("5. Phase 1 — Performance for Large JSON (Task 1.3)"),

            para("Core principle: 'This did not crash = trust.' Most tools choke on real API payloads."),
            spacer(),

            heading("5.1 Web Worker for JSON Parsing", HeadingLevel.HEADING_2),
            para("Created src/workers/json-parse.worker.ts — a Web Worker that offloads JSON.parse from the main thread."),
            spacer(),
            para("Created src/app/hooks/useJsonWorker.ts — a hook that:"),
            bullet("Checks input size against threshold (100KB)"),
            bullet("For large files: spawns Worker, posts parse message, awaits response"),
            bullet("For small files: falls back to synchronous JSON.parse on main thread"),
            bullet("Handles Worker creation failures gracefully"),
            bullet("Returns: data, isParsing, error, parseTimeMs, sizeBytes, usedWorker"),
            spacer(),

            heading("5.2 Performance Stats Bar", HeadingLevel.HEADING_2),
            para("Added to JsonTreeViewer a stats bar showing:"),
            bullet("File size (formatted: B, KB, MB)"),
            bullet("JSON depth (recursive calculation)"),
            bullet("Type and count (e.g., Array[500], Object{12})"),
            bullet("Parse time in milliseconds"),
            bullet("Worker indicator when Web Worker was used"),
            bullet("Spinner during active parsing"),
            bullet("Repair count if auto-repair was applied"),

            // ============================================================
            // SECTION 6: TASK 2.1 — DIFF ENHANCEMENTS
            // ============================================================
            spacer(),
            heading("6. Phase 2 — Structural JSON Diff Enhancements (Task 2.1)"),

            para("Core principle: 'Line diffs are useless.' Compare JSON by path, not lines."),
            spacer(),

            heading("6.1 Collapse Unchanged Toggle", HeadingLevel.HEADING_2),
            para("Added a toggle button in the diff viewer sidebar header that switches between showing all nodes and showing only changed nodes."),
            spacer(),
            para("The button label changes between 'All' (showing everything) and 'Changes' (hiding unchanged). It updates the diffConfig.showUnchanged property, which the DiffNodeRenderer already respects (skips rendering unchanged nodes when showUnchanged is false)."),
            spacer(),
            para("The toggle is styled with the primary color when active (changes only) and muted color when showing all, providing clear visual feedback."),

            // ============================================================
            // SECTION 7: TASK 2.2 — VISUAL TRANSFORMATIONS
            // ============================================================
            spacer(),
            heading("7. Phase 2 — Visual Transformations Tool (Task 2.2)"),

            para("Core principle: 'Zero scripts. Zero regex. Real time.' Devs write throwaway scripts for this."),
            spacer(),

            heading("7.1 Core Engine", HeadingLevel.HEADING_2),
            para("Created src/core/lib/transformations/engine.ts with 6 operations:"),
            spacer(),
            bulletBold("rename-key: ", "Renames a key at a given dot-notation path. Immutable update using deep copy."),
            bulletBold("remove-key: ", "Removes a key at a path, or removes keys matching a regex pattern (applied recursively)."),
            bulletBold("case-convert: ", "Converts case of keys, values, or both. Supports camelCase, snake_case, kebab-case, PascalCase."),
            bulletBold("extract-subtree: ", "Extracts the value at a given path, returning it as the new root."),
            bulletBold("flatten: ", "Flattens nested objects to single-level with configurable separator (default '.'). e.g., {user:{name:'John'}} becomes {'user.name':'John'}"),
            bulletBold("unflatten: ", "Reverses flatten — converts flat keys back to nested structure."),
            spacer(),

            heading("7.2 Types", HeadingLevel.HEADING_2),
            para("Created src/core/lib/transformations/types.ts with:"),
            bullet("TransformOperationType union type"),
            bullet("TransformOperation interface (id, type, enabled, path, newKey, caseType, scope, separator, pattern)"),
            bullet("TransformResult interface (output, error, operationsApplied)"),
            bullet("generateOpId() helper function"),
            spacer(),

            heading("7.3 Web UI", HeadingLevel.HEADING_2),
            para("Created src/app/tools/json/transform/ with a full 3-panel UI:"),
            spacer(),
            bulletBold("Left panel: ", "JSON input editor with Sample, Paste, Clear buttons and auto-repair badge"),
            bulletBold("Center panel: ", "Operation builder — add operations from a grid, configure each with path/case/scope fields, reorder with up/down arrows, enable/disable toggle, delete button"),
            bulletBold("Right panel: ", "Live preview output with Copy button, operation count badge, error indicator"),
            spacer(),
            para("Additional features:"),
            bullet("'Apply to Input' button — applies output to input for chaining transformations"),
            bullet("Undo stack (10 levels) — reverts the last 'Apply to Input'"),
            bullet("Operations are processed in order — reordering changes the result"),
            spacer(),

            heading("7.4 Extension Commands", HeadingLevel.HEADING_2),
            para("Added to VSCode extension:"),
            bullet("json-powerhouse.flatten — Flattens JSON in active editor, opens result in new tab"),
            bullet("json-powerhouse.unflatten — Unflattens JSON in active editor, opens result in new tab"),
            bullet("Both commands added to context menu under 'JSON PowerHouse' submenu"),
            bullet("Total extension commands: 20 (up from 18)"),

            // ============================================================
            // SECTION 8: CONSISTENCY RULES
            // ============================================================
            spacer(),
            heading("8. Consistency Rules & Patterns"),

            para("These rules were followed throughout all implementations to ensure consistent behavior across web app and extension:"),
            spacer(),
            bullet("Shared core: All business logic lives in src/core/. Both web app and extension import from it."),
            bullet("Same repair behavior: diagnoseJson runs identically in web and extension."),
            bullet("Same UI language: 'Repaired X issues', 'Copy', 'Format' — same labels everywhere."),
            bullet("Same keyboard patterns: Ctrl+Enter = process, Ctrl+Shift+C = copy output."),
            bullet("Extension mirrors web: Every web tool gets a corresponding extension command where applicable."),
            bullet("No breaking existing: All new features are additive. Existing tools keep working."),
            bullet("Consistent badge style: Warning color badge with 'build' icon for repair indicators across all tools."),
            bullet("Consistent toolbar layout: Input bar (left) with Sample/Paste/Clear, Workspace bar (right) with status/Copy/Clear."),

            // ============================================================
            // SECTION 9: BUILD VERIFICATION
            // ============================================================
            spacer(),
            heading("9. Build Verification & Test Results"),

            heading("9.1 Web App Build", HeadingLevel.HEADING_2),
            makeTable(
                ["Metric", "Before", "After"],
                [
                    ["Total routes", "26", "27"],
                    ["New route", "—", "/tools/json/transform"],
                    ["Build status", "Pass", "Pass"],
                    ["TypeScript errors", "0", "0"],
                ]
            ),
            spacer(),

            heading("9.2 Extension Build", HeadingLevel.HEADING_2),
            makeTable(
                ["Metric", "Before", "After"],
                [
                    ["Total commands", "18", "20"],
                    ["New commands", "—", "flatten, unflatten"],
                    ["New modules", "—", "validate.ts, tree-view.ts, diff-view.ts"],
                    ["Compiled files", "4", "5 (+ validate, tree-view, diff-view)"],
                    ["Core modules compiled", "11", "18 (+ diagnostics, diff, transformations)"],
                    ["TypeScript errors", "0", "0"],
                ]
            ),
            spacer(),

            heading("9.3 Unit Tests", HeadingLevel.HEADING_2),
            para("All 12 tests pass:"),
            bullet("Activation successful"),
            bullet("All 20 commands registered"),
            bullet("Error handling (no editor) verified"),
            bullet("Command execution (format) verified"),
            bullet("Command execution (minify) verified"),
            bullet("Validate command error handling verified"),
            bullet("Validate command (valid JSON) verified"),
            bullet("Tree View error handling verified"),
            bullet("Tree View command verified"),
            bullet("Code generation (TypeScript) verified"),
            bullet("Flatten command verified"),
            bullet("Empty text handling verified"),

            // ============================================================
            // SECTION 10: REMAINING
            // ============================================================
            spacer(),
            heading("10. Remaining Tasks & Future Phases"),

            heading("10.1 Phase 3 — Thinking Tools", HeadingLevel.HEADING_2),
            bulletBold("JSON Explainer: ", "Path-based explanation panel showing required/optional inference, enum detection, nullable inference, breaking change detection from diff."),
            bulletBold("Smarter Type Generation: ", "Post-processors for TypeScript (union types, enum detection, optional fields, JSDoc) and C# (records, nullable ref types, JsonPropertyName attributes)."),
            spacer(),

            heading("10.2 Phase 4 — Workflow", HeadingLevel.HEADING_2),
            bulletBold("One-Screen Flow: ", "Left sidebar with tool navigation, shared input context that preserves state across tool switching, Ctrl+K quick switch command palette."),
            bulletBold("Offline-First / PWA: ", "Service Worker for caching, PWA manifest for installability, font caching strategy."),
            spacer(),

            heading("10.3 Phase 5 — Monetization", HeadingLevel.HEADING_2),
            para("Not yet started. Plan includes free tier (repair, format, basic types) and paid tier (large JSON, diff history, saved sessions, CI/API comparison, team sharing). No paywall on basics. Ever."),
            spacer(),
            spacer(),

            new Paragraph({
                children: [new TextRun({ text: "— End of Report —", italics: true, color: "999999", size: 20 })],
                alignment: AlignmentType.CENTER,
            }),
        ],
    }],
});

const outputPath = path.join(__dirname, "JSON-PowerHouse-Implementation-Report.docx");
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Document saved to: ${outputPath}`);
    console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
    console.error("Error generating document:", err);
    process.exit(1);
});
