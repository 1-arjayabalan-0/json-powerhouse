export type IndentationType = '2' | '4' | 'tab';
export type ThemeType = 'dark' | 'light' | 'system';

export interface JsonTreeViewerConfig {
    // Display
    theme: ThemeType;
    fontSize: number; // px
    lineHeight: number; // multiplier or px

    // Formatting
    indentation: IndentationType;
    showDataTypes: boolean;
    showItemCounts: boolean; // Array length, Object size
    showBrackets: boolean;
    showCommas: boolean;
    showLines: boolean; // Tree connector lines

    // Behavior
    autoExpandDepth: number; // -1 for all, 0 for none
    sortKeys: boolean;
}

export const defaultViewerConfig: JsonTreeViewerConfig = {
    theme: 'dark',
    fontSize: 14,
    lineHeight: 1.5,
    indentation: '2',
    showDataTypes: true,
    showItemCounts: true,
    showBrackets: true,
    showCommas: true,
    showLines: true,
    autoExpandDepth: 1,
    sortKeys: false,
};
