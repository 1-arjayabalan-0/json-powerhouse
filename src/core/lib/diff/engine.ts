import JSON5 from 'json5';
import { JsonDiffConfig, DiffNode, DiffChangeType } from '@/core/types/diff-config';

export interface DiffResult {
    root: DiffNode;
    summary: {
        added: number;
        removed: number;
        modified: number;
        typeChanged: number;
    };
    error?: string;
}

export function parseAndDiff(leftInput: string, rightInput: string, config: JsonDiffConfig): DiffResult {
    let leftObj: any;
    let rightObj: any;

    try {
        leftObj = config.allowComments ? JSON5.parse(leftInput) : JSON.parse(leftInput);
    } catch (e: any) {
        return {
            root: createErrorNode("Left input is invalid: " + e.message),
            summary: emptySummary(),
            error: "Left input is invalid"
        };
    }

    try {
        rightObj = config.allowComments ? JSON5.parse(rightInput) : JSON.parse(rightInput);
    } catch (e: any) {
        return {
            root: createErrorNode("Right input is invalid: " + e.message),
            summary: emptySummary(),
            error: "Right input is invalid"
        };
    }

    const summary = emptySummary();
    const root = compareValues(leftObj, rightObj, "", "", [], [], config, summary);

    return { root, summary };
}

function emptySummary() {
    return { added: 0, removed: 0, modified: 0, typeChanged: 0 };
}

function createErrorNode(msg: string): DiffNode {
    return {
        key: "error",
        path: "error",
        changeType: "modified",
        oldValue: msg,
        newValue: msg
    };
}

