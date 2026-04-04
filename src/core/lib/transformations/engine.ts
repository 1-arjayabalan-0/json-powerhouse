import { TransformOperation, TransformResult, CaseType } from './types';

/**
 * Apply a chain of transformation operations to JSON.
 */
export function transformJson(jsonString: string, operations: TransformOperation[]): TransformResult {
    try {
        const parsed = JSON.parse(jsonString);
        let result = parsed;
        let opsApplied = 0;

        for (const op of operations) {
            if (!op.enabled) continue;

            switch (op.type) {
                case 'rename-key':
                    result = renameKey(result, op.path || '', op.newKey || '');
                    opsApplied++;
                    break;
                case 'remove-key':
                    if (op.pattern) {
                        result = removeByPattern(result, op.pattern);
                    } else {
                        result = removeKey(result, op.path || '');
                    }
                    opsApplied++;
                    break;
                case 'case-convert':
                    result = convertCase(result, op.caseType || 'camelCase', op.scope || 'keys');
                    opsApplied++;
                    break;
                case 'extract-subtree':
                    result = extractSubtree(result, op.path || '');
                    opsApplied++;
                    break;
                case 'flatten':
                    result = flatten(result, op.separator || '.');
                    opsApplied++;
                    break;
                case 'unflatten':
                    result = unflatten(result, op.separator || '.');
                    opsApplied++;
                    break;
            }
        }

        return {
            output: JSON.stringify(result, null, 2),
            error: null,
            operationsApplied: opsApplied,
        };
    } catch (e: any) {
        return {
            output: '',
            error: e.message || 'Invalid JSON',
            operationsApplied: 0,
        };
    }
}

/**
 * Rename a key at a given path.
 * path: dot-notation path to the parent, or empty for root-level rename.
 * newKey: the new name for the key.
 */
function renameKey(obj: any, path: string, newKey: string): any {
    if (!newKey) return obj;

    const segments = path.split('.').filter(Boolean);
    const targetKey = segments.pop(); // Last segment is the key to rename

    if (!targetKey) {
        // Root level: can't rename root
        return obj;
    }

    return deepUpdate(obj, segments, (parent) => {
        if (parent && typeof parent === 'object' && targetKey in parent) {
            const { [targetKey]: value, ...rest } = parent;
            return { ...rest, [newKey]: value };
        }
        return parent;
    });
}

/**
 * Remove a key at a given path.
 */
function removeKey(obj: any, path: string): any {
    const segments = path.split('.').filter(Boolean);
    if (segments.length === 0) return obj;

    const keyToRemove = segments[segments.length - 1];
    const parentPath = segments.slice(0, -1);

    return deepUpdate(obj, parentPath, (parent) => {
        if (parent && typeof parent === 'object' && keyToRemove in parent) {
            if (Array.isArray(parent)) {
                return parent.filter((_, i) => i.toString() !== keyToRemove);
            }
            const { [keyToRemove]: _, ...rest } = parent;
            return rest;
        }
        return parent;
    });
}

/**
 * Remove keys matching a regex pattern (applied recursively).
 */
function removeByPattern(obj: any, pattern: string): any {
    let regex: RegExp;
    try {
        regex = new RegExp(pattern, 'i');
    } catch {
        return obj;
    }

    function process(value: any): any {
        if (Array.isArray(value)) {
            return value.map(process);
        }
        if (value && typeof value === 'object') {
            const result: any = {};
            for (const [key, val] of Object.entries(value)) {
                if (!regex.test(key)) {
                    result[key] = process(val);
                }
            }
            return result;
        }
        return value;
    }

    return process(obj);
}

/**
 * Convert the case of keys and/or values.
 */
function convertCase(obj: any, caseType: CaseType, scope: 'keys' | 'values' | 'both'): any {
    function transformKey(key: string): string {
        switch (caseType) {
            case 'camelCase':
                return key.replace(/[-_\s](.)/g, (_, char: string) => char.toUpperCase());
            case 'snake_case':
                return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/[-\s]/g, '_');
            case 'kebab-case':
                return key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/[_\s]/g, '-');
            case 'PascalCase': {
                const camel = key.replace(/[-_\s](.)/g, (_, char: string) => char.toUpperCase());
                return camel.charAt(0).toUpperCase() + camel.slice(1);
            }
            default:
                return key;
        }
    }

    function transformStringValue(val: string): string {
        return transformKey(val); // Same logic for string values
    }

    function process(value: any): any {
        if (Array.isArray(value)) {
            return value.map(item =>
                scope !== 'keys' && typeof item === 'string' ? transformStringValue(item) : process(item)
            );
        }
        if (value && typeof value === 'object') {
            const result: any = {};
            for (const [key, val] of Object.entries(value)) {
                const newKey = scope !== 'values' ? transformKey(key) : key;
                const newVal = scope !== 'keys' && typeof val === 'string'
                    ? transformStringValue(val)
                    : process(val);
                result[newKey] = newVal;
            }
            return result;
        }
        return value;
    }

    return process(obj);
}

/**
 * Extract a subtree at a given path.
 */
function extractSubtree(obj: any, path: string): any {
    const segments = path.split('.').filter(Boolean);
    let current = obj;

    for (const seg of segments) {
        if (current && typeof current === 'object' && seg in current) {
            current = current[seg];
        } else {
            return obj; // Path not found, return original
        }
    }

    return current;
}

/**
 * Flatten a nested object into a single-level object with dot-separated keys.
 */
function flatten(obj: any, separator: string = '.'): any {
    const result: any = {};

    function process(current: any, prefix: string): void {
        if (Array.isArray(current)) {
            current.forEach((item, index) => {
                process(item, prefix ? `${prefix}${separator}${index}` : `${index}`);
            });
        } else if (current && typeof current === 'object') {
            for (const [key, val] of Object.entries(current)) {
                process(val, prefix ? `${prefix}${separator}${key}` : key);
            }
        } else {
            result[prefix] = current;
        }
    }

    process(obj, '');
    return result;
}

/**
 * Unflatten a flat object back to nested structure.
 */
function unflatten(obj: any, separator: string = '.'): any {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        return obj;
    }

    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
        const segments = key.split(separator);
        let current = result;

        for (let i = 0; i < segments.length - 1; i++) {
            const seg = segments[i];
            if (!(seg in current) || typeof current[seg] !== 'object') {
                // Determine if next segment is numeric (array index)
                const nextSeg = segments[i + 1];
                current[seg] = /^\d+$/.test(nextSeg) ? [] : {};
            }
            current = current[seg];
        }

        const lastSeg = segments[segments.length - 1];
        if (Array.isArray(current)) {
            const idx = parseInt(lastSeg, 10);
            current[idx] = value;
        } else {
            current[lastSeg] = value;
        }
    }

    return result;
}

/**
 * Helper: Deep update a value at a path in a nested object (immutable).
 */
function deepUpdate(obj: any, path: string[], updater: (val: any) => any): any {
    if (path.length === 0) {
        return updater(obj);
    }

    const [head, ...rest] = path;

    if (Array.isArray(obj)) {
        const idx = parseInt(head, 10);
        if (!isNaN(idx) && idx < obj.length) {
            const newArr = [...obj];
            newArr[idx] = deepUpdate(newArr[idx], rest, updater);
            return newArr;
        }
        return obj;
    }

    if (obj && typeof obj === 'object' && head in obj) {
        return {
            ...obj,
            [head]: deepUpdate(obj[head], rest, updater),
        };
    }

    return obj;
}
