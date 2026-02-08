import { compare, Operation } from 'fast-json-patch';
import * as jsonMergePatch from 'json-merge-patch';
import { DiffStrategy, ParsedJSON } from './types';

export interface DiffOptions {
    arrayStrategy?: 'index' | 'replace' | 'append' | 'id';
    idKey?: string;
}

export function generateDiff(
    a: ParsedJSON,
    b: ParsedJSON,
    strategy: DiffStrategy,
    options: DiffOptions = { arrayStrategy: 'index' }
): any {
    if (strategy === DiffStrategy.MERGE_PATCH_7396) {
        return jsonMergePatch.generate(a, b);
    }

    // RFC 6902
    // Basic implementation using fast-json-patch
    // fast-json-patch does not support complex array strategies out of the box in the same way.
    // However, we can simulate some behaviors if needed.
    // For now, we will stick to standard compare which is index-based.

    // If strategy is 'replace', we could treat arrays as atomic?
    // fast-json-patch doesn't have an option for that.

    return compare(a, b);
}

export function applyPatch(document: any, patch: any, strategy: DiffStrategy): any {
    if (strategy === DiffStrategy.MERGE_PATCH_7396) {
        return jsonMergePatch.apply(document, patch);
    }
    // RFC 6902
    // We need to import applyPatch from fast-json-patch
    const { applyPatch } = require('fast-json-patch');
    const result = applyPatch(document, patch);
    return result.newDocument;
}
