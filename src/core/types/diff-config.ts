export type DiffChangeType = 'added' | 'removed' | 'modified' | 'type-changed' | 'unchanged';

export interface DiffNode {
    key: string;
    path: string; // Display path (dot notation)
    
    // Precise navigation paths
    leftPathSegments?: (string | number)[]; 
    rightPathSegments?: (string | number)[];
    
    changeType: DiffChangeType;
    oldValue?: any;
    newValue?: any;
    children?: DiffNode[];
    isArrayItem?: boolean;
    index?: number;
}

export type ArrayDiffStrategy = 'index' | 'key' | 'ignore-order';

export interface JsonDiffConfig {
    // Parsing
    allowComments: boolean; // JSON5 support
    
    // Normalization
    ignoreWhitespace: boolean; // Should be handled by parser usually, but good to have
    ignoreOrder: boolean; // Object key order
    
    // Comparison
    strictTypes: boolean; // 1 vs 1.0, "1" vs 1
    caseSensitive: boolean; // "Value" vs "value"
    
    // Array Handling
    arrayStrategy: ArrayDiffStrategy;
    arrayMatchKey: string; // If strategy is 'key', which key to use (e.g. "id")
    
    // Display
    showUnchanged: boolean;
    expandAll: boolean;
}

export const defaultDiffConfig: JsonDiffConfig = {
    allowComments: true,
    ignoreWhitespace: true,
    ignoreOrder: true,
    strictTypes: true,
    caseSensitive: true,
    arrayStrategy: 'index',
    arrayMatchKey: 'id',
    showUnchanged: false,
    expandAll: false
};
