# JSON PowerHouse – Instant JSON → Format JSON/ Code Convertions + Repair

> Paste broken JSON → get clean JSON and production-ready types instantly.

[![Visual Studio Code](https://img.shields.io/badge/VS_Code-Extension-blue)](https://marketplace.visualstudio.com/items?itemName=arjayabalan.json-powerhouse-vscode)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)](package.json)

---

## 🚀 What this extension does

- **Format & prettify JSON** with customizable indentation and sorting
- **Convert JSON → TypeScript / C# / Go / Java / Python / Dart / Kotlin / Swift / Rust**
- **Fix broken/invalid JSON** automatically
- **Validate JSON** in real-time as you type
- **Tree View** for navigating complex JSON structures
- **Diff comparison** between two JSON files
- Works instantly inside the editor with **one-click** or **keyboard shortcuts**

---

## ⚡ Why this is different

- Handles **broken / invalid JSON** that other tools reject
- Works with **real API responses** from your codebase
- **Zero config, one-click** usage for quick results
- Designed for **speed, not features** — get your types in seconds
- **Works offline** — no need for internet access

---

## 🧠 Example use case

```json
// messy API response
{'user_id': 1, name: "John",}
```

⬇️

```ts
interface User {
  userId: number;
  name: string;
}
```

---

## 🎯 Who is this for

- Backend devs working with APIs
- Frontend devs integrating JSON
- Anyone tired of broken JSON tools

---

## 📦 Supported Languages

Generate production-ready code in:

| Language | Command |
|----------|---------|
| TypeScript | `json-powerhouse.generateTypeScript` |
| C# | `json-powerhouse.generateCSharp` |
| Go | `json-powerhouse.generateGo` |
| Java | `json-powerhouse.generateJava` |
| Python | `json-powerhouse.generatePython` |
| Dart | `json-powerhouse.generateDart` |
| Kotlin | `json-powerhouse.generateKotlin` |
| Swift | `json-powerhouse.generateSwift` |
| Rust | `json-powerhouse.generateRust` |

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format JSON | `Ctrl+Shift+F` |
| Minify JSON | `Ctrl+Shift+M` |
| Validate JSON | `Ctrl+Shift+V` |
| Generate TypeScript | `Ctrl+Shift+T` |
| Generate C# | `Ctrl+Shift+C` |

*(Note: Shortcuts can be customized in VS Code settings)*

---

## 🔧 Configuration

Configure JSON PowerHouse via VS Code settings:

- **Formatting indentation**: 2, 4, tab, or 0
- **Key sorting**: none, ascending, or descending
- **Quote style**: double or single quotes
- **Trailing commas**: enable/disable
- **Auto-validate on save/change**: enable/disable

---

## 📋 Requirements

- Visual Studio Code 1.80.0 or higher

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

---

## 🤝 Support

For issues or feature requests, visit the [GitHub repository](https://github.com/1-arjayabalan-0/json-powerhouse).