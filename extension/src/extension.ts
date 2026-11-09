import './register-paths';
import * as vscode from 'vscode';
import { defaultConfig as defaultJSONConfig } from '@/core/types/json-formatter-config';
import { prettifyJson } from '@/core/lib/converters/prettifyJson';
import { diagnoseJson } from '@/core/lib/diagnostics/engine';

import { registerGenerators } from './generators';
import { initTelemetry, registerTrackedCommand, shutdownTelemetry } from './telemetry';
import { ValidateHandler } from './validate';
import { TreeViewPanel } from './tree-view';
import { DiffViewPanel } from './diff-view';
import { transformJson } from '@/core/lib/transformations/engine';

let outputChannel: vscode.OutputChannel;
let diagnosticCollection: vscode.DiagnosticCollection;

function log(message: string, level: 'INFO' | 'ERROR' = 'INFO') {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] [${level}] ${message}`);
}

function getFormattingConfig(): Record<string, any> {
    const cfg = vscode.workspace.getConfiguration('json-powerhouse.formatting');
    return {
        indentation: cfg.get('indentation', '2'),
        keySorting: cfg.get('keySorting', 'none'),
        quoteStyle: cfg.get('quoteStyle', 'double'),
        trailingCommas: cfg.get('trailingCommas', false),
        stripComments: cfg.get('stripComments', true),
    };
}

interface RepairResult {
    /** Repaired, strictly valid JSON, or null when it could not be repaired safely. */
    json: string | null;
    /** One plain-language line per kind of problem that was fixed. */
    fixes: string[];
    /** True when the input was truncated and closing brackets were added. */
    partial: boolean;
    /** Explanation of the first problem, for the error message when repair fails. */
    firstProblem?: string;
}

/**
 * Repairs common mistakes with the shared diagnostics engine (the same one the website's
 * formatter uses). It only makes mechanical fixes: quotes, commas, comments, BOM, log noise,
 * stringified JSON and missing closing brackets. Values and keys are never changed.
 */
function repairJson(text: string): RepairResult {
    const report = diagnoseJson(text);
    const fixes = [...new Set(report.issues.map(i => i.message))];
    return {
        json: report.status === 'invalid' ? null : report.fixedJson,
        fixes,
        // The engine reports truncation repairs with this message (it has no issue codes).
        partial: report.issues.some(i => i.message.includes('partial/truncated')),
        firstProblem: report.issues[0]?.message,
    };
}

async function handleJsonTransform(transformName: string, configOverrides: any) {
    log(`Executing transform: ${transformName}`);
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        log('No active editor found', 'ERROR');
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

    if (!text.trim()) {
        log('No text selected and document is empty', 'ERROR');
        vscode.window.showErrorMessage('Please select some JSON text or open a JSON file');
        return;
    }

    try {
        const userConfig = getFormattingConfig();
        const config = { ...defaultJSONConfig, ...userConfig, ...configOverrides };
        let result = prettifyJson(text, config as any);
        let repair: RepairResult | undefined;

        // Broken JSON (single quotes, unquoted keys, trailing commas, log noise, truncation…):
        // repair it with the same engine the website uses, then format the repaired JSON.
        if (!result) {
            repair = repairJson(text);
            if (repair.json) result = prettifyJson(repair.json, config as any);
        }

        if (!result) {
            const reason = repair?.firstProblem ? ` ${repair.firstProblem}` : ' Check for syntax errors.';
            log(`Failed to ${transformName} JSON: could not repair the input.`, 'ERROR');
            vscode.window.showErrorMessage(`Couldn't ${transformName} this JSON.${reason}`);
            return;
        }

        const doc = await vscode.workspace.openTextDocument({
            content: result,
            language: configOverrides.useJSON5 ? 'javascript' : 'json'
        });
        await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });
        log(`Successfully completed transform: ${transformName}`);

        if (repair?.json) {
            log(`Repaired before ${transformName}: ${repair.fixes.join('; ')}`);
            if (repair.partial) {
                vscode.window.showWarningMessage('The JSON was cut off, so the missing closing brackets were added. Check the end of the result.');
            } else {
                vscode.window.showInformationMessage(`Fixed the JSON before running ${transformName}. Problems found: ${repair.fixes.join(' ')}`);
            }
        }

    } catch (error: any) {
        log(`Error transforming JSON: ${error.message}`, 'ERROR');
        vscode.window.showErrorMessage(`Error transforming JSON: ${error.message}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    initTelemetry(context);
    outputChannel = vscode.window.createOutputChannel('JSON PowerHouse');
    diagnosticCollection = vscode.languages.createDiagnosticCollection('json-powerhouse');

    context.subscriptions.push(outputChannel);
    context.subscriptions.push(diagnosticCollection);

    log('Extension "json-powerhouse-vscode" is now active!');

    // Initialize validation handler
    const validateHandler = new ValidateHandler(diagnosticCollection, outputChannel);
    validateHandler.register(context);

    // JSON Formatters
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.format', () => {
        return handleJsonTransform('format', { pretty: true, indentation: '2' });
    }));
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.minify', () => {
        return handleJsonTransform('minify', { pretty: false, indentation: '0', normalizeSpaces: true, normalizeLineBreaks: true });
    }));
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.normalize', () => {
        return handleJsonTransform('normalize', { pretty: true, indentation: '2', stripComments: true, normalizeSpaces: true, normalizeLineBreaks: true });
    }));
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.toJson5', () => {
        return handleJsonTransform('convert to JSON5', { pretty: true, indentation: '2', useJSON5: true, quoteStyle: 'single', trailingCommas: true, stripComments: false });
    }));

    // JSON Transformations
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.flatten', () => {
        log('Executing transform: flatten');
        const editor = vscode.window.activeTextEditor;
        if (!editor) { vscode.window.showErrorMessage('No active editor found'); return; }
        const text = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
        if (!text.trim()) { vscode.window.showErrorMessage('No JSON text found'); return; }
        try {
            const result = transformJson(text, [{ id: 'flatten', type: 'flatten', enabled: true, separator: '.' }]);
            if (result.error) { vscode.window.showErrorMessage(`Flatten failed: ${result.error}`); return; }
            vscode.workspace.openTextDocument({ content: result.output, language: 'json' })
                .then(doc => vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside }));
        } catch (e: any) { vscode.window.showErrorMessage(`Flatten failed: ${e.message}`); }
    }));

    context.subscriptions.push(registerTrackedCommand('json-powerhouse.unflatten', () => {
        log('Executing transform: unflatten');
        const editor = vscode.window.activeTextEditor;
        if (!editor) { vscode.window.showErrorMessage('No active editor found'); return; }
        const text = editor.selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);
        if (!text.trim()) { vscode.window.showErrorMessage('No JSON text found'); return; }
        try {
            const result = transformJson(text, [{ id: 'unflatten', type: 'unflatten', enabled: true, separator: '.' }]);
            if (result.error) { vscode.window.showErrorMessage(`Unflatten failed: ${result.error}`); return; }
            vscode.workspace.openTextDocument({ content: result.output, language: 'json' })
                .then(doc => vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside }));
        } catch (e: any) { vscode.window.showErrorMessage(`Unflatten failed: ${e.message}`); }
    }));

    // JSON Tree Viewer
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.treeView', () => {
        log('Opening JSON Tree Viewer');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found. Open a JSON file first.');
            return;
        }

        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);

        if (!text.trim()) {
            vscode.window.showErrorMessage('No JSON content found.');
            return;
        }

        try {
            TreeViewPanel.createOrShow(context.extension.extensionUri, text);
            log('JSON Tree Viewer opened');
        } catch (error: any) {
            log(`Error opening tree viewer: ${error.message}`, 'ERROR');
            vscode.window.showErrorMessage(`Error opening tree viewer: ${error.message}`);
        }
    }));

    // JSON Diff Viewer
    context.subscriptions.push(registerTrackedCommand('json-powerhouse.diff', async () => {
        log('Opening JSON Diff Viewer');

        const leftUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select Left JSON File (Original)',
            filters: { 'JSON': ['json', 'jsonc', 'json5'] }
        });

        if (!leftUri || leftUri.length === 0) {
            return;
        }

        const rightUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: 'Select Right JSON File (Modified)',
            filters: { 'JSON': ['json', 'jsonc', 'json5'] }
        });

        if (!rightUri || rightUri.length === 0) {
            return;
        }

        try {
            const leftDoc = await vscode.workspace.openTextDocument(leftUri[0]);
            const rightDoc = await vscode.workspace.openTextDocument(rightUri[0]);
            const leftText = leftDoc.getText();
            const rightText = rightDoc.getText();

            DiffViewPanel.createOrShow(context.extension.extensionUri, leftText, rightText);
            log('JSON Diff Viewer opened');
        } catch (error: any) {
            log(`Error opening diff viewer: ${error.message}`, 'ERROR');
            vscode.window.showErrorMessage(`Error opening diff viewer: ${error.message}`);
        }
    }));

    // Code & schema generators, the "All Generators…" picker and quick options
    registerGenerators(context, log);
}

export function deactivate() {
    diagnosticCollection?.clear();
    return shutdownTelemetry();
}