function compareValues(
    oldVal: any,
    newVal: any,
    key: string,
    path: string,
    leftPathSegments: (string | number)[] | undefined,
    rightPathSegments: (string | number)[] | undefined,
    config: JsonDiffConfig,
    summary: DiffResult['summary']
): DiffNode {
    // Generate JSON Pointer path
    const escapedKey = key.toString().replace(/~/g, "~0").replace(/\//g, "~1");
    const currentPath = path + (key !== "" ? "/" + escapedKey : "");

    // 1. Check for existence
    if (oldVal === undefined && newVal !== undefined) {
        summary.added++;
        return {
            key: key || "root",
            path: currentPath || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: 'added',
            newValue: newVal
        };
    }
    if (oldVal !== undefined && newVal === undefined) {
        summary.removed++;
        return {
            key: key || "root",
            path: currentPath || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: 'removed',
            oldValue: oldVal
        };
    }

    // 2. Check types
    const oldType = getType(oldVal);
    const newType = getType(newVal);

    if (oldType !== newType) {
        summary.typeChanged++;
        return {
            key: key || "root",
            path: currentPath || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: 'type-changed',
            oldValue: oldVal,
            newValue: newVal
        };
    }

    // 3. Compare Objects
    if (oldType === 'object') {
        return compareObjects(oldVal, newVal, key, currentPath, leftPathSegments, rightPathSegments, config, summary);
    }

    // 4. Compare Arrays
    if (oldType === 'array') {
        return compareArrays(oldVal, newVal, key, currentPath, leftPathSegments, rightPathSegments, config, summary);
    }

    // 5. Compare Primitives
    if (!areValuesEqual(oldVal, newVal, config)) {
        summary.modified++;
        return {
            key: key || "root",
            path: currentPath || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: 'modified',
            oldValue: oldVal,
            newValue: newVal
        };
    }

    return {
        key: key || "root",
        path: currentPath || "/",
        leftPathSegments,
        rightPathSegments,
        changeType: 'unchanged',
        oldValue: oldVal,
        newValue: newVal
    };
}

function compareObjects(
    oldObj: any,
    newObj: any,
    key: string,
    path: string,
    leftPathSegments: (string | number)[] | undefined,
    rightPathSegments: (string | number)[] | undefined,
    config: JsonDiffConfig,
    summary: DiffResult['summary']
): DiffNode {
    const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
    // Sort keys if ignoring order (default behavior of this comparison is key-by-key, so effective order is irrelevant for logic, but relevant for display)
    const sortedKeys = Array.from(keys).sort();

    const children: DiffNode[] = [];
    let hasChanges = false;

    for (const k of sortedKeys) {
        const childLeftPath = leftPathSegments ? [...leftPathSegments, k] : undefined;
        const childRightPath = rightPathSegments ? [...rightPathSegments, k] : undefined;

        const childNode = compareValues(oldObj[k], newObj[k], k, path, childLeftPath, childRightPath, config, summary);
        if (childNode.changeType !== 'unchanged') {
            hasChanges = true;
        }
        children.push(childNode);
    }

    return {
        key,
        path,
        leftPathSegments,
        rightPathSegments,
        changeType: hasChanges ? 'modified' : 'unchanged',
        children
    };
}

function compareArrays(
    oldArr: any[],
    newArr: any[],
    key: string,
    path: string,
    leftPathSegments: (string | number)[] | undefined,
    rightPathSegments: (string | number)[] | undefined,
    config: JsonDiffConfig,
    summary: DiffResult['summary']
): DiffNode {
    // Strategy: Replace (Treat entire array as a single value)
    if (config.arrayStrategy === 'replace' as any) {
        // We use a simplified comparison for the whole array
        if (JSON.stringify(oldArr) !== JSON.stringify(newArr)) {
            summary.modified++;
            return {
                key: key || "root",
                path: path || "/",
                leftPathSegments,
                rightPathSegments,
                changeType: 'modified',
                oldValue: oldArr,
                newValue: newArr
            };
        }
        return {
            key: key || "root",
            path: path || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: 'unchanged',
            oldValue: oldArr,
            newValue: newArr
        };
    }

    const children: DiffNode[] = [];
    let hasChanges = false;

    // Strategy: Append (Only allow additions)
    if (config.arrayStrategy === 'append' as any) {
        const minLen = Math.min(oldArr.length, newArr.length);
        for (let i = 0; i < minLen; i++) {
            const childNode = compareValues(oldArr[i], newArr[i], i.toString(), path,
                leftPathSegments ? [...leftPathSegments, i] : undefined,
                rightPathSegments ? [...rightPathSegments, i] : undefined,
                config, summary);
            childNode.isArrayItem = true;
            childNode.index = i;
            if (childNode.changeType !== 'unchanged') hasChanges = true;
            children.push(childNode);
        }
        if (newArr.length > oldArr.length) {
            for (let i = minLen; i < newArr.length; i++) {
                summary.added++;
                hasChanges = true;
                children.push({
                    key: i.toString(),
                    path: path + "/" + i,
                    rightPathSegments: rightPathSegments ? [...rightPathSegments, i] : undefined,
                    changeType: 'added',
                    newValue: newArr[i],
                    isArrayItem: true,
                    index: i
                });
            }
        }
        return {
            key: key || "root",
            path: path || "/",
            leftPathSegments,
            rightPathSegments,
            changeType: hasChanges ? 'modified' : 'unchanged',
            children
        };
    }

    // Strategy: Key-based
    if (config.arrayStrategy === 'key' && config.arrayMatchKey) {
        const matchKey = config.arrayMatchKey;
        const oldMap = new Map<string, { item: any, index: number }>();
        const newMap = new Map<string, { item: any, index: number }>();
        const oldUnkeyed: { item: any, index: number }[] = [];
        const newUnkeyed: { item: any, index: number }[] = [];

        // Helper to classify items
        const classify = (arr: any[], map: Map<string, any>, unkeyed: any[]) => {
            arr.forEach((item, idx) => {
                if (item && typeof item === 'object' && matchKey in item) {
                    const val = item[matchKey];
                    // Use string representation for map key
                    const keyStr = String(val);
                    // Handle duplicates: if key exists, treat subsequent ones as unkeyed or overwrite?
                    // Overwriting is dangerous. Let's append index if duplicate to keep unique?
                    // Or just put in unkeyed if duplicate? 
                    // Let's assume unique keys for now. If duplicate, first one wins, others go to unkeyed?
                    if (map.has(keyStr)) {
                        unkeyed.push({ item, index: idx });
                    } else {
                        map.set(keyStr, { item, index: idx });
                    }
                } else {
                    unkeyed.push({ item, index: idx });
                }
            });
        };

        classify(oldArr, oldMap, oldUnkeyed);
        classify(newArr, newMap, newUnkeyed);

        // 1. Process Keyed Matches
        const allKeys = new Set([...oldMap.keys(), ...newMap.keys()]);
        // Sort keys mostly for display stability
        const sortedKeys = Array.from(allKeys).sort();

        for (const k of sortedKeys) {
            const oldEntry = oldMap.get(k);
            const newEntry = newMap.get(k);

            // Construct a display key that indicates this is a key-matched item
            // e.g. "id:1"
            const displayKey = `${matchKey}:${k}`;
            const escapedDisplayKey = displayKey.replace(/~/g, "~0").replace(/\//g, "~1");

            if (oldEntry && newEntry) {
                // Both exist -> compare
                const childLeftPath = leftPathSegments ? [...leftPathSegments, oldEntry.index] : undefined;
                const childRightPath = rightPathSegments ? [...rightPathSegments, newEntry.index] : undefined;

                const childNode = compareValues(oldEntry.item, newEntry.item, displayKey, path, childLeftPath, childRightPath, config, summary);
                childNode.isArrayItem = true;
                if (childNode.changeType !== 'unchanged') hasChanges = true;
                children.push(childNode);
            } else if (oldEntry) {
                // Removed
                summary.removed++;
                children.push({
                    key: displayKey,
                    path: path + "/" + escapedDisplayKey,
                    leftPathSegments: leftPathSegments ? [...leftPathSegments, oldEntry.index] : undefined,
                    rightPathSegments: undefined,
                    changeType: 'removed',
                    oldValue: oldEntry.item,
                    isArrayItem: true
                });
                hasChanges = true;
            } else if (newEntry) {
                // Added
                summary.added++;
                children.push({
                    key: displayKey,
                    path: path + "/" + escapedDisplayKey,
                    leftPathSegments: undefined,
                    rightPathSegments: rightPathSegments ? [...rightPathSegments, newEntry.index] : undefined,
                    changeType: 'added',
                    newValue: newEntry.item,
                    isArrayItem: true
                });
                hasChanges = true;
            }
        }

        // 2. Process Unkeyed Items (Fallback to index-based for the remainder)
        const maxUnkeyed = Math.max(oldUnkeyed.length, newUnkeyed.length);
        for (let i = 0; i < maxUnkeyed; i++) {
            const oldItem = oldUnkeyed[i];
            const newItem = newUnkeyed[i];
            const itemKey = `[${i}]`; // Distinguish from keyed items

            const childLeftPath = oldItem && leftPathSegments ? [...leftPathSegments, oldItem.index] : undefined;
            const childRightPath = newItem && rightPathSegments ? [...rightPathSegments, newItem.index] : undefined;

            const childNode = compareValues(
                oldItem ? oldItem.item : undefined,
                newItem ? newItem.item : undefined,
                itemKey,
                path,
                childLeftPath,
                childRightPath,
                config,
                summary
            );
            childNode.isArrayItem = true;

            if (childNode.changeType !== 'unchanged') {
                hasChanges = true;
            }
            children.push(childNode);
        }

    } else if (config.arrayStrategy === 'ignore-order') {
        // Strategy: Ignore Order (Treat as Set / Bag)
        // Complexity: O(N*M) - acceptable for client-side diff of reasonable size

        const newItemsAvailable = newArr.map((item, index) => ({ item, index, used: false }));

        // 1. Find matches for old items
        for (let i = 0; i < oldArr.length; i++) {
            const oldItem = oldArr[i];
            let foundMatch = false;

            for (let j = 0; j < newItemsAvailable.length; j++) {
                if (newItemsAvailable[j].used) continue;

                if (isEqual(oldItem, newItemsAvailable[j].item, config)) {
                    newItemsAvailable[j].used = true;
                    foundMatch = true;

                    const childLeftPath = leftPathSegments ? [...leftPathSegments, i] : undefined;
                    const childRightPath = rightPathSegments ? [...rightPathSegments, newItemsAvailable[j].index] : undefined;

                    // Unchanged
                    children.push({
                        key: `[${i}]`,
                        path: path ? `${path}.[${i}]` : `[${i}]`,
                        leftPathSegments: childLeftPath,
                        rightPathSegments: childRightPath,
                        changeType: 'unchanged',
                        oldValue: oldItem,
                        newValue: oldItem,
                        isArrayItem: true
                    });
                    break;
                }
            }

            if (!foundMatch) {
                // Removed
                summary.removed++;
                hasChanges = true;
                children.push({
                    key: `[${i}]`,
                    path: path + "/" + i,
                    leftPathSegments: leftPathSegments ? [...leftPathSegments, i] : undefined,
                    rightPathSegments: undefined,
                    changeType: 'removed',
                    oldValue: oldItem,
                    isArrayItem: true
                });
            }
        }

        // 2. Remaining new items are Added
        newItemsAvailable.forEach(wrapper => {
            if (!wrapper.used) {
                summary.added++;
                hasChanges = true;
                children.push({
                    key: `[${wrapper.index}]`,
                    path: path + "/" + wrapper.index,
                    leftPathSegments: undefined,
                    rightPathSegments: rightPathSegments ? [...rightPathSegments, wrapper.index] : undefined,
                    changeType: 'added',
                    newValue: wrapper.item,
                    isArrayItem: true
                });
            }
        });

    } else {
        // Default: LCS-based alignment for better structural diff
        const lcs = findLCS(oldArr, newArr, config);
        let oldIdx = 0;
        let newIdx = 0;

        for (const match of lcs) {
            // 1. Mark items before the match as Removed (in old) or Added (in new)
            while (oldIdx < match.oldIdx) {
                summary.removed++;
                hasChanges = true;
                children.push({
                    key: `[${oldIdx}]`,
                    path: path + "/" + oldIdx,
                    leftPathSegments: leftPathSegments ? [...leftPathSegments, oldIdx] : undefined,
                    changeType: 'removed',
                    oldValue: oldArr[oldIdx],
                    isArrayItem: true,
                    index: oldIdx
                });
                oldIdx++;
            }
            while (newIdx < match.newIdx) {
                summary.added++;
                hasChanges = true;
                children.push({
                    key: `[${newIdx}]`,
                    path: path + "/" + newIdx,
                    rightPathSegments: rightPathSegments ? [...rightPathSegments, newIdx] : undefined,
                    changeType: 'added',
                    newValue: newArr[newIdx],
                    isArrayItem: true,
                    index: newIdx
                });
                newIdx++;
            }

            // 2. The match itself (Unchanged structurally at this point)
            const childNode = compareValues(
                oldArr[oldIdx],
                newArr[newIdx],
                oldIdx.toString(),
                path,
                leftPathSegments ? [...leftPathSegments, oldIdx] : undefined,
                rightPathSegments ? [...rightPathSegments, newIdx] : undefined,
                config,
                summary
            );
            childNode.isArrayItem = true;
            childNode.index = oldIdx;
            if (childNode.changeType !== 'unchanged') hasChanges = true;
            children.push(childNode);

            oldIdx++;
            newIdx++;
        }

        // 3. Process remaining items
        while (oldIdx < oldArr.length) {
            summary.removed++;
            hasChanges = true;
            children.push({
                key: `[${oldIdx}]`,
                path: path + "/" + oldIdx,
                leftPathSegments: leftPathSegments ? [...leftPathSegments, oldIdx] : undefined,
                changeType: 'removed',
                oldValue: oldArr[oldIdx],
                isArrayItem: true,
                index: oldIdx
            });
            oldIdx++;
        }
        while (newIdx < newArr.length) {
            summary.added++;
            hasChanges = true;
            children.push({
                key: `[${newIdx}]`,
                path: path + "/" + newIdx,
                rightPathSegments: rightPathSegments ? [...rightPathSegments, newIdx] : undefined,
                changeType: 'added',
                newValue: newArr[newIdx],
                isArrayItem: true,
                index: newIdx
            });
            newIdx++;
        }
    }

    return {
        key,
        path,
        leftPathSegments,
        rightPathSegments,
        changeType: hasChanges ? 'modified' : 'unchanged',
        children
    };
}

function findLCS(oldArr: any[], newArr: any[], config: JsonDiffConfig): { oldIdx: number, newIdx: number }[] {
    const m = oldArr.length;
    const n = newArr.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (isEqual(oldArr[i - 1], newArr[j - 1], config)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const result: { oldIdx: number, newIdx: number }[] = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (isEqual(oldArr[i - 1], newArr[j - 1], config)) {
            result.unshift({ oldIdx: i - 1, newIdx: j - 1 });
            i--;
            j--;
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    return result;
}

function getType(val: any): string {
    if (Array.isArray(val)) return 'array';
    if (val === null) return 'null';
    return typeof val;
}

function areValuesEqual(v1: any, v2: any, config: JsonDiffConfig): boolean {
    if (config.strictTypes) {
        if (typeof v1 === 'string' && typeof v2 === 'string' && !config.caseSensitive) {
            return v1.toLowerCase() === v2.toLowerCase();
        }
        return v1 === v2;
    } else {
        // Loose comparison
        if (typeof v1 === 'string' && typeof v2 === 'string' && !config.caseSensitive) {
            return v1.toLowerCase() == v2.toLowerCase();
        }
        return v1 == v2;
    }
}

function isEqual(a: any, b: any, config: JsonDiffConfig): boolean {
    // Check primitive equality first
    if (getType(a) !== getType(b)) return false;
    if (typeof a !== 'object' || a === null) return areValuesEqual(a, b, config);

    // Use compareValues for deep comparison
    // We pass a dummy summary because compareValues mutates it
    const dummySummary = { added: 0, removed: 0, modified: 0, typeChanged: 0 };
    const node = compareValues(a, b, "", "", undefined, undefined, config, dummySummary);
    return node.changeType === 'unchanged';
}
