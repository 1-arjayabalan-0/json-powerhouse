"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettifyJson = prettifyJson;
const json5_1 = require("json5");
// Helper function to strip comments from JSON string
function stripComments(jsonString) {
    const tokenRegex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(\/\*[\s\S]*?\*\/)|(\/\/.*$)/gm;
    return jsonString.replace(tokenRegex, (match, block, line) => {
        if (block || line)
            return '';
        return match;
    });
}
// Helper function to transform key case
function transformKeyCase(key, caseType) {
    switch (caseType) {
        case 'camelCase':
            return key.replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
        case 'snake_case':
            return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/[-\s]/g, '_');
        case 'kebab-case':
            return key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/[_\s]/g, '-');
        case 'PascalCase':
            const camel = key.replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
            return camel.charAt(0).toUpperCase() + camel.slice(1);
        default:
            return key;
    }
}
// Helper function to process object based on config
function processObject(obj, config) {
    if (obj === null) {
        return config.removeNull ? undefined : null;
    }
    if (Array.isArray(obj)) {
        const filtered = obj
            .map(item => processObject(item, config))
            .filter(item => {
            if (config.removeNull && item === null)
                return false;
            if (config.removeEmptyArrays && Array.isArray(item) && item.length === 0)
                return false;
            if (config.removeEmptyObjects && typeof item === 'object' && item !== null && Object.keys(item).length === 0)
                return false;
            return item !== undefined;
        });
        // Check if we should remove this empty array
        if (config.removeEmptyArrays && filtered.length === 0) {
            return undefined;
        }
        return filtered;
    }
    if (typeof obj === 'object') {
        const result = {};
        let keys = Object.keys(obj);
        // Sort keys if enabled
        if (config.keySorting === 'asc') {
            keys = keys.sort();
        }
        else if (config.keySorting === 'desc') {
            keys = keys.sort().reverse();
        }
        for (const key of keys) {
            const value = processObject(obj[key], config);
            // Skip if value should be removed
            if (value === undefined)
                continue;
            if (config.removeNull && value === null)
                continue;
            if (config.removeEmptyArrays && Array.isArray(value) && value.length === 0)
                continue;
            if (config.removeEmptyObjects && typeof value === 'object' && value !== null && Object.keys(value).length === 0)
                continue;
            // Transform key case
            const transformedKey = config.keyCase !== 'none' ? transformKeyCase(key, config.keyCase) : key;
            result[transformedKey] = value;
        }
        // Check if we should remove this empty object
        if (config.removeEmptyObjects && Object.keys(result).length === 0) {
            return undefined;
        }
        return result;
    }
    return obj;
}
function prettifyJson(jsonString, config) {
    try {
        let processedString = jsonString;
        // Strip comments if enabled
        if (config.stripComments) {
            processedString = stripComments(processedString);
        }
        // Normalize line breaks if enabled
        if (config.normalizeLineBreaks) {
            processedString = processedString.replace(/\r\n/g, '\n');
        }
        // Use JSON5.parse if useJSON5 is enabled to support more lenient input
        const parsed = config.useJSON5 ? json5_1.default.parse(processedString) : JSON.parse(processedString);
        // Process the object based on config
        const processed = processObject(parsed, config);
        // Determine indentation
        let indent;
        if (!config.pretty) {
            indent = 0; // Minify
        }
        else {
            switch (config.indentation) {
                case '2':
                    indent = 2;
                    break;
                case '4':
                    indent = 4;
                    break;
                case 'tab':
                    indent = '\t';
                    break;
                case '0':
                    indent = 0;
                    break;
                default:
                    indent = 2;
            }
        }
        let result = "";
        if (config.useJSON5) {
            result = json5_1.default.stringify(processed, null, indent);
            // JSON5 adds trailing commas by default. Remove them if user explicitly disabled them.
            if (!config.trailingCommas && config.pretty) {
                result = result.replace(/,(\s*[\]}])/g, '$1');
            }
        }
        else {
            result = JSON.stringify(processed, null, indent);
        }
        // Handle array formatting for single-line arrays
        if (config.arrayFormatting === 'single-line' && config.pretty) {
            // Convert multi-line arrays to single-line
            result = result.replace(/\[\s*\n\s*(.*?)\n\s*\]/g, (match, content) => {
                const items = content.split(',').map((item) => item.trim()).filter((item) => item);
                return `[${items.join(', ')}]`;
            });
        }
        // Handle quote style (convert double to single if needed)
        if (!config.useJSON5 && config.quoteStyle === 'single') {
            result = result.replace(/"([^"]+)":/g, "'$1':");
        }
        // Handle trailing commas (add them if enabled and pretty mode)
        if (config.trailingCommas && config.pretty && !config.useJSON5) {
            result = result.replace(/\n(\s*)([\]}])/g, ',\n$1$2');
        }
        // Normalize spaces if enabled
        if (config.normalizeSpaces) {
            result = result.replace(/\s+$/gm, ''); // Remove trailing spaces
        }
        return result;
    }
    catch (e) {
        return null; // invalid JSON
    }
}
//# sourceMappingURL=prettifyJson.js.map