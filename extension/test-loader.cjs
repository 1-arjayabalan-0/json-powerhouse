const Module = require('module');
const orig = Module.prototype.require;
Module.prototype.require = function (request) {
    if (request === 'vscode') return {
        commands: { registerCommand: () => ({ dispose: () => {} }) },
        window: {
            createOutputChannel: () => ({ appendLine: () => {}, dispose: () => {} }),
            createWebviewPanel: () => ({
                webview: { html: '', onDidReceiveMessage: () => ({ dispose: () => {} }), postMessage: () => {} },
                onDidDispose: () => ({ dispose: () => {} }),
                dispose: () => {}
            }),
            showErrorMessage: () => {},
            showInformationMessage: () => {},
            showWarningMessage: () => {},
        },
        workspace: {
            openTextDocument: () => Promise.resolve({}),
            getConfiguration: () => ({ get: (k, d) => d }),
            onDidOpenTextDocument: () => ({ dispose: () => {} }),
            onDidSaveTextDocument: () => ({ dispose: () => {} }),
            onDidChangeTextDocument: () => ({ dispose: () => {} }),
        },
        languages: {
            createDiagnosticCollection: () => ({ set: () => {}, clear: () => {}, dispose: () => {} })
        },
        env: { clipboard: { writeText: () => {} } },
        Uri: { parse: (s) => s, file: (p) => p },
        DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2, Hint: 3 },
        Diagnostic: function() {},
        Range: function() {},
        ViewColumn: { Beside: 1 }
    };
    return orig.apply(this, arguments);
};
try {
    require('./dist/extension/src/extension.js');
    console.log('Successfully loaded extension module!');
} catch (e) {
    console.error('Failed to load extension module:', e);
    process.exit(1);
}
