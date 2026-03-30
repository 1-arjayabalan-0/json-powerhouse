import * as path from 'path';

// Use require to get the actual Modudle class, not a namespace wrapper.
const Module = require('module');

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
    if (request && request.startsWith('@/core')) {
        // __dirname is `dist/extension/src`.
        // We want to map to `dist/src/core`.
        // path.join(__dirname, '../../src/core', ...)
        const resolvedPath = path.join(__dirname, '../../src/core', request.substring(7));
        return originalResolveFilename.call(this, resolvedPath, parent, isMain, options);
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
};
