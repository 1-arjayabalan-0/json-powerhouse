const Module = require('module');
const assert = require('assert');

// Mock vscode
const registeredCommands = new Map();
let lastError = null;
let lastInfo = null;
let createdPanels = [];
let diagnostics = new Map();

const vscodeMock = {
    commands: {
        registerCommand: (id, handler) => {
            registeredCommands.set(id, handler);
            return { dispose: () => { } };
        }
    },
    window: {
        createOutputChannel: () => ({
            appendLine: () => { },
            append: () => { },
            show: () => { },
            clear: () => { },
            dispose: () => { }
        }),
        showErrorMessage: (msg) => { lastError = msg; },
        showWarningMessage: (msg, ...args) => { lastError = msg; return Promise.resolve(undefined); },
        showInformationMessage: (msg, ...args) => { lastInfo = msg; return Promise.resolve(undefined); },
        activeTextEditor: null,
        showTextDocument: () => Promise.resolve(),
        createWebviewPanel: (viewType, title, options, opts) => {
            const panel = {
                viewType,
                title,
                webview: {
                    html: '',
                    onDidReceiveMessage: () => ({ dispose: () => { } }),
                    postMessage: () => { }
                },
                onDidDispose: () => ({ dispose: () => { } }),
                reveal: () => { },
                dispose: () => { }
            };
            createdPanels.push(panel);
            return panel;
        },
        visibleTextEditors: [],
        showOpenDialog: () => Promise.resolve(undefined)
    },
    workspace: {
        openTextDocument: (options) => {
            if (typeof options === 'string') {
                return Promise.resolve({
                    getText: () => '{}',
                    fileName: options,
                    languageId: 'json',
                    uri: { toString: () => options }
                });
            }
            return Promise.resolve({
                getText: () => options ? (options.content || '{}') : '{}',
                fileName: 'untitled',
                languageId: options && options.language === 'javascript' ? 'javascript' : 'json',
                uri: { toString: () => 'untitled' }
            });
        },
        getConfiguration: (section) => ({
            get: (key, defaultValue) => defaultValue,
        }),
        onDidOpenTextDocument: () => ({ dispose: () => { } }),
        onDidSaveTextDocument: () => ({ dispose: () => { } }),
        onDidChangeTextDocument: () => ({ dispose: () => { } }),
    },
    languages: {
        createDiagnosticCollection: (name) => {
            const collection = {
                set: (uri, diags) => { diagnostics.set(uri.toString(), diags); },
                clear: () => { diagnostics.clear(); },
                delete: () => { },
                dispose: () => { }
            };
            return collection;
        }
    },
    DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2, Hint: 3 },
    Diagnostic: function(range, message, severity) {
        this.range = range;
        this.message = message;
        this.severity = severity;
    },
    Range: function(startLine, startCol, endLine, endCol) {
        this.start = { line: startLine, character: startCol };
        this.end = { line: endLine, character: endCol };
    },
    Uri: {
        parse: (s) => ({ toString: () => s }),
        file: (p) => ({ toString: () => p })
    },
    ViewColumn: { Beside: 1 },
    ExtensionContext: {},
    env: {
        clipboard: { writeText: () => {} }
    },
    Selection: function() { this.isEmpty = true; }
};

const orig = Module.prototype.require;
Module.prototype.require = function (request) {
    if (request === 'vscode') return vscodeMock;
    return orig.apply(this, arguments);
};

const extension = require('./dist/extension/src/extension.js');

