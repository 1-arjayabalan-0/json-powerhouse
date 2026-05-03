# CORE PRINCIPLE (keep this visible)

> Every task must remove mental effort, context switching, or broken-JSON pain.
> 
> 
> If it doesn’t → don’t build it.
> 

---

# PHASE 1 — Make V1 feel 10× better (HIGH PRIORITY)

### 1. Auto-repair broken JSON (🔥 biggest differentiator)

**Problem:** Real JSON is almost never valid.

**Tasks**

- Detect & fix:
    - Trailing commas
    - Single quotes → double quotes
    - Unquoted keys
    - JSON with comments (`//`, `/* */`)
    - Escaped JSON inside strings
- Accept:
    - Partial JSON
    - API response logs (strip headers / junk text)
- Show:
    - “Repaired X issues” indicator (subtle)

**Outcome**

> Paste anything → get usable JSON
> 
> 
> This alone makes people bookmark.
> 

---

### 2. Zero-decision defaults (UX task, not feature)

**Problem:** Tools make users think too much.

**Tasks**

- Auto-detect:
    - Minify vs prettify intent
    - Output language (TS / C# based on JSON shape or last usage)
- One-click copy (always visible)
- Keyboard shortcuts:
    - `Ctrl + Enter` → process
    - `Ctrl + C` → copy output
- No config panel in main flow

**Outcome**

> Faster than VS Code + extension.
> 

---

### 3. Performance for huge JSON

**Problem:** Most tools choke on real API payloads.

**Tasks**

- Virtualized rendering (don’t render entire tree)
- Chunk parsing (Web Worker)
- Graceful fallback:
    - “Tree view disabled for large payloads”
- Show file size + depth info

**Outcome**

> “This didn’t crash” = trust.
> 

---

# PHASE 2 — Things others avoid because they’re hard

### 4. Structural JSON diff (🔥 high value)

**Problem:** Line diffs are useless.

**Tasks**

- Compare JSON A vs JSON B
- Diff by **path**, not lines
- Highlight:
    - Added fields
    - Removed fields
    - Changed values
- Collapse unchanged nodes by default
- Click path → jump to node

**Outcome**

> “Why did this API break?” answered instantly.
> 

---

### 5. Visual transformations (no code)

**Problem:** Devs write throwaway scripts for this.

**Tasks**

- UI actions:
    - Rename key
    - Remove key
    - Convert case (snake ↔ camel)
    - Extract subtree
    - Flatten / nest
- Preview output instantly
- Undo / redo

**Outcome**

> Zero scripts. Zero regex. Real time.
> 

---

# PHASE 3 — Thinking tools (this is where it becomes “powerhouse”)

### 6. Explain the JSON (rare, valuable)

**Problem:** Generated types don’t explain *why*.

**Tasks**

- Path-based explanation panel:
    - `/user/address/street`
- Show:
    - Required vs optional (with reason)
    - Detected enums
    - Nullable inference
- Detect:
    - Breaking vs non-breaking changes (from diff)

**Outcome**

> Helps humans understand APIs, not just machines.
> 

---

### 7. Smarter type generation (upgrade your existing feature)

**Problem:** Current generators are dumb.

**Tasks**

- Better TS output:
    - Optional chaining
    - Union types
    - Enums instead of `string`
- Better C# output:
    - Records
    - Nullable reference types
    - Attributes (`JsonPropertyName`)
- Sync with transformations & repair logic

**Outcome**

> “These types actually work in my project.”
> 

---

# PHASE 4 — Workflow, not features

### 8. One-screen flow (critical)

**Problem:** Tool grids kill focus.

**Tasks**

- Single screen:
    - Input → Repair → Visualize → Transform → Export
- No page navigation
- State preserved in memory
- Clear primary action at every step

**Outcome**

> Feels like a tool, not a website.
> 

---

### 9. Offline-first

**Problem:** Devs don’t want cloud dependency.

**Tasks**

- Fully client-side processing
- No upload by default
- Explicit “cloud features” later

**Outcome**

> Trust + speed.
> 

---

# PHASE 5 — Monetization (ONLY after usage)

### 10. Pay only for real value

**Free**

- Repair
- Format
- Basic types

**Paid**

- Large JSON
- Diff history
- Saved sessions
- CI / API comparison
- Team sharing

No paywall on basics. Ever.