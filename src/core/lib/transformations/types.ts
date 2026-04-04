export type TransformOperationType =
    | 'rename-key'
    | 'remove-key'
    | 'case-convert'
    | 'extract-subtree'
    | 'flatten'
    | 'unflatten';

export type CaseType = 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase';

export interface TransformOperation {
    id: string;
    type: TransformOperationType;
    enabled: boolean;
    /** Target path for the operation (dot notation, e.g. "user.address") */
    path?: string;
    /** New key name for rename */
    newKey?: string;
    /** Target case type for case-convert */
    caseType?: CaseType;
    /** Scope for case-convert: keys only, values only, or both */
    scope?: 'keys' | 'values' | 'both';
    /** Separator for flatten/unflatten */
    separator?: string;
    /** Regex pattern for remove-key by pattern */
    pattern?: string;
}

export interface TransformResult {
    output: string;
    error: string | null;
    operationsApplied: number;
}

export const defaultTransformConfig: TransformOperation[] = [];

/**
 * Generate a unique ID for operations
 */
export function generateOpId(): string {
    return `op-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}
