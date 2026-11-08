import fs from 'fs';
import path from 'path';
import {
    GENERATOR_SETTINGS,
    getGeneratorSettings,
    resolveGeneratorConfig,
    toVsCodeConfiguration,
} from '@/core/config/generator-settings';
import * as codeDefaults from '@/core/types/code-generator-config';
import * as schemaDefaults from '@/core/types/schema-generator-config';

/** Config fields that exist in the types but are not read by their generator. */
const UNUSED = new Set(['rust.useChronoForDates']);

const DEFAULTS: Record<string, object> = {
    typescript: codeDefaults.defaultTypeScriptConfig,
    csharp: codeDefaults.defaultCSharpConfig,
    java: codeDefaults.defaultJavaConfig,
    python: codeDefaults.defaultPythonConfig,
    go: codeDefaults.defaultGoConfig,
    kotlin: codeDefaults.defaultKotlinConfig,
    swift: codeDefaults.defaultSwiftConfig,
    dart: codeDefaults.defaultDartConfig,
    rust: codeDefaults.defaultRustConfig,
    php: codeDefaults.defaultPHPConfig,
    sql: schemaDefaults.defaultSqlSchemaConfig,
    prisma: schemaDefaults.defaultPrismaSchemaConfig,
    jsonSchema: schemaDefaults.defaultJsonSchemaConfig,
};

describe('generator settings metadata', () => {
    it('covers every generator config', () => {
        expect(GENERATOR_SETTINGS.map(s => s.section).sort()).toEqual(Object.keys(DEFAULTS).sort());
    });

    it.each(Object.entries(DEFAULTS))('describes every option of %s with a valid default', (section, defaults) => {
        const spec = getGeneratorSettings(section);
        const expectedKeys = Object.keys(defaults).filter(k => !UNUSED.has(`${section}.${k}`)).sort();
        expect(spec.options.map(o => o.key).sort()).toEqual(expectedKeys);

        for (const opt of spec.options) {
            const value = (defaults as Record<string, unknown>)[opt.key];
            expect(spec.defaults[opt.key]).toEqual(value);
            if (opt.type === 'enum') expect(opt.choices!.map(c => c.value)).toContain(value);
            else expect(typeof value).toBe(opt.type);
        }
        const quick = spec.options.filter(o => o.quick).length;
        expect(quick).toBeGreaterThanOrEqual(1);
        expect(quick).toBeLessThanOrEqual(4);
    });

    it('resolves settings, ignoring invalid values', () => {
        const values: Record<string, unknown> = { typeKind: 'type', runtimeTypecheck: 'yup', readonlyProperties: 'yes', explicitAny: true };
        const config = resolveGeneratorConfig<Record<string, unknown>>('typescript', k => values[k]);
        expect(config).toEqual({ ...codeDefaults.defaultTypeScriptConfig, typeKind: 'type', explicitAny: true });
    });
});

describe('VS Code extension settings', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../extension/package.json'), 'utf8'));
    const sections: { id?: string; properties: Record<string, unknown> }[] = pkg.contributes.configuration;

    it('match the metadata (run `npm run sync-settings` in extension/ if this fails)', () => {
        for (const generated of toVsCodeConfiguration('json-powerhouse', 10)) {
            expect(sections.find(s => s.id === generated.id)).toEqual(generated);
        }
    });

    it('are all read by the extension under json-powerhouse.<section>.<key>', () => {
        const keys = sections.flatMap(s => Object.keys(s.properties));
        for (const spec of GENERATOR_SETTINGS) {
            for (const opt of spec.options) expect(keys).toContain(`json-powerhouse.${spec.section}.${opt.key}`);
        }
    });
});
