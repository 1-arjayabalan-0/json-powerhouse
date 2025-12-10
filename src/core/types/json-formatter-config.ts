export type IndentationType = '2' | '4' | 'tab' | '0';
export type QuoteStyle = 'double' | 'single';
export type KeyCase = 'none' | 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase';
export type ArrayFormatting = 'multi-line' | 'single-line';
export type KeySorting = 'none' | 'asc' | 'desc';

export interface JSONFormatterConfig {
    // Core - Phase 1
    indentation: IndentationType;
    pretty: boolean; // true = pretty, false = minify

    // Intermediate - Phase 2
    keySorting: KeySorting; // none, asc (A→Z), desc (Z→A)
    arrayFormatting: ArrayFormatting; // multi-line or single-line
    normalizeSpaces: boolean; // Clean duplicate spaces
    normalizeLineBreaks: boolean; // Normalize \r\n vs \n

    // Key/Value Level - Phase 3
    quoteStyle: QuoteStyle;
    trailingCommas: boolean;

    // Extended JSON - Phase 4
    stripComments: boolean;
    removeNull: boolean;
    removeEmptyArrays: boolean;
    removeEmptyObjects: boolean;
    keyCase: KeyCase;
    useJSON5: boolean;
}

export const defaultConfig: JSONFormatterConfig = {
    // Core
    indentation: 'tab',
    pretty: true,

    // Intermediate
    keySorting: 'none',
    arrayFormatting: 'multi-line',
    normalizeSpaces: true,
    normalizeLineBreaks: true,

    // Key/Value Level
    quoteStyle: 'double',
    trailingCommas: false,

    // Extended JSON
    stripComments: false,
    removeNull: false,
    removeEmptyArrays: false,
    removeEmptyObjects: false,
    keyCase: 'none',
    useJSON5: false,
};
