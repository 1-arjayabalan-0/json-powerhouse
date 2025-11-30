import { JSONFormatterConfig } from '@/app/types/json-formatter-config';

// Preset configurations for different JSON tools
export const toolPresets: Record<string, Partial<JSONFormatterConfig>> = {
    'json-formatter': {
        // Default formatter - user can customize everything
    },

    'json-minifier': {
        pretty: false,
        indentation: '0',
        normalizeSpaces: true,
        normalizeLineBreaks: true,
    },

    'json-prettifier': {
        pretty: true,
        indentation: '2',
        keySorting: 'none',
        arrayFormatting: 'multi-line',
        normalizeSpaces: true,
        normalizeLineBreaks: true,
    },

    'json-beautifier': {
        pretty: true,
        indentation: '2',
        keySorting: 'asc',
        arrayFormatting: 'multi-line',
        normalizeSpaces: true,
        normalizeLineBreaks: true,
        quoteStyle: 'double',
    },

    'json-validator': {
        pretty: true,
        indentation: '2',
        stripComments: false, // Keep comments to show validation errors
    },

    'json-normalize': {
        pretty: true,
        indentation: '2',
        stripComments: true,
        normalizeSpaces: true,
        normalizeLineBreaks: true,
        removeNull: false,
        removeEmptyArrays: false,
        removeEmptyObjects: false,
    },

    'json-to-json5': {
        pretty: true,
        indentation: '2',
        useJSON5: true,
        quoteStyle: 'single', // JSON5 standard
        trailingCommas: true, // JSON5 supports trailing commas
        stripComments: false, // JSON5 supports comments
    },
};

// Tool metadata for page headers
export interface ToolMetadata {
    title: string;
    description: string;
    icon: string;
}

export const toolMetadata: Record<string, ToolMetadata> = {
    'json-formatter': {
        title: 'JSON Formatter',
        description: 'Paste your JSON below to format it instantly.',
        icon: 'format_align_left',
    },
    'json-minifier': {
        title: 'JSON Minifier',
        description: 'Compress your JSON to a single line with no extra whitespace.',
        icon: 'compress',
    },
    'json-prettifier': {
        title: 'JSON Prettifier',
        description: 'Make your JSON readable with proper indentation and formatting.',
        icon: 'auto_awesome',
    },
    'json-beautifier': {
        title: 'JSON Beautifier',
        description: 'Beautify your JSON with sorted keys and clean formatting.',
        icon: 'brush',
    },
    'json-validator': {
        title: 'JSON Validator',
        description: 'Validate your JSON syntax and structure.',
        icon: 'task_alt',
    },
    'json-normalize': {
        title: 'Strip Comments / Normalize JSON',
        description: 'Remove comments and normalize your JSON formatting.',
        icon: 'cleaning_services',
    },
    'json-to-json5': {
        title: 'JSON to JSON5',
        description: 'Convert standard JSON to JSON5 (supports comments, single quotes, etc).',
        icon: 'javascript', // or another suitable icon
    },
    'json-viewer': {
        title: 'JSON Viewer',
        description: 'Visualize your JSON data in an interactive tree view.',
        icon: 'account_tree',
    },
};
