import * as vscode from 'vscode';
import { generateTypeScriptCode } from '@/core/generators/json-to-typescript';
import { defaultTypeScriptConfig } from '@/core/types/code-generator-config';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "json-powerhouse-vscode" is now active!');

    let disposable = vscode.commands.registerCommand('json-powerhouse.generateTypeScript', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

        if (!text.trim()) {
            vscode.window.showErrorMessage('Please select some JSON text or open a JSON file');
            return;
        }

        try {
            // Validate JSON
            JSON.parse(text);

            // Generate Code
            const tsCode = await generateTypeScriptCode(text, defaultTypeScriptConfig);

            // Open in new window
            const doc = await vscode.workspace.openTextDocument({
                content: tsCode,
                language: 'typescript'
            });
            await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });

        } catch (error: any) {
            vscode.window.showErrorMessage(`Error generating TypeScript: ${error.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
