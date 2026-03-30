import './register-paths';
import * as vscode from 'vscode';
import { diagnoseJson } from '@/core/lib/diagnostics/engine';

export class ValidateHandler {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private outputChannel: vscode.OutputChannel;
    private debounceTimer: NodeJS.Timeout | undefined;
    private fixMap: Map<string, { uri: vscode.Uri; issueId: string; replacement: string }> = new Map();

    constructor(
        diagnosticCollection: vscode.DiagnosticCollection,
        outputChannel: vscode.OutputChannel
    ) {
        this.diagnosticCollection = diagnosticCollection;
        this.outputChannel = outputChannel;
    }

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(
            vscode.commands.registerCommand('json-powerhouse.validate', () => this.validateActiveEditor())
        );

        context.subscriptions.push(
            vscode.commands.registerCommand('json-powerhouse.applyFix', (uri: vscode.Uri, issueId: string) => {
                this.applyFix(uri, issueId);
            })
        );

        context.subscriptions.push(
            vscode.workspace.onDidOpenTextDocument(doc => {
                if (this.isJsonDocument(doc)) {
                    this.validateDocument(doc);
                }
            })
        );

        context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(doc => {
                if (this.isJsonDocument(doc) &&
                    vscode.workspace.getConfiguration('json-powerhouse').get('validateOnSave', true)) {
                    this.validateDocument(doc);
                }
            })
        );

        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(event => {
                if (this.isJsonDocument(event.document) &&
                    vscode.workspace.getConfiguration('json-powerhouse').get('validateOnChange', true)) {
                    this.debounceValidation(event.document);
                }
            })
        );
    }

    private isJsonDocument(doc: vscode.TextDocument): boolean {
        return doc.languageId === 'json' || doc.languageId === 'jsonc';
    }

    private debounceValidation(document: vscode.TextDocument): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
            this.validateDocument(document);
        }, 500);
    }

    private validateActiveEditor(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        this.validateDocument(editor.document);
    }

    private validateDocument(document: vscode.TextDocument): void {
        const text = document.getText();
        const report = diagnoseJson(text, {
            allowComments: document.languageId === 'jsonc',
            attemptLogStripping: true,
            attemptUnescaping: true,
            attemptPartialRepair: true
        });

        const diagnostics: vscode.Diagnostic[] = [];
        this.clearFixesForUri(document.uri);

        for (const issue of report.issues) {
            const line = Math.max(0, (issue.location.line || 1) - 1);
            const col = Math.max(0, (issue.location.column || 1) - 1);
            const endLine = line;
            let endCol = col + 1;

            if (issue.range && issue.range.end > issue.range.start) {
                const textAfterStart = text.substring(issue.range.start);
                const nextNewline = textAfterStart.indexOf('\n');
                endCol = col + (nextNewline === -1 ? textAfterStart.length : Math.min(issue.range.end - issue.range.start, nextNewline));
            }

            const range = new vscode.Range(line, col, endLine, endCol);

            let severity: vscode.DiagnosticSeverity;
            switch (issue.type) {
                case 'SYNTAX_FATAL':
                    severity = vscode.DiagnosticSeverity.Error;
                    break;
                case 'SYNTAX_RECOVERABLE':
                    severity = vscode.DiagnosticSeverity.Warning;
                    break;
                case 'FORMAT_ONLY':
                    severity = vscode.DiagnosticSeverity.Information;
                    break;
                case 'SUSPICIOUS':
                    severity = vscode.DiagnosticSeverity.Hint;
                    break;
                default:
                    severity = vscode.DiagnosticSeverity.Error;
            }

            const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
            diagnostic.source = 'JSON PowerHouse';

            if (issue.resolution.autoApplied && issue.resolution.suggestedFixes.length > 0) {
                const fix = issue.resolution.suggestedFixes[0];
                if (fix.replacement !== undefined) {
                    diagnostic.code = {
                        value: issue.id,
                        target: vscode.Uri.parse(`command:json-powerhouse.applyFix?${encodeURIComponent(JSON.stringify([document.uri.toString(), issue.id]))}`)
                    };

                    this.fixMap.set(`${document.uri.toString()}::${issue.id}`, {
                        uri: document.uri,
                        issueId: issue.id,
                        replacement: fix.replacement
                    });
                }
            }

            diagnostics.push(diagnostic);
        }

        this.diagnosticCollection.set(document.uri, diagnostics);

        if (report.status === 'valid') {
            this.outputChannel.appendLine(`[Validate] ${document.fileName}: Valid JSON`);
            if (diagnostics.length === 0) {
                vscode.window.showInformationMessage('JSON is valid!');
            }
        } else if (report.status === 'fixed') {
            this.outputChannel.appendLine(`[Validate] ${document.fileName}: Fixable issues found (confidence: ${report.confidence})`);
            const autoFixable = report.issues.filter(i => i.resolution.autoApplied).length;
            if (autoFixable > 0) {
                vscode.window.showWarningMessage(
                    `JSON has ${report.issues.length} issue(s). ${autoFixable} auto-fixable.`,
                    'Apply All Fixes'
                ).then(action => {
                    if (action === 'Apply All Fixes') {
                        this.applyAllFixes(document.uri);
                    }
                });
            }
        } else {
            this.outputChannel.appendLine(`[Validate] ${document.fileName}: Invalid JSON (${report.issues.length} issues)`);
        }
    }

    private clearFixesForUri(uri: vscode.Uri): void {
        const prefix = uri.toString() + '::';
        for (const key of this.fixMap.keys()) {
            if (key.startsWith(prefix)) {
                this.fixMap.delete(key);
            }
        }
    }

    private applyFix(uri: vscode.Uri, issueId: string): void {
        const key = `${uri.toString()}::${issueId}`;
        const fixInfo = this.fixMap.get(key);
        if (!fixInfo) {
            vscode.window.showWarningMessage('Fix information not found. Re-run validation.');
            return;
        }

        const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === uri.toString());
        if (!editor) {
            vscode.window.showErrorMessage('Editor not found for the file.');
            return;
        }

        const document = editor.document;
        const text = document.getText();

        const issues = diagnoseJson(text, { attemptLogStripping: true, attemptUnescaping: true, attemptPartialRepair: true }).issues;
        const issue = issues.find(i => i.id === issueId);

        if (!issue || !issue.range) {
            vscode.window.showWarningMessage('Could not locate the issue range in the document.');
            return;
        }

        const startPos = issue.range.start;
        const endPos = issue.range.end;

        let startLine = 0, startCol = 0, currentPos = 0;
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const lineLen = lines[i].length;
            if (currentPos + lineLen >= startPos) {
                startLine = i;
                startCol = startPos - currentPos;
                break;
            }
            currentPos += lineLen + 1;
        }

        let endLine = 0, endCol = 0;
        currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
            const lineLen = lines[i].length;
            if (currentPos + lineLen >= endPos) {
                endLine = i;
                endCol = endPos - currentPos;
                break;
            }
            currentPos += lineLen + 1;
        }

        const range = new vscode.Range(startLine, startCol, endLine, endCol);

        editor.edit(editBuilder => {
            editBuilder.replace(range, fixInfo.replacement);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Fix applied successfully.');
                this.debounceValidation(editor.document);
            }
        });
    }

    private applyAllFixes(uri: vscode.Uri): void {
        const editor = vscode.window.visibleTextEditors.find(e => e.document.uri.toString() === uri.toString());
        if (!editor) return;

        const document = editor.document;
        const text = document.getText();
        const report = diagnoseJson(text, { attemptLogStripping: true, attemptUnescaping: true, attemptPartialRepair: true });

        if (report.fixedJson) {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editor.edit(editBuilder => {
                editBuilder.replace(fullRange, report.fixedJson!);
            }).then(success => {
                if (success) {
                    vscode.window.showInformationMessage('All fixes applied.');
                    this.validateDocument(editor.document);
                }
            });
        }
    }
}
