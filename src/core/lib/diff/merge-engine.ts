import { compare, Operation, applyPatch as applyJsonPatch, getValueByPointer } from "fast-json-patch";
import * as jsonMergePatch from "json-merge-patch";
import { normalize } from "./parser";
import { Conflict, DiffStrategy, MergeResult, ParsedJSON } from "./types";

export interface MergeOptions {
    arrayStrategy?: 'index' | 'replace' | 'id';
}

export function threeWayMerge(
    base: any,
    left: any,
    right: any,
    strategy: DiffStrategy = DiffStrategy.JSON_PATCH_6902,
    options: MergeOptions = { arrayStrategy: 'index' }
): MergeResult {
    const normBase = normalize(base);
    const normLeft = normalize(left);
    const normRight = normalize(right);

    if (strategy === DiffStrategy.MERGE_PATCH_7396) {
        // RFC 7396
        const patchLeftObj = jsonMergePatch.generate(normBase, normLeft) || {};
        const patchRightObj = jsonMergePatch.generate(normBase, normRight) || {};

        const conflicts = detectMergePatchConflicts(patchLeftObj, patchRightObj, normBase, normLeft, normRight);

        // Auto-merge non-conflicting changes?
        // For simplicity in UI, we might just return the "Right" document as the starting point
        // But ideally we merge what we can.
        // Let's just return the Right document as "Merged" initially, 
        // OR apply the non-conflicting parts of Left to Right.

        // For now, return Right as the "Result" canvas.
        return {
            patchLeft: [patchLeftObj], // Wrap in array to match generic type if needed, or cast
            patchRight: [patchRightObj],
            conflicts,
            mergedDocument: normRight,
            strategy
        };
    }

    // RFC 6902
    // TODO: Implement arrayStrategy logic (index vs replace vs id)
    // Currently defaults to 'index' via fast-json-patch
    const patchLeft = compare(normBase, normLeft);
    const patchRight = compare(normBase, normRight);

    const conflicts = detectJsonPatchConflicts(patchLeft, patchRight, normBase, normLeft, normRight);

    return {
        patchLeft,
        patchRight,
        conflicts,
        mergedDocument: normRight,
        strategy
    };
}

function detectJsonPatchConflicts(
    p1: Operation[],
    p2: Operation[],
    base: any,
    left: any,
    right: any
): Conflict[] {
    const conflicts: Conflict[] = [];

    // Naive O(N*M) check for now, or Map optimization
    // We also need to check for path prefixes: /a vs /a/b

    for (const op1 of p1) {
        for (const op2 of p2) {
            if (isConflictingPath(op1.path, op2.path)) {
                // Check if they are actually doing the same thing
                if (JSON.stringify(op1) === JSON.stringify(op2)) {
                    continue;
                }

                conflicts.push({
                    path: op1.path, // Use the path from Left as the primary key?
                    baseValue: getValueByPointer(base, op1.path),
                    leftValue: getValueByPointer(left, op1.path),
                    rightValue: getValueByPointer(right, op2.path),
                    resolution: undefined
                });
            }
        }
    }

    // Deduplicate conflicts by path
    const uniqueConflicts = new Map<string, Conflict>();
    conflicts.forEach(c => uniqueConflicts.set(c.path, c));

    return Array.from(uniqueConflicts.values());
}

function isConflictingPath(path1: string, path2: string): boolean {
    if (path1 === path2) return true;
    if (path1.startsWith(path2 + '/')) return true;
    if (path2.startsWith(path1 + '/')) return true;
    return false;
}

function detectMergePatchConflicts(
    p1: any,
    p2: any,
    base: any,
    left: any,
    right: any,
    path: string = ''
): Conflict[] {
    const conflicts: Conflict[] = [];

    const keys = new Set([...Object.keys(p1), ...Object.keys(p2)]);

    for (const key of keys) {
        const currentPath = path ? `${path}/${key}` : `/${key}`;
        const v1 = p1[key];
        const v2 = p2[key];

        if (v1 === undefined || v2 === undefined) {
            // One side didn't touch this key, no conflict here
            continue;
        }

        // Both touched this key
        // If both are objects, recurse
        if (isObject(v1) && isObject(v2)) {
            conflicts.push(...detectMergePatchConflicts(v1, v2, base, left, right, currentPath));
        } else {
            // Primitive values or one is object/one is primitive
            if (JSON.stringify(v1) !== JSON.stringify(v2)) {
                conflicts.push({
                    path: currentPath,
                    baseValue: undefined, // Hard to get from base without pointer lookup logic for object path
                    leftValue: v1,
                    rightValue: v2
                });
            }
        }
    }

    return conflicts;
}

function isObject(val: any): boolean {
    return val && typeof val === 'object' && !Array.isArray(val);
}

export function safeApplyPatch(doc: any, patch: any[], strategy: DiffStrategy): any {
    try {
        if (strategy === DiffStrategy.MERGE_PATCH_7396) {
            // patch is array of patch objects? 
            // In our type def above we wrapped it. 
            // Let's assume patch is the patch object itself or array of 1.
            const p = Array.isArray(patch) ? patch[0] : patch;
            return jsonMergePatch.apply(doc, p);
        }

        // RFC 6902
        // clone doc first? fast-json-patch modifies in place usually
        const docClone = JSON.parse(JSON.stringify(doc));
        const result = applyJsonPatch(docClone, patch);
        return result.newDocument;
    } catch (e) {
        console.error("Patch application failed", e);
        return doc; // Return original on failure
    }
}
