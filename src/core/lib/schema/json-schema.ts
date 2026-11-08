/**
 * Infers a JSON Schema (draft 2020-12 or draft-07) from one or more samples.
 */
import { inferShape, kindsOf, primaryFormat, type Shape } from './infer';

export type JsonSchemaDraft = '2020-12' | '07';
export type RequiredMode = 'present' | 'none';

export interface JsonSchemaOptions {
    draft: JsonSchemaDraft;
    title: string;
    required: RequiredMode;
    additionalProperties: boolean;
    detectFormats: boolean;
    /** Treat a top-level array as several samples of one object instead of an array schema. */
    mergeRootArray: boolean;
}

const DRAFT_URI: Record<JsonSchemaDraft, string> = {
    '2020-12': 'https://json-schema.org/draft/2020-12/schema',
    '07': 'http://json-schema.org/draft-07/schema#',
};

type Schema = Record<string, unknown>;

function objectSchema(shape: Shape, opts: JsonSchemaOptions): Schema {
    const properties: Record<string, Schema> = {};
    const required: string[] = [];
    for (const [key, field] of shape.fields) {
        properties[key] = schemaFor(field, opts);
        // A key is required when every object sample had it (null values are still "present").
        if (opts.required === 'present' && shape.presence.get(key) === shape.objects) required.push(key);
    }
    const s: Schema = { type: 'object', properties };
    if (required.length) s.required = required;
    if (!opts.additionalProperties) s.additionalProperties = false;
    return s;
}

function arraySchema(shape: Shape, opts: JsonSchemaOptions): Schema {
    const s: Schema = { type: 'array' };
    if (shape.items && shape.items.samples > 0) s.items = schemaFor(shape.items, opts);
    return s;
}

function schemaFor(shape: Shape, opts: JsonSchemaOptions): Schema {
    const kinds = kindsOf(shape);
    const nullable = shape.nulls > 0;
    if (kinds.length === 0) return nullable ? { type: 'null' } : {};

    const complex = kinds.filter(k => k === 'object' || k === 'array');
    const simple = kinds.filter(k => k !== 'object' && k !== 'array');

    const simpleSchema = (): Schema => {
        const types: string[] = [...simple];
        if (nullable && complex.length === 0) types.push('null');
        const s: Schema = { type: types.length === 1 ? types[0] : types };
        if (opts.detectFormats && simple.length === 1 && simple[0] === 'string') {
            const f = primaryFormat(shape);
            if (f) s.format = f;
        }
        return s;
    };

    if (complex.length === 0) return simpleSchema();
    if (complex.length === 1 && simple.length === 0) {
        const s = complex[0] === 'object' ? objectSchema(shape, opts) : arraySchema(shape, opts);
        if (nullable) s.type = [s.type as string, 'null'];
        return s;
    }
    const anyOf: Schema[] = [];
    if (simple.length) anyOf.push(simpleSchema());
    if (complex.includes('object')) anyOf.push(objectSchema(shape, opts));
    if (complex.includes('array')) anyOf.push(arraySchema(shape, opts));
    if (nullable) anyOf.push({ type: 'null' });
    return { anyOf };
}

export function generateJsonSchema(json: string, opts: JsonSchemaOptions): string {
    const data = JSON.parse(json);
    const samples = opts.mergeRootArray && Array.isArray(data) && data.length > 0 ? data : [data];
    const body = schemaFor(inferShape(samples), opts);
    const schema: Schema = { $schema: DRAFT_URI[opts.draft] };
    if (opts.title.trim()) schema.title = opts.title.trim();
    return JSON.stringify({ ...schema, ...body }, null, 2);
}
