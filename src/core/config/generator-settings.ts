/**
 * Describes every user-facing option of the code and schema generators: label, help text,
 * allowed values and default. It is the single source used by the VS Code extension for
 * its contributed settings (extension/scripts/sync-settings.cjs), for reading them, and for
 * the in-editor "quick options" picker. tests/config/generator-settings.test.ts keeps it in
 * sync with the default config objects and with extension/package.json.
 */
import {
    defaultCSharpConfig,
    defaultDartConfig,
    defaultGoConfig,
    defaultJavaConfig,
    defaultKotlinConfig,
    defaultPHPConfig,
    defaultPythonConfig,
    defaultRustConfig,
    defaultSwiftConfig,
    defaultTypeScriptConfig,
} from '@/core/types/code-generator-config';
import { defaultJsonSchemaConfig, defaultPrismaSchemaConfig, defaultSqlSchemaConfig } from '@/core/types/schema-generator-config';

export interface OptionChoice {
    value: string;
    label: string;
}

export interface OptionSpec {
    key: string;
    label: string;
    description: string;
    type: 'boolean' | 'string' | 'enum';
    choices?: OptionChoice[];
    /** Shown in the quick-options picker in the editor (keep to the 2–4 most useful). */
    quick?: boolean;
}

export interface GeneratorSettingsSpec {
    /** Settings section: options live under `json-powerhouse.<section>.<key>`. */
    section: string;
    title: string;
    defaults: Record<string, unknown>;
    options: OptionSpec[];
}

const acronymStyle = (quick = false): OptionSpec => ({
    key: 'acronymStyle',
    label: 'Acronym style',
    description: 'How acronyms such as "URL" or "ID" are cased in generated names.',
    type: 'enum',
    choices: [
        { value: 'camel', label: 'Camel (Url, Id)' },
        { value: 'pascal', label: 'Pascal (URL, ID)' },
        { value: 'lowerCase', label: 'Lower case (url, id)' },
        { value: 'upperCase', label: 'Upper case (URL, ID)' },
        { value: 'original', label: 'Keep original' },
    ],
    quick,
});

const nested = (target: string): OptionSpec => ({
    key: 'nested',
    label: 'Nested objects & arrays',
    description: `How nested JSON objects and arrays of objects are mapped in the generated ${target}.`,
    type: 'enum',
    choices: [
        { value: 'tables', label: 'Related tables with foreign keys' },
        { value: 'json', label: 'JSON columns' },
    ],
    quick: true,
});

