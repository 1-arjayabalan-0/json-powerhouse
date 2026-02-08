export type ParsedJSON = any;

export enum DiffStrategy {
    JSON_PATCH_6902 = 'JSON_PATCH_6902',
    MERGE_PATCH_7396 = 'MERGE_PATCH_7396'
}

export enum DataFormat {
    JSON = 'JSON',
    JSON5 = 'JSON5'
}

export enum MergeState {
    NO_CONFLICT = 'NO_CONFLICT',
    HAS_CONFLICT = 'HAS_CONFLICT'
}

export interface ParseResult {
    data: ParsedJSON;
    error?: {
        message: string;
        line?: number;
        column?: number;
    };
}

export interface Conflict {
    path: string;
    baseValue: any;
    leftValue: any;
    rightValue: any;
    resolved?: boolean;
    resolution?: 'left' | 'right' | 'manual';
    manualValue?: any;
}

export interface MergeResult {
    patchLeft: any[];
    patchRight: any[];
    conflicts: Conflict[];
    mergedDocument: any;
    strategy: DiffStrategy;
}
