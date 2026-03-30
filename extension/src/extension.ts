import './register-paths';
import * as vscode from 'vscode';
import { defaultConfig as defaultJSONConfig } from '@/core/types/json-formatter-config';
import { prettifyJson } from '@/core/lib/converters/prettifyJson';

import { generateCSharpCode } from '@/core/generators/json-to-csharp';
import { generateDartCode } from '@/core/generators/json-to-dart';
import { generateGoCode } from '@/core/generators/json-to-go';
import { generateJavaCode } from '@/core/generators/json-to-java';
import { generateKotlinCode } from '@/core/generators/json-to-kotlin';
import { generatePHPCode } from '@/core/generators/json-to-php';
import { generatePythonCode } from '@/core/generators/json-to-python';
import { generateRustCode } from '@/core/generators/json-to-rust';
import { generateSwiftCode } from '@/core/generators/json-to-swift';
import { generateTypeScriptCode } from '@/core/generators/json-to-typescript';

import {
    defaultCSharpConfig,
    defaultDartConfig,
    defaultGoConfig,
    defaultJavaConfig,
    defaultKotlinConfig,
    defaultPHPConfig,
    defaultPythonConfig,
    defaultRustConfig,
    defaultSwiftConfig,
    defaultTypeScriptConfig
} from '@/core/types/code-generator-config';

import { ValidateHandler } from './validate';
import { TreeViewPanel } from './tree-view';
import { DiffViewPanel } from './diff-view';

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
        const result = prettifyJson(text, config as any);

        if (!result) {
            log(`Failed to ${transformName} JSON. prettifyJson returned null.`, 'ERROR');
            vscode.window.showErrorMessage(`Failed to ${transformName} JSON. Check for syntax errors.`);
            return;
        }

        const doc = await vscode.workspace.openTextDocument({
            content: result,
            language: configOverrides.useJSON5 ? 'javascript' : 'json'
        });
        await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });
        log(`Successfully completed transform: ${transformName}`);

    } catch (error: any) {
        log(`Error transforming JSON: ${error.message}`, 'ERROR');
        vscode.window.showErrorMessage(`Error transforming JSON: ${error.message}`);
    }
}

async function handleCodeGeneration(generatorConfig: any, generatorFunc: any, languageId: string) {
    log(`Executing code generation for ${languageId}`);
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
        const generatedCode = await generatorFunc(text, generatorConfig);

        const doc = await vscode.workspace.openTextDocument({
            content: generatedCode,
            language: languageId
        });
        await vscode.window.showTextDocument(doc, { preview: false, viewColumn: vscode.ViewColumn.Beside });
        log(`Successfully generated code for ${languageId}`);

    } catch (error: any) {
        log(`Error generating code: ${error.message}`, 'ERROR');
        vscode.window.showErrorMessage(`Error generating code: ${error.message}`);
    }
}

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('JSON PowerHouse');
    diagnosticCollection = vscode.languages.createDiagnosticCollection('json-powerhouse');

    context.subscriptions.push(outputChannel);
    context.subscriptions.push(diagnosticCollection);

    log('Extension "json-powerhouse-vscode" is now active!');

    // Initialize validation handler
    const validateHandler = new ValidateHandler(diagnosticCollection, outputChannel);
    validateHandler.register(context);

    // JSON Formatters
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.format', () => {
        handleJsonTransform('format', { pretty: true, indentation: '2' });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.minify', () => {
        handleJsonTransform('minify', { pretty: false, indentation: '0', normalizeSpaces: true, normalizeLineBreaks: true });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.normalize', () => {
        handleJsonTransform('normalize', { pretty: true, indentation: '2', stripComments: true, normalizeSpaces: true, normalizeLineBreaks: true });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.toJson5', () => {
        handleJsonTransform('convert to JSON5', { pretty: true, indentation: '2', useJSON5: true, quoteStyle: 'single', trailingCommas: true, stripComments: false });
    }));

    // JSON Tree Viewer
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.treeView', () => {
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
            TreeViewPanel.createOrShow(context.extensionUri, text);
            log('JSON Tree Viewer opened');
        } catch (error: any) {
            log(`Error opening tree viewer: ${error.message}`, 'ERROR');
            vscode.window.showErrorMessage(`Error opening tree viewer: ${error.message}`);
        }
    }));

    // JSON Diff Viewer
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.diff', async () => {
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

            DiffViewPanel.createOrShow(context.extensionUri, leftText, rightText);
            log('JSON Diff Viewer opened');
        } catch (error: any) {
            log(`Error opening diff viewer: ${error.message}`, 'ERROR');
            vscode.window.showErrorMessage(`Error opening diff viewer: ${error.message}`);
        }
    }));

    // Code Generators
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateCSharp', () => {
        handleCodeGeneration(defaultCSharpConfig, generateCSharpCode, 'csharp');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateDart', () => {
        handleCodeGeneration(defaultDartConfig, generateDartCode, 'dart');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateGo', () => {
        handleCodeGeneration(defaultGoConfig, generateGoCode, 'go');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateJava', () => {
        handleCodeGeneration(defaultJavaConfig, generateJavaCode, 'java');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateKotlin', () => {
        handleCodeGeneration(defaultKotlinConfig, generateKotlinCode, 'kotlin');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generatePhp', () => {
        handleCodeGeneration(defaultPHPConfig, generatePHPCode, 'php');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generatePython', () => {
        handleCodeGeneration(defaultPythonConfig, generatePythonCode, 'python');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateRust', () => {
        handleCodeGeneration(defaultRustConfig, generateRustCode, 'rust');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateSwift', () => {
        handleCodeGeneration(defaultSwiftConfig, generateSwiftCode, 'swift');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('json-powerhouse.generateTypeScript', () => {
        handleCodeGeneration(defaultTypeScriptConfig, generateTypeScriptCode, 'typescript');
    }));
}

export function deactivate() {
    diagnosticCollection?.clear();
}