export const GENERATOR_SETTINGS: GeneratorSettingsSpec[] = [
    {
        section: 'typescript',
        title: 'TypeScript',
        defaults: { ...defaultTypeScriptConfig },
        options: [
            // typeKind maps to quicktype's "just-types": 'type' emits interfaces only, 'interface' adds Convert helpers.
            { key: 'typeKind', label: 'Output', description: 'Plain interfaces only, or interfaces plus Convert helpers that parse and check JSON at runtime.', type: 'enum', choices: [{ value: 'type', label: 'Interfaces only' }, { value: 'interface', label: 'Interfaces + Convert helpers' }], quick: true },
            { key: 'runtimeTypecheck', label: 'Runtime validation', description: 'Also generate a runtime validation schema.', type: 'enum', choices: [{ value: 'none', label: 'None' }, { value: 'zod', label: 'Zod schema' }], quick: true },
            { key: 'readonlyProperties', label: 'Readonly properties', description: 'Mark every property as readonly.', type: 'boolean', quick: true },
            { key: 'explicitAny', label: 'Explicit any', description: 'Use "any" instead of "unknown" for values whose type cannot be inferred.', type: 'boolean' },
            { key: 'nicePropertyNames', label: 'Nice property names', description: 'Convert JSON keys into idiomatic property names.', type: 'boolean' },
            acronymStyle(),
        ],
    },
    {
        section: 'csharp',
        title: 'C#',
        defaults: { ...defaultCSharpConfig },
        options: [
            { key: 'namespace', label: 'Namespace', description: 'Namespace for the generated types.', type: 'string', quick: true },
            { key: 'framework', label: 'JSON library', description: 'Serialization attributes to emit.', type: 'enum', choices: [{ value: 'SystemTextJson', label: 'System.Text.Json' }, { value: 'NewtonsoftJson', label: 'Newtonsoft.Json' }, { value: 'none', label: 'None (plain types)' }], quick: true },
            { key: 'recordType', label: 'Type kind', description: 'Generate classes, records or structs.', type: 'enum', choices: [{ value: 'class', label: 'Class' }, { value: 'record', label: 'Record' }, { value: 'struct', label: 'Struct' }], quick: true },
            { key: 'accessLevel', label: 'Access modifier', description: 'Access modifier of the generated types.', type: 'enum', choices: [{ value: 'public', label: 'public' }, { value: 'internal', label: 'internal' }] },
            { key: 'numberType', label: 'Decimal numbers', description: 'C# type used for non-integer numbers.', type: 'enum', choices: [{ value: 'double', label: 'double' }, { value: 'decimal', label: 'decimal' }] },
            { key: 'arrayType', label: 'Collections', description: 'C# type used for JSON arrays.', type: 'enum', choices: [{ value: 'list', label: 'List<T>' }, { value: 'array', label: 'T[]' }] },
            { key: 'density', label: 'Density', description: 'Normal or dense (more compact) output.', type: 'enum', choices: [{ value: 'normal', label: 'Normal' }, { value: 'dense', label: 'Dense' }] },
        ],
    },
    {
        section: 'java',
        title: 'Java',
        defaults: { ...defaultJavaConfig },
        options: [
            { key: 'packageName', label: 'Package', description: 'Package declaration for the generated classes.', type: 'string', quick: true },
            { key: 'useGettersSetters', label: 'Getters and setters', description: 'Generate private fields with getters and setters.', type: 'boolean', quick: true },
            { key: 'useOptional', label: 'Optional for nullable fields', description: 'Use Optional<T> for fields that can be missing or null.', type: 'boolean' },
            { key: 'useBigDecimal', label: 'BigDecimal', description: 'Use BigDecimal for decimal numbers.', type: 'boolean' },
            { key: 'arrayType', label: 'Collections', description: 'Java type used for JSON arrays.', type: 'enum', choices: [{ value: 'list', label: 'List<T>' }, { value: 'array', label: 'T[]' }], quick: true },
            acronymStyle(),
        ],
    },
    {
        section: 'python',
        title: 'Python',
        defaults: { ...defaultPythonConfig },
        options: [
            { key: 'classType', label: 'Class style', description: 'Generate dataclasses, Pydantic models or plain classes.', type: 'enum', choices: [{ value: 'dataclasses', label: 'Dataclasses' }, { value: 'pydantic', label: 'Pydantic models' }, { value: 'plain', label: 'Plain classes' }], quick: true },
            { key: 'useTypeHints', label: 'Type hints', description: 'Annotate fields with type hints.', type: 'boolean', quick: true },
            { key: 'nicePropertyNames', label: 'Nice property names', description: 'Convert JSON keys into snake_case attribute names.', type: 'boolean', quick: true },
        ],
    },
    {
        section: 'go',
        title: 'Go',
        defaults: { ...defaultGoConfig },
        options: [
            { key: 'packageName', label: 'Package', description: 'Package clause for the generated file.', type: 'string', quick: true },
            { key: 'useOmitEmpty', label: 'omitempty', description: 'Add ",omitempty" to JSON struct tags of optional fields.', type: 'boolean', quick: true },
        ],
    },
    {
        section: 'kotlin',
        title: 'Kotlin',
        defaults: { ...defaultKotlinConfig },
        options: [
            { key: 'packageName', label: 'Package', description: 'Package declaration for the generated classes.', type: 'string', quick: true },
            { key: 'framework', label: 'JSON library', description: 'Serialization annotations to emit.', type: 'enum', choices: [{ value: 'kotlinx', label: 'kotlinx.serialization' }, { value: 'jackson', label: 'Jackson' }, { value: 'none', label: 'None' }], quick: true },
            { key: 'useDataClasses', label: 'Data classes', description: 'Generate data classes.', type: 'boolean', quick: true },
            { key: 'useArrays', label: 'Arrays', description: 'Use Array<T> instead of List<T>.', type: 'boolean' },
            acronymStyle(),
        ],
    },
    {
        section: 'swift',
        title: 'Swift',
        defaults: { ...defaultSwiftConfig },
        options: [
            { key: 'typeKind', label: 'Type kind', description: 'Generate structs or classes.', type: 'enum', choices: [{ value: 'struct', label: 'Struct' }, { value: 'class', label: 'Class' }], quick: true },
            { key: 'useCodable', label: 'Codable', description: 'Conform the generated types to Codable.', type: 'boolean', quick: true },
            { key: 'accessLevel', label: 'Access level', description: 'Access level of the generated types.', type: 'enum', choices: [{ value: 'public', label: 'public' }, { value: 'internal', label: 'internal' }, { value: 'private', label: 'private' }, { value: 'open', label: 'open' }], quick: true },
            { key: 'useClassesForMutable', label: 'Mutable properties', description: 'Use "var" instead of "let" for properties.', type: 'boolean' },
            acronymStyle(),
        ],
    },
    {
        section: 'dart',
        title: 'Dart',
        defaults: { ...defaultDartConfig },
        options: [
            { key: 'useFreezed', label: 'Freezed', description: 'Generate immutable classes with the freezed package.', type: 'boolean', quick: true },
            { key: 'useJsonSerializable', label: 'json_serializable', description: 'Add json_serializable annotations.', type: 'boolean', quick: true },
            { key: 'nullSafety', label: 'Null safety', description: 'Generate null-safe code.', type: 'boolean', quick: true },
            { key: 'useNum', label: 'num for numbers', description: 'Use num instead of double for decimal numbers.', type: 'boolean' },
            acronymStyle(),
        ],
    },
    {
        section: 'rust',
        title: 'Rust',
        defaults: { deriveDebug: defaultRustConfig.deriveDebug, deriveClone: defaultRustConfig.deriveClone, visibility: defaultRustConfig.visibility, density: defaultRustConfig.density },
        options: [
            { key: 'deriveDebug', label: 'Derive Debug', description: 'Add #[derive(Debug)].', type: 'boolean', quick: true },
            { key: 'deriveClone', label: 'Derive Clone', description: 'Add #[derive(Clone)].', type: 'boolean', quick: true },
            { key: 'visibility', label: 'Visibility', description: 'Visibility of the generated structs and fields.', type: 'enum', choices: [{ value: 'public', label: 'pub' }, { value: 'crate', label: 'pub(crate)' }, { value: 'private', label: 'private' }], quick: true },
            { key: 'density', label: 'Density', description: 'Normal or dense (more compact) output.', type: 'enum', choices: [{ value: 'normal', label: 'Normal' }, { value: 'dense', label: 'Dense' }] },
        ],
    },
    {
        section: 'php',
        title: 'PHP',
        defaults: { ...defaultPHPConfig },
        options: [
            { key: 'namespace', label: 'Namespace', description: 'Namespace for the generated classes.', type: 'string', quick: true },
            { key: 'strictTypes', label: 'strict_types', description: 'Add declare(strict_types=1).', type: 'boolean', quick: true },
            { key: 'useGettersSetters', label: 'Getters and setters', description: 'Generate getters and setters.', type: 'boolean', quick: true },
            { key: 'fastMode', label: 'Fast mode', description: 'Skip validation code in the generated classes.', type: 'boolean' },
            acronymStyle(),
        ],
    },
    {
        section: 'sql',
        title: 'SQL (PostgreSQL, MySQL, SQLite)',
        defaults: { ...defaultSqlSchemaConfig },
        options: [
            { key: 'tableName', label: 'Root table name', description: 'Name of the table created for the top-level JSON.', type: 'string', quick: true },
            nested('SQL schema'),
            { key: 'includeInserts', label: 'INSERT statements', description: 'Also generate INSERT statements for the JSON data, with generated ids linking child tables.', type: 'boolean', quick: true },
            { key: 'ifNotExists', label: 'IF NOT EXISTS', description: 'Use CREATE TABLE IF NOT EXISTS.', type: 'boolean' },
        ],
    },
    {
        section: 'prisma',
        title: 'Prisma',
        defaults: { ...defaultPrismaSchemaConfig },
        options: [
            { key: 'modelName', label: 'Root model name', description: 'Name of the model created for the top-level JSON.', type: 'string' },
            { key: 'provider', label: 'Database', description: 'Datasource provider; controls native types such as @db.Uuid.', type: 'enum', choices: [{ value: 'postgresql', label: 'PostgreSQL' }, { value: 'mysql', label: 'MySQL' }, { value: 'sqlite', label: 'SQLite' }], quick: true },
            nested('Prisma models'),
            { key: 'mapNames', label: 'snake_case table names', description: 'Add @map/@@map so the database uses snake_case column and table names.', type: 'boolean', quick: true },
            { key: 'includeHeader', label: 'Generator & datasource blocks', description: 'Include the generator and datasource blocks.', type: 'boolean' },
        ],
    },
    {
        section: 'jsonSchema',
        title: 'JSON Schema',
        defaults: { ...defaultJsonSchemaConfig },
        options: [
            { key: 'draft', label: 'Draft', description: 'JSON Schema draft version.', type: 'enum', choices: [{ value: '2020-12', label: 'Draft 2020-12' }, { value: '07', label: 'Draft-07' }], quick: true },
            { key: 'title', label: 'Title', description: 'Optional schema title.', type: 'string' },
            { key: 'required', label: 'Required properties', description: 'How required properties are inferred.', type: 'enum', choices: [{ value: 'present', label: 'Keys present in every sample' }, { value: 'none', label: 'None' }], quick: true },
            { key: 'additionalProperties', label: 'Allow additional properties', description: 'Allow properties not seen in the sample.', type: 'boolean', quick: true },
            { key: 'detectFormats', label: 'Detect formats', description: 'Detect formats such as date-time, email, uri and uuid.', type: 'boolean' },
            { key: 'mergeRootArray', label: 'Merge root array', description: 'Treat a top-level array as samples of one object.', type: 'boolean' },
        ],
    },
];

