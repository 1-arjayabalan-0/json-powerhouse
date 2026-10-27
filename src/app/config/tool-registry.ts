import type { LucideIcon } from 'lucide-react';
import {
    TextAlignStart, Minimize2, CircleCheck, ListTree, TextWrap, ArrowLeftRight,
    GitCompare, Shuffle, Eraser, FileCode, Coffee, Puzzle, Feather, Bird, Boxes,
    Hash, Code, Cog, Gem,
} from 'lucide-react';

export type ToolGroupId = 'json' | 'code';

export interface ToolDef {
    id: string;
    name: string;
    shortName: string;
    path: string;
    group: ToolGroupId;
    icon: LucideIcon;
    tagline: string;
    keywords: readonly string[]; // readonly so the `as const` list below satisfies it
    hidden?: boolean;
}

export const toolGroups: readonly { id: ToolGroupId; name: string }[] = [
    { id: 'json', name: 'JSON Tools' },
    { id: 'code', name: 'Code Generators' },
];

export const tools = [
    { id: 'json-formatter', name: 'JSON Formatter', shortName: 'Formatter', path: '/tools/json/formatter', group: 'json', icon: TextAlignStart, tagline: 'Format, beautify and auto-repair JSON', keywords: ['beautify', 'prettify', 'indent', 'repair'] },
    { id: 'json-minifier', name: 'JSON Minifier', shortName: 'Minifier', path: '/tools/json/minifier', group: 'json', icon: Minimize2, tagline: 'Compress JSON by stripping whitespace', keywords: ['minify', 'compress', 'compact'] },
    { id: 'json-validator', name: 'JSON Validator', shortName: 'Validator', path: '/tools/json/validator', group: 'json', icon: CircleCheck, tagline: 'Validate JSON and pinpoint syntax errors', keywords: ['validate', 'lint', 'check', 'errors'] },
    { id: 'json-viewer', name: 'JSON Tree Viewer', shortName: 'Tree Viewer', path: '/tools/json/viewer', group: 'json', icon: ListTree, tagline: 'Explore JSON as a collapsible tree', keywords: ['tree', 'explore', 'navigate'] },
    { id: 'json-text-viewer', name: 'JSON Text Viewer', shortName: 'Text Viewer', path: '/tools/json/text-viewer', group: 'json', icon: TextWrap, tagline: 'Read long text fields from JSON as a table', keywords: ['text', 'table', 'markdown', 'read'] },
    { id: 'json-json5', name: 'JSON ↔ JSON5', shortName: 'JSON5', path: '/tools/json/json5', group: 'json', icon: ArrowLeftRight, tagline: 'Convert between strict JSON and JSON5', keywords: ['json5', 'convert', 'comments'] },
    { id: 'json-diff', name: 'JSON Diff Checker', shortName: 'Diff', path: '/tools/json/diff', group: 'json', icon: GitCompare, tagline: 'Compare two JSON documents and merge changes', keywords: ['compare', 'diff', 'merge', 'patch'] },
    { id: 'json-transform', name: 'JSON Transform', shortName: 'Transform', path: '/tools/json/transform', group: 'json', icon: Shuffle, tagline: 'Reshape and transform JSON structures', keywords: ['transform', 'map', 'reshape'] },
    { id: 'json-normalize', name: 'Strip Comments / Normalize', shortName: 'Normalize', path: '/tools/json/normalize', group: 'json', icon: Eraser, tagline: 'Strip comments and normalize JSON output', keywords: ['normalize', 'comments'], hidden: true },
    { id: 'json-to-typescript', name: 'JSON → TypeScript', shortName: 'TypeScript', path: '/tools/code/json-to-typescript', group: 'code', icon: FileCode, tagline: 'Generate TypeScript interfaces or Zod schemas', keywords: ['typescript', 'ts', 'interface', 'zod'] },
    { id: 'json-to-java', name: 'JSON → Java', shortName: 'Java', path: '/tools/code/json-to-java', group: 'code', icon: Coffee, tagline: 'Generate Java POJOs from JSON', keywords: ['java', 'pojo', 'class'] },
    { id: 'json-to-kotlin', name: 'JSON → Kotlin', shortName: 'Kotlin', path: '/tools/code/json-to-kotlin', group: 'code', icon: Puzzle, tagline: 'Generate Kotlin data classes', keywords: ['kotlin', 'data class', 'android'] },
    { id: 'json-to-dart', name: 'JSON → Dart', shortName: 'Dart', path: '/tools/code/json-to-dart', group: 'code', icon: Feather, tagline: 'Generate Dart / Flutter models', keywords: ['dart', 'flutter', 'freezed'] },
    { id: 'json-to-swift', name: 'JSON → Swift Codable', shortName: 'Swift', path: '/tools/code/json-to-swift', group: 'code', icon: Bird, tagline: 'Generate Swift Codable structs', keywords: ['swift', 'codable', 'ios'] },
    { id: 'json-to-go', name: 'JSON → Go Struct', shortName: 'Go', path: '/tools/code/json-to-go', group: 'code', icon: Boxes, tagline: 'Generate Go structs with JSON tags', keywords: ['go', 'golang', 'struct'] },
    { id: 'json-to-csharp', name: 'JSON → C# Class', shortName: 'C#', path: '/tools/code/json-to-csharp', group: 'code', icon: Hash, tagline: 'Generate C# classes, records or structs', keywords: ['c#', 'csharp', 'dotnet', 'record'] },
    { id: 'json-to-python', name: 'JSON → Python Dataclass', shortName: 'Python', path: '/tools/code/json-to-python', group: 'code', icon: Code, tagline: 'Generate Python dataclasses or attrs', keywords: ['python', 'dataclass', 'pydantic'] },
    { id: 'json-to-rust', name: 'JSON → Rust Struct', shortName: 'Rust', path: '/tools/code/json-to-rust', group: 'code', icon: Cog, tagline: 'Generate Rust structs with serde', keywords: ['rust', 'serde', 'struct'] },
    { id: 'json-to-php', name: 'JSON → PHP Class', shortName: 'PHP', path: '/tools/code/json-to-php', group: 'code', icon: Gem, tagline: 'Generate PHP classes from JSON', keywords: ['php', 'class'], hidden: true },
] as const satisfies readonly ToolDef[];

export type ToolId = (typeof tools)[number]['id'];

const normalize = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p);

export function getToolById(id: string): ToolDef | undefined {
    return (tools as readonly ToolDef[]).find(t => t.id === id);
}

export function getToolByPath(path: string | null | undefined): ToolDef | undefined {
    if (!path) return undefined;
    const p = normalize(path);
    return (tools as readonly ToolDef[]).find(t => t.path === p);
}

export function getVisibleTools(group?: ToolGroupId): ToolDef[] {
    return (tools as readonly ToolDef[]).filter(t => !t.hidden && (!group || t.group === group));
}
