import * as path from 'path';

// Use require to get the actual Modudle class, not a namespace wrapper.
const Module = require('module');

const originalResolveFilename = Module._resolveFilename;

// Determine the correct base path for core modules
// When extension.js is in dist/extension/src, we need dist/src/core
const extensionDir = __dirname;
const projectRoot = path.resolve(extensionDir, '../..');
const corePath = path.join(projectRoot, 'src', 'core');

Module._resolveFilename = function (request: string, parent: any, isMain: boolean, options: any) {
    if (request && request.startsWith('@/core')) {
        // Map @/core/* to projectRoot/src/core/*
        const relativePath = request.substring(7); // Remove '/core' from '@/core'
        const resolvedPath = path.join(corePath, relativePath);
        console.log(`[register-paths] Resolving ${request} to ${resolvedPath}`);
        return originalResolveFilename.call(this, resolvedPath, parent, isMain, options);
    }
    return originalResolveFilename.call(this, request, parent, isMain, options);
};