export function getGeneratorSettings(section: string): GeneratorSettingsSpec {
    const spec = GENERATOR_SETTINGS.find(s => s.section === section);
    if (!spec) throw new Error(`Unknown generator settings section: ${section}`);
    return spec;
}

/** Reads a section through `get` (e.g. VS Code's WorkspaceConfiguration.get), falling back to defaults and rejecting invalid values. */
export function resolveGeneratorConfig<T>(section: string, get: (key: string) => unknown): T {
    const spec = getGeneratorSettings(section);
    const result: Record<string, unknown> = { ...spec.defaults };
    for (const opt of spec.options) {
        const value = get(opt.key);
        if (value === undefined || value === null) continue;
        if (opt.type === 'boolean' && typeof value !== 'boolean') continue;
        if (opt.type === 'string' && typeof value !== 'string') continue;
        if (opt.type === 'enum' && !opt.choices?.some(c => c.value === value)) continue;
        result[opt.key] = value;
    }
    return result as T;
}

export interface VsCodeConfigurationSection {
    id: string;
    title: string;
    order: number;
    properties: Record<string, Record<string, unknown>>;
}

/**
 * One VS Code `contributes.configuration` section per generator, so the Settings editor shows
 * "JSON PowerHouse › TypeScript", "JSON PowerHouse › Prisma", and so on.
 */
export function toVsCodeConfiguration(prefix = 'json-powerhouse', firstOrder = 10): VsCodeConfigurationSection[] {
    return GENERATOR_SETTINGS.map((spec, specIndex) => {
        const properties: Record<string, Record<string, unknown>> = {};
        spec.options.forEach((opt, optIndex) => {
            const prop: Record<string, unknown> = {
                type: opt.type === 'enum' ? 'string' : opt.type,
                default: spec.defaults[opt.key],
                description: opt.description,
                order: optIndex,
            };
            if (opt.type === 'enum') {
                prop.enum = opt.choices!.map(c => c.value);
                prop.enumItemLabels = opt.choices!.map(c => c.label);
            }
            properties[`${prefix}.${spec.section}.${opt.key}`] = prop;
        });
        return { id: `${prefix}.${spec.section}`, title: spec.title, order: firstOrder + specIndex, properties };
    });
}