async function runTests() {
    console.log('--- Starting Unit Tests ---');

    // 1. Activation
    const context = { subscriptions: [] };
    extension.activate(context);
    console.log('✓ Activation successful');

    // 2. Verify all commands are registered
    const expectedCommands = [
        'json-powerhouse.format',
        'json-powerhouse.minify',
        'json-powerhouse.normalize',
        'json-powerhouse.toJson5',
        'json-powerhouse.validate',
        'json-powerhouse.treeView',
        'json-powerhouse.diff',
        'json-powerhouse.applyFix',
        'json-powerhouse.generateCSharp',
        'json-powerhouse.generateDart',
        'json-powerhouse.generateGo',
        'json-powerhouse.generateJava',
        'json-powerhouse.generateKotlin',
        'json-powerhouse.generatePhp',
        'json-powerhouse.generatePython',
        'json-powerhouse.generateRust',
        'json-powerhouse.generateSwift',
        'json-powerhouse.generateTypeScript'
    ];

    for (const cmd of expectedCommands) {
        assert(registeredCommands.has(cmd), `Command ${cmd} not registered`);
    }
    console.log(`✓ All ${expectedCommands.length} commands registered`);

    // 3. Test error path (no active editor)
    lastError = null;
    vscodeMock.window.activeTextEditor = null;
    await registeredCommands.get('json-powerhouse.format')();
    assert.strictEqual(lastError, 'No active editor found');
    console.log('✓ Error handling (no editor) verified');

    // 4. Test success path (basic formatting)
    lastError = null;
    const testJson = '{"a":1}';
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => testJson,
            languageId: 'json'
        }
    };
    await registeredCommands.get('json-powerhouse.format')();
    assert.strictEqual(lastError, null);
    console.log('✓ Command execution (format) verified');

    // 5. Test minify
    lastError = null;
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => '{"a": 1, "b": 2}',
            languageId: 'json'
        }
    };
    await registeredCommands.get('json-powerhouse.minify')();
    assert.strictEqual(lastError, null);
    console.log('✓ Command execution (minify) verified');

    // 6. Test validate command (no editor)
    lastError = null;
    vscodeMock.window.activeTextEditor = null;
    await registeredCommands.get('json-powerhouse.validate')();
    assert.strictEqual(lastError, 'No active editor found');
    console.log('✓ Validate command error handling verified');

    // 7. Test validate command (with editor)
    lastError = null;
    lastInfo = null;
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => '{"valid": true}',
            languageId: 'json',
            fileName: 'test.json',
            uri: { toString: () => 'file:///test.json' }
        }
    };
    await registeredCommands.get('json-powerhouse.validate')();
    assert.strictEqual(lastError, null);
    console.log('✓ Validate command (valid JSON) verified');

    // 8. Test tree view command (no editor)
    lastError = null;
    vscodeMock.window.activeTextEditor = null;
    await registeredCommands.get('json-powerhouse.treeView')();
    assert.strictEqual(lastError, 'No active editor found. Open a JSON file first.');
    console.log('✓ Tree View error handling verified');

    // 9. Test tree view command (with editor)
    lastError = null;
    createdPanels = [];
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => '{"name": "test", "value": 42}',
            languageId: 'json',
            fileName: 'test.json',
            uri: { toString: () => 'file:///test.json' }
        }
    };
    await registeredCommands.get('json-powerhouse.treeView')();
    assert.strictEqual(lastError, null);
    assert(createdPanels.length > 0, 'Tree view webview panel should be created');
    console.log('✓ Tree View command verified');

    // 10. Test code generation (TypeScript)
    lastError = null;
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => '{"name": "John", "age": 30}',
            languageId: 'json'
        }
    };
    await registeredCommands.get('json-powerhouse.generateTypeScript')();
    assert.strictEqual(lastError, null);
    console.log('✓ Code generation (TypeScript) verified');

    // 11. Test empty text handling
    lastError = null;
    vscodeMock.window.activeTextEditor = {
        selection: { isEmpty: true },
        document: {
            getText: () => '   ',
            languageId: 'json'
        }
    };
    await registeredCommands.get('json-powerhouse.format')();
    assert.strictEqual(lastError, 'Please select some JSON text or open a JSON file');
    console.log('✓ Empty text handling verified');

    console.log('--- All Tests Passed ---');
}

runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
});
