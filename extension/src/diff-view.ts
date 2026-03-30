import './register-paths';
import * as vscode from 'vscode';
import { parseAndDiff, DiffResult } from '@/core/lib/diff/engine';
import { DiffNode, JsonDiffConfig, defaultDiffConfig } from '@/core/types/diff-config';

export class DiffViewPanel {
    public static currentPanel: DiffViewPanel | undefined;
    private readonly panel: vscode.WebviewPanel;
    private readonly extensionUri: vscode.Uri;
    private disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri, leftContent?: string, rightContent?: string): void {
        const column = vscode.ViewColumn.Beside;

        if (DiffViewPanel.currentPanel) {
            DiffViewPanel.currentPanel.panel.reveal(column);
            if (leftContent !== undefined && rightContent !== undefined) {
                DiffViewPanel.currentPanel.updateContent(leftContent, rightContent);
            }
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'jsonPowerhouseDiff',
            'JSON Diff Viewer',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        DiffViewPanel.currentPanel = new DiffViewPanel(panel, extensionUri, leftContent, rightContent);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, leftContent?: string, rightContent?: string) {
        this.panel = panel;
        this.extensionUri = extensionUri;

        this.panel.webview.html = this.getWebviewContent(leftContent || '{}', rightContent || '{}');

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'copy':
                        vscode.env.clipboard.writeText(message.text);
                        vscode.window.showInformationMessage('Copied to clipboard');
                        return;
                }
            },
            null,
            this.disposables
        );
    }

    public updateContent(leftContent: string, rightContent: string): void {
        this.panel.webview.html = this.getWebviewContent(leftContent, rightContent);
    }

    private dispose(): void {
        DiffViewPanel.currentPanel = undefined;
        this.panel.dispose();
        while (this.disposables.length) {
            const d = this.disposables.pop();
            if (d) { d.dispose(); }
        }
    }

    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    private getWebviewContent(leftJson: string, rightJson: string): string {
        const config: JsonDiffConfig = {
            ...defaultDiffConfig,
            ...this.getDiffConfigOverrides()
        };

        const diffResult = parseAndDiff(leftJson, rightJson, config);
        const diffRows = this.renderDiffRows(diffResult.root, config);
        const summary = diffResult.summary;

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON Diff Viewer</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
            color: var(--vscode-editor-foreground);
            background: var(--vscode-editor-background);
            padding: 16px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            flex-wrap: wrap;
            gap: 8px;
        }
        .summary-bar {
            display: flex;
            gap: 16px;
            font-size: 13px;
        }
        .summary-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .badge {
            display: inline-block;
            padding: 1px 6px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: bold;
            color: #fff;
        }
        .badge-added { background: var(--vscode-gitDecoration-addedResourceForeground, #81b88b); }
        .badge-removed { background: var(--vscode-gitDecoration-deletedResourceForeground, #c74e39); }
        .badge-modified { background: var(--vscode-gitDecoration-modifiedResourceForeground, #e2c08d); }
        .badge-type { background: var(--vscode-gitDecoration-untrackedResourceForeground, #73c991); }
        .badge-unchanged { background: var(--vscode-descriptionForeground); opacity: 0.5; }
        .toolbar {
            display: flex;
            gap: 8px;
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
        .error {
            color: var(--vscode-errorForeground);
            padding: 12px;
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 2px;
            margin-bottom: 12px;
        }
        .diff-table {
            width: 100%;
            border-collapse: collapse;
            font-family: var(--vscode-editor-font-family);
            font-size: var(--vscode-editor-font-size);
        }
        .diff-table th {
            text-align: left;
            padding: 4px 8px;
            background: var(--vscode-editorGroupHeader-tabsBackground);
            border-bottom: 1px solid var(--vscode-panel-border);
            font-weight: normal;
            color: var(--vscode-descriptionForeground);
            position: sticky;
            top: 0;
        }
        .diff-table td {
            padding: 2px 8px;
            vertical-align: top;
            white-space: pre-wrap;
            word-break: break-all;
            border-bottom: 1px solid var(--vscode-panel-border, transparent);
        }
        .diff-table tr:hover td { background: var(--vscode-list-hoverBackground); }
        .line-num {
            width: 40px;
            min-width: 40px;
            text-align: right;
            color: var(--vscode-editorLineNumber-foreground);
            user-select: none;
            padding-right: 8px;
        }
        .path-cell {
            color: var(--vscode-symbolIcon-variableForeground, #9cdcfe);
            font-weight: bold;
            white-space: nowrap;
            min-width: 120px;
        }
        .value-cell { width: 45%; }
        .added td { background: rgba(130, 200, 130, 0.1); }
        .added .value-cell { color: var(--vscode-gitDecoration-addedResourceForeground, #81b88b); }
        .removed td { background: rgba(200, 100, 100, 0.1); }
        .removed .value-cell { color: var(--vscode-gitDecoration-deletedResourceForeground, #c74e39); }
        .modified td { background: rgba(220, 180, 100, 0.1); }
        .modified .value-cell { color: var(--vscode-gitDecoration-modifiedResourceForeground, #e2c08d); }
        .type-changed td { background: rgba(100, 180, 220, 0.1); }
        .type-changed .value-cell { color: var(--vscode-gitDecoration-untrackedResourceForeground, #73c991); }
        .unchanged .value-cell { color: var(--vscode-descriptionForeground); }
        .indent { display: inline-block; width: 16px; }
        .marker { font-weight: bold; margin-right: 4px; }
        .marker-add { color: var(--vscode-gitDecoration-addedResourceForeground, #81b88b); }
        .marker-del { color: var(--vscode-gitDecoration-deletedResourceForeground, #c74e39); }
        .marker-mod { color: var(--vscode-gitDecoration-modifiedResourceForeground, #e2c08d); }
    </style>
</head>
<body>
    <div class="header">
        <div class="summary-bar">
            ${diffResult.error ? `<div class="error">${this.escapeHtml(diffResult.error)}</div>` : ''}
            <div class="summary-item"><span class="badge badge-added">+${summary.added}</span> Added</div>
            <div class="summary-item"><span class="badge badge-removed">-${summary.removed}</span> Removed</div>
            <div class="summary-item"><span class="badge badge-modified">~${summary.modified}</span> Modified</div>
            ${summary.typeChanged > 0 ? `<div class="summary-item"><span class="badge badge-type">!${summary.typeChanged}</span> Type Changed</div>` : ''}
        </div>
        <div class="toolbar">
            <button onclick="toggleUnchanged()">Toggle Unchanged</button>
            <button onclick="expandAll()">Expand All</button>
            <button onclick="collapseAll()">Collapse All</button>
        </div>
    </div>
    <table class="diff-table">
        <thead>
            <tr>
                <th></th>
                <th>Path</th>
                <th>Left (Original)</th>
                <th>Right (Modified)</th>
            </tr>
        </thead>
        <tbody>
            ${diffRows}
        </tbody>
    </table>
    <script>
        let showUnchanged = false;
        function toggleUnchanged() {
            showUnchanged = !showUnchanged;
            document.querySelectorAll('.unchanged').forEach(el => {
                el.style.display = showUnchanged ? '' : 'none';
            });
        }
        function expandAll() {
            document.querySelectorAll('.children-row').forEach(el => el.style.display = '');
        }
        function collapseAll() {
            document.querySelectorAll('.children-row').forEach(el => el.style.display = 'none');
        }
        document.querySelectorAll('.unchanged').forEach(el => el.style.display = 'none');
    </script>
</body>
</html>`;
    }

    private getDiffConfigOverrides(): Partial<JsonDiffConfig> {
        const cfg = vscode.workspace.getConfiguration('json-powerhouse');
        return {
            allowComments: cfg.get('diff.allowComments', true),
            arrayStrategy: cfg.get('diff.arrayStrategy', 'index') as any,
            arrayMatchKey: cfg.get('diff.arrayMatchKey', 'id'),
            showUnchanged: cfg.get('diff.showUnchanged', false),
        };
    }

    private renderDiffRows(node: DiffNode, config: JsonDiffConfig, depth: number = 0): string {
        let html = '';
        const indent = '<span class="indent"></span>'.repeat(depth);

        const markerMap: Record<string, string> = {
            'added': '<span class="marker marker-add">+</span>',
            'removed': '<span class="marker marker-del">-</span>',
            'modified': '<span class="marker marker-mod">~</span>',
            'type-changed': '<span class="marker marker-mod">!</span>',
            'unchanged': '<span class="marker"> </span>',
        };

        const marker = markerMap[node.changeType] || '';

        if (node.children && node.children.length > 0) {
            const bracket = node.isArrayItem ? '[]' : '{}';
            html += `<tr class="${node.changeType}">
                <td class="line-num">${marker}</td>
                <td class="path-cell">${indent}${this.escapeHtml(node.key)} <span style="color:var(--vscode-descriptionForeground);font-weight:normal">(${bracket})</span></td>
                <td class="value-cell"></td>
                <td class="value-cell"></td>
            </tr>`;

            for (const child of node.children) {
                if (child.changeType === 'unchanged' && !config.showUnchanged) {
                    continue;
                }
                html += this.renderDiffRows(child, config, depth + 1);
            }
        } else {
            const oldValue = this.formatValue(node.oldValue);
            const newValue = this.formatValue(node.newValue);

            const rowClass = node.changeType === 'unchanged' ? 'unchanged' : node.changeType;

            html += `<tr class="${rowClass}">
                <td class="line-num">${marker}</td>
                <td class="path-cell">${indent}${this.escapeHtml(node.key)}</td>
                <td class="value-cell">${oldValue}</td>
                <td class="value-cell">${newValue}</td>
            </tr>`;
        }

        return html;
    }

    private formatValue(value: any): string {
        if (value === undefined) {
            return '<span style="color:var(--vscode-descriptionForeground);font-style:italic">undefined</span>';
        }
        if (value === null) {
            return '<span class="type-null">null</span>';
        }
        if (typeof value === 'string') {
            return `<span style="color:#ce9178">"${this.escapeHtml(value)}"</span>`;
        }
        if (typeof value === 'number') {
            return `<span style="color:#b5cea8">${value}</span>`;
        }
        if (typeof value === 'boolean') {
            return `<span style="color:#569cd6">${value}</span>`;
        }
        if (Array.isArray(value)) {
            return `<span style="color:var(--vscode-descriptionForeground)">[${value.length} items]</span>`;
        }
        if (typeof value === 'object') {
            return `<span style="color:var(--vscode-descriptionForeground)">{${Object.keys(value).length} keys}</span>`;
        }
        return this.escapeHtml(String(value));
    }
}
