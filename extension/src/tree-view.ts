import './register-paths';
import * as vscode from 'vscode';

export class TreeViewPanel {
    public static currentPanel: TreeViewPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, jsonContent?: string): void {
        const column = vscode.ViewColumn.Beside;

        if (TreeViewPanel.currentPanel) {
            TreeViewPanel.currentPanel.panel.reveal(column);
            if (jsonContent) {
                TreeViewPanel.currentPanel.updateContent(jsonContent);
            }
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'jsonPowerhouseTreeView',
            'JSON Tree Viewer',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        TreeViewPanel.currentPanel = new TreeViewPanel(panel, extensionUri, jsonContent);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, jsonContent?: string) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        this.panel.webview.html = this.getWebviewContent(jsonContent || '{}');

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'copy':
                        vscode.env.clipboard.writeText(message.text);
                        vscode.window.showInformationMessage('Copied to clipboard');
                        return;
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        return;
                }
            },
            null,
            this.disposables
        );
    }

    public updateContent(jsonContent: string): void {
        this.panel.webview.html = this.getWebviewContent(jsonContent);
    }

    private dispose(): void {
        TreeViewPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    private getWebviewContent(jsonString: string): string {
        let parsed: any;
        let parseError = '';
        try {
            parsed = JSON.parse(jsonString);
        } catch (e: any) {
            parseError = e.message;
            parsed = null;
        }

        const treeHtml = parsed !== null ? this.renderTreeNode(parsed, true) : '';
        const escapedJson = this.escapeHtml(jsonString);
        const stats = parsed !== null ? this.getStats(parsed) : null;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Tree Viewer</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            color: var(--vscode-editor-foreground);
            background: var(--vscode-editor-background);
            padding: 16px;
            line-height: 1.5;
        }
        .toolbar {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
            align-items: center;
        }
        .toolbar input {
            flex: 1;
            min-width: 200px;
            padding: 4px 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border, transparent);
            border-radius: 2px;
            font-family: inherit;
            font-size: inherit;
        }
        .toolbar button {
            padding: 4px 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
        }
        .toolbar button:hover { background: var(--vscode-button-hoverBackground); }
        .stats {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
            padding: 4px 0;
        }
        .error {
            color: var(--vscode-errorForeground);
            padding: 12px;
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 2px;
            margin-bottom: 12px;
        }
        .tree { font-family: var(--vscode-editor-font-family); }
        .tree-node { margin-left: 20px; }
        .tree-node.root { margin-left: 0; }
        .tree-line {
            display: flex;
            align-items: flex-start;
            padding: 1px 0;
            cursor: default;
            border-radius: 2px;
        }
        .tree-line:hover { background: var(--vscode-list-hoverBackground); }
        .tree-line.highlight { background: var(--vscode-editor-findMatchHighlightBackground); }
        .toggle {
            cursor: pointer;
            user-select: none;
            width: 16px;
            height: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: var(--vscode-icon-foreground);
            font-size: 10px;
        }
        .toggle:hover { color: var(--vscode-textLink-foreground); }
        .toggle.empty { visibility: hidden; }
        .key {
            color: var(--vscode-symbolIcon-variableForeground, #9cdcfe);
            margin-right: 0;
        }
        .colon { color: var(--vscode-editor-foreground); margin: 0 4px; }
        .value { word-break: break-all; }
        .type-string { color: var(--vscode-debugTokenExpression-string, #ce9178); }
        .type-number { color: var(--vscode-debugTokenExpression-number, #b5cea8); }
        .type-boolean { color: var(--vscode-debugTokenExpression-boolean, #569cd6); }
        .type-null { color: var(--vscode-debugTokenExpression-value, #569cd6); font-style: italic; }
        .type-bracket { color: var(--vscode-editor-foreground); }
        .type-keyword { color: var(--vscode-keyword-foreground, #c586c0); }
        .children { overflow: hidden; }
        .children.collapsed { display: none; }
        .summary { color: var(--vscode-descriptionForeground); font-size: 12px; }
        .copy-btn {
            margin-left: 8px;
            cursor: pointer;
            opacity: 0;
            font-size: 11px;
            color: var(--vscode-textLink-foreground);
            background: none;
            border: none;
            padding: 0 4px;
        }
        .tree-line:hover .copy-btn { opacity: 1; }
        .copy-btn:hover { color: var(--vscode-textLink-activeForeground); }
    </style>
</head>
<body>
    <div class="toolbar">
        <input type="text" id="searchInput" placeholder="Search keys or values..." />
        <button onclick="expandAll()">Expand All</button>
        <button onclick="collapseAll()">Collapse All</button>
        <button onclick="copyAll()">Copy JSON</button>
    </div>
    ${parseError ? `<div class="error">Parse Error: ${this.escapeHtml(parseError)}</div>` : ''}
    ${stats ? `<div class="stats">${stats}</div>` : ''}
    <div class="tree" id="tree">
        ${treeHtml}
    </div>
    <script>
        const vscode = acquireVsCodeApi();

        document.querySelectorAll('.toggle').forEach(el => {
            el.addEventListener('click', function() {
                const children = this.parentElement.nextElementSibling;
                if (children && children.classList.contains('children')) {
                    children.classList.toggle('collapsed');
                    this.textContent = children.classList.contains('collapsed') ? '\\u25B6' : '\\u25BC';
                }
            });
        });

        document.querySelectorAll('.copy-btn').forEach(el => {
            el.addEventListener('click', function() {
                vscode.postMessage({ command: 'copy', text: this.getAttribute('data-copy') });
            });
        });

        document.getElementById('searchInput').addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            document.querySelectorAll('.tree-line').forEach(el => {
                el.classList.remove('highlight');
                if (query && el.textContent.toLowerCase().includes(query)) {
                    el.classList.add('highlight');
                    let parent = el.parentElement;
                    while (parent) {
                        if (parent.classList && parent.classList.contains('children')) {
                            parent.classList.remove('collapsed');
                            const toggle = parent.previousElementSibling && parent.previousElementSibling.querySelector('.toggle');
                            if (toggle) toggle.textContent = '\\u25BC';
                        }
                        parent = parent.parentElement;
                    }
                }
            });
        });

        function expandAll() {
            document.querySelectorAll('.children.collapsed').forEach(el => {
                el.classList.remove('collapsed');
                const toggle = el.previousElementSibling && el.previousElementSibling.querySelector('.toggle');
                if (toggle) toggle.textContent = '\\u25BC';
            });
        }

        function collapseAll() {
            document.querySelectorAll('.children').forEach(el => {
                if (!el.classList.contains('root-children')) {
                    el.classList.add('collapsed');
                    const toggle = el.previousElementSibling && el.previousElementSibling.querySelector('.toggle');
                    if (toggle) toggle.textContent = '\\u25B6';
                }
            });
        }

        function copyAll() {
            vscode.postMessage({ command: 'copy', text: ${JSON.stringify(jsonString)} });
        }
    </script>
</body>
</html>`;
    }

    private getStats(data: any): string {
        const count = (obj: any): { keys: number; values: number; depth: number } => {
            if (obj === null || typeof obj !== 'object') {
                return { keys: 0, values: 1, depth: 0 };
            }
            if (Array.isArray(obj)) {
                let totalKeys = 0, totalValues = 0, maxDepth = 0;
                for (const item of obj) {
                    const sub = count(item);
                    totalKeys += sub.keys;
                    totalValues += sub.values;
                    maxDepth = Math.max(maxDepth, sub.depth);
                }
                return { keys: totalKeys, values: totalValues, depth: maxDepth + 1 };
            }
            const keys = Object.keys(obj);
            let totalValues = 0, maxDepth = 0;
            for (const k of keys) {
                const sub = count(obj[k]);
                totalValues += sub.values;
                maxDepth = Math.max(maxDepth, sub.depth);
            }
            return { keys: keys.length + (totalValues > 0 ? 0 : 0), values: totalValues, depth: maxDepth + 1 };
        };
        const stats = count(data);
        const type = Array.isArray(data) ? 'Array' : 'Object';
        const entries = Array.isArray(data) ? data.length : Object.keys(data).length;
        return `${type} with ${entries} top-level entries | ${stats.values} total values | Depth: ${stats.depth}`;
    }

    private renderTreeNode(data: any, isRoot: boolean = false): string {
        if (data === null) {
            return `<span class="value type-null">null</span>`;
        }

        if (typeof data !== 'object') {
            return this.renderValue(data);
        }

        const isArray = Array.isArray(data);
        const entries = isArray ? data.map((v: any, i: number) => [i.toString(), v]) : Object.entries(data);
        const openBracket = isArray ? '[' : '{';
        const closeBracket = isArray ? ']' : '}';
        const count = entries.length;
        const summary = isArray ? `${count} items` : `${count} keys`;
        const isEmpty = count === 0;

        if (isEmpty) {
            return `<span class="type-bracket">${openBracket}${closeBracket}</span> <span class="summary">(${summary})</span>`;
        }

        let childrenHtml = '';
        for (const [key, value] of entries) {
            const valueHtml = (value !== null && typeof value === 'object')
                ? this.renderTreeNode(value)
                : this.renderValue(value);

            const keyHtml = isArray
                ? `<span class="type-number">${key}</span>`
                : `<span class="key">"${this.escapeHtml(key)}"</span>`;
            const colonHtml = `<span class="colon">:</span>`;

            const toggleClass = (value !== null && typeof value === 'object' && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0))
                ? 'toggle' : 'toggle empty';

            const copyValue = JSON.stringify(value);
            childrenHtml += `<div class="tree-line">
                <span class="${toggleClass}">\u25BC</span>
                ${keyHtml}${colonHtml}${valueHtml}
                <button class="copy-btn" data-copy="${this.escapeHtml(copyValue)}">copy</button>
            </div>`;

            if (value !== null && typeof value === 'object') {
                const childEntries = Array.isArray(value) ? value : Object.entries(value);
                if (childEntries.length > 0) {
                    childrenHtml += `<div class="children">${this.renderTreeNode(value)}</div>`;
                }
            }
        }

        const rootClass = isRoot ? ' root' : '';
        return `<div class="tree-node${rootClass}">
            <div class="tree-line">
                <span class="toggle">\u25BC</span>
                <span class="type-bracket">${openBracket}</span>
                <span class="summary">(${summary})</span>
            </div>
            <div class="children${isRoot ? ' root-children' : ''}">${childrenHtml}
                <div class="tree-line"><span class="toggle empty"> </span><span class="type-bracket">${closeBracket}</span></div>
            </div>
        </div>`;
    }

    private renderValue(value: any): string {
        if (typeof value === 'string') {
            return `<span class="value type-string">"${this.escapeHtml(value)}"</span>`;
        }
        if (typeof value === 'number') {
            return `<span class="value type-number">${value}</span>`;
        }
        if (typeof value === 'boolean') {
            return `<span class="value type-boolean">${value}</span>`;
        }
        if (value === null) {
            return `<span class="value type-null">null</span>`;
        }
        return `<span class="value">${this.escapeHtml(String(value))}</span>`;
    }
}
