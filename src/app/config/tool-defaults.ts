import { defaultConfig as defaultFormatterConfig, JSONFormatterConfig } from '@/core/types/json-formatter-config';
import { defaultViewerConfig } from '@/core/types/json-viewer-config';
import { defaultJSON5Config } from '@/core/types/json5-converter-config';
import { defaultTextViewerConfig } from '@/core/types/text-viewer-config';
import { defaultDiffConfig } from '@/core/types/diff-config';
import {
    defaultTypeScriptConfig, defaultJavaConfig, defaultKotlinConfig, defaultDartConfig, defaultSwiftConfig,
    defaultGoConfig, defaultCSharpConfig, defaultPythonConfig, defaultRustConfig, defaultPHPConfig,
} from '@/core/types/code-generator-config';
import type { ToolId } from './tool-registry';

const formatterPresets: Record<'json-formatter' | 'json-minifier' | 'json-validator' | 'json-normalize', Partial<JSONFormatterConfig>> = {
    'json-formatter': {},
    'json-minifier': { pretty: false, indentation: '0', normalizeSpaces: true, normalizeLineBreaks: true },
    'json-validator': { pretty: true, indentation: '2', stripComments: false },
    'json-normalize': {
        pretty: true, indentation: '2', stripComments: true, normalizeSpaces: true, normalizeLineBreaks: true,
        removeNull: false, removeEmptyArrays: false, removeEmptyObjects: false,
    },
};

const formatter = (id: keyof typeof formatterPresets): JSONFormatterConfig => ({ ...defaultFormatterConfig, ...formatterPresets[id] });

export const toolDefaults: Record<ToolId, object> = {
    'json-formatter': formatter('json-formatter'),
    'json-minifier': formatter('json-minifier'),
    'json-validator': formatter('json-validator'),
    'json-normalize': formatter('json-normalize'),
    'json-viewer': defaultViewerConfig,
    'json-text-viewer': defaultTextViewerConfig,
    'json-json5': defaultJSON5Config,
    'json-diff': { ...defaultDiffConfig, diffStrategy: 'json-patch-6902' },
    'json-transform': { operations: [] },
    'json-to-typescript': defaultTypeScriptConfig,
    'json-to-java': defaultJavaConfig,
    'json-to-kotlin': defaultKotlinConfig,
    'json-to-dart': defaultDartConfig,
    'json-to-swift': defaultSwiftConfig,
    'json-to-go': defaultGoConfig,
    'json-to-csharp': defaultCSharpConfig,
    'json-to-python': defaultPythonConfig,
    'json-to-rust': defaultRustConfig,
    'json-to-php': defaultPHPConfig,
};

export function getToolDefaults(toolId: string | null | undefined): object {
    return (toolId && toolDefaults[toolId as ToolId]) || toolDefaults['json-formatter'];
}
