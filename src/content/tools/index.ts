import type { ToolId } from '@/app/config/tool-registry';
import type { ToolContent } from './types';
import jsonFormatter from './json-formatter';
import jsonMinifier from './json-minifier';
import jsonValidator from './json-validator';
import jsonViewer from './json-viewer';
import jsonTextViewer from './json-text-viewer';
import jsonJson5 from './json-json5';
import jsonDiff from './json-diff';
import jsonTransform from './json-transform';
import jsonNormalize from './json-normalize';
import jsonToTypescript from './json-to-typescript';
import jsonToJava from './json-to-java';
import jsonToKotlin from './json-to-kotlin';
import jsonToDart from './json-to-dart';
import jsonToSwift from './json-to-swift';
import jsonToGo from './json-to-go';
import jsonToCsharp from './json-to-csharp';
import jsonToPython from './json-to-python';
import jsonToRust from './json-to-rust';
import jsonToPhp from './json-to-php';

export type { ToolContent };

export const toolContent: Record<ToolId, ToolContent> = {
    'json-formatter': jsonFormatter,
    'json-minifier': jsonMinifier,
    'json-validator': jsonValidator,
    'json-viewer': jsonViewer,
    'json-text-viewer': jsonTextViewer,
    'json-json5': jsonJson5,
    'json-diff': jsonDiff,
    'json-transform': jsonTransform,
    'json-normalize': jsonNormalize,
    'json-to-typescript': jsonToTypescript,
    'json-to-java': jsonToJava,
    'json-to-kotlin': jsonToKotlin,
    'json-to-dart': jsonToDart,
    'json-to-swift': jsonToSwift,
    'json-to-go': jsonToGo,
    'json-to-csharp': jsonToCsharp,
    'json-to-python': jsonToPython,
    'json-to-rust': jsonToRust,
    'json-to-php': jsonToPhp,
};
