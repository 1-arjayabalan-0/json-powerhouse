/**
 * Shape inference: merges one or more JSON samples into a summary of the
 * types, string formats, presence and nesting seen. Used by the SQL, Prisma
 * and JSON Schema generators.
 */

export type StringFormat = 'uuid' | 'date' | 'date-time' | 'email' | 'uri';

export interface Shape {
    /** Number of values merged into this shape (including nulls). */
    samples: number;
    nulls: number;
    booleans: number;
    integers: number;
    floats: number;
    strings: number;
    objects: number;
    arrays: number;
    intMin: number;
    intMax: number;
    /** Longest string seen. */
    maxLength: number;
    /** Formats that every string sample matched. Undefined until a string is seen. */
    formats?: Set<StringFormat>;
    /** True when every date-time sample carried a zone (Z or ±hh:mm). */
    allZoned: boolean;
    /** Object fields, in first-seen order. */
    fields: Map<string, Shape>;
    /** How many object samples contained each field. */
    presence: Map<string, number>;
    /** Merged shape of all array items. */
    items?: Shape;
}

export function emptyShape(): Shape {
    return {
        samples: 0, nulls: 0, booleans: 0, integers: 0, floats: 0, strings: 0, objects: 0, arrays: 0,
        intMin: Infinity, intMax: -Infinity, maxLength: 0, allZoned: true,
        fields: new Map(), presence: new Map(),
    };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URI = /^[a-z][a-z0-9+.-]*:\/\/[^\s]+$/i;

function validDate(y: string, m: string, d: string): boolean {
    const mm = Number(m), dd = Number(d);
    return Number(y) > 0 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31;
}

export function detectFormats(s: string): { formats: Set<StringFormat>; zoned: boolean } {
    const formats = new Set<StringFormat>();
    let zoned = false;
    if (UUID.test(s)) formats.add('uuid');
    const d = DATE.exec(s);
    if (d && validDate(d[1], d[2], d[3])) formats.add('date');
    const dt = DATE_TIME.exec(s);
    if (dt && validDate(dt[1], dt[2], dt[3]) && Number(dt[4]) < 24 && Number(dt[5]) < 60) {
        formats.add('date-time');
        zoned = Boolean(dt[7]);
    }
    if (EMAIL.test(s)) formats.add('email');
    if (URI.test(s)) formats.add('uri');
    return { formats, zoned };
}

export function addSample(shape: Shape, value: unknown): void {
    shape.samples++;
    if (value === null || value === undefined) {
        shape.nulls++;
    } else if (typeof value === 'boolean') {
        shape.booleans++;
    } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
            shape.integers++;
            shape.intMin = Math.min(shape.intMin, value);
            shape.intMax = Math.max(shape.intMax, value);
        } else {
            shape.floats++;
        }
    } else if (typeof value === 'string') {
        shape.strings++;
        shape.maxLength = Math.max(shape.maxLength, value.length);
        const { formats, zoned } = detectFormats(value);
        if (!shape.formats) shape.formats = formats;
        else for (const f of [...shape.formats]) if (!formats.has(f)) shape.formats.delete(f);
        if (formats.has('date-time') && !zoned) shape.allZoned = false;
    } else if (Array.isArray(value)) {
        shape.arrays++;
        if (!shape.items) shape.items = emptyShape();
        for (const item of value) addSample(shape.items, item);
    } else if (typeof value === 'object') {
        shape.objects++;
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            let child = shape.fields.get(k);
            if (!child) { child = emptyShape(); shape.fields.set(k, child); }
            addSample(child, v);
            shape.presence.set(k, (shape.presence.get(k) ?? 0) + 1);
        }
    }
}

/** Builds a shape from a list of samples. */
export function inferShape(samples: unknown[]): Shape {
    const shape = emptyShape();
    for (const s of samples) addSample(shape, s);
    return shape;
}

/** Non-null kinds present in a shape. */
export function kindsOf(shape: Shape): ('boolean' | 'integer' | 'number' | 'string' | 'object' | 'array')[] {
    const kinds: ('boolean' | 'integer' | 'number' | 'string' | 'object' | 'array')[] = [];
    if (shape.booleans) kinds.push('boolean');
    if (shape.integers && !shape.floats) kinds.push('integer');
    if (shape.floats) kinds.push('number');
    if (shape.strings) kinds.push('string');
    if (shape.objects) kinds.push('object');
    if (shape.arrays) kinds.push('array');
    return kinds;
}

/** True when a field is present and non-null in every object sample. */
export function isRequired(parent: Shape, key: string): boolean {
    const field = parent.fields.get(key);
    return Boolean(field) && parent.presence.get(key) === parent.objects && field!.nulls === 0;
}

/** Most specific format all samples share (uuid > date-time > date > email > uri). */
export function primaryFormat(shape: Shape): StringFormat | undefined {
    if (!shape.formats) return undefined;
    for (const f of ['uuid', 'date-time', 'date', 'email', 'uri'] as const) {
        if (shape.formats.has(f)) return f;
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// Naming helpers
// ---------------------------------------------------------------------------

function words(name: string): string[] {
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map(w => w.toLowerCase());
}

export function snakeCase(name: string, fallback = 'column'): string {
    let s = words(name).join('_');
    if (!s) s = fallback;
    if (/^\d/.test(s)) s = `_${s}`;
    return s;
}

export function camelCase(name: string, fallback = 'field'): string {
    const w = words(name);
    if (!w.length) return fallback;
    let s = w[0] + w.slice(1).map(x => x[0].toUpperCase() + x.slice(1)).join('');
    if (/^\d/.test(s)) s = `${fallback}${s[0].toUpperCase()}${s.slice(1)}`;
    return s;
}

export function pascalCase(name: string, fallback = 'Model'): string {
    const c = camelCase(name, fallback.toLowerCase());
    return c[0].toUpperCase() + c.slice(1);
}

/** Naive English singular, good enough for table/model names. */
export function singular(name: string): string {
    if (/ies$/i.test(name) && name.length > 4) return name.slice(0, -3) + 'y';
    if (/(ss|us|is)$/i.test(name)) return name;
    if (/(xes|ches|shes|sses|zzes)$/i.test(name)) return name.slice(0, -2);
    if (/s$/i.test(name) && name.length > 3) return name.slice(0, -1);
    return name;
}

/** Returns `name`, or `name_2`, `name_3`… so that it is not in `taken`. Adds the result to `taken`. */
export function uniqueName(name: string, taken: Set<string>, sep = '_'): string {
    let n = name, i = 2;
    while (taken.has(n.toLowerCase())) n = `${name}${sep}${i++}`;
    taken.add(n.toLowerCase());
    return n;
}

/** Parses the generator input into a list of root records. */
export function rootRecords(json: string): { records: Record<string, unknown>[]; isArray: boolean } {
    const data = JSON.parse(json);
    if (Array.isArray(data)) {
        if (data.length === 0) throw new Error('The array is empty. Add at least one object.');
        if (!data.every(r => r !== null && typeof r === 'object' && !Array.isArray(r))) {
            throw new Error('A top-level array must contain only objects (one per row).');
        }
        return { records: data, isArray: true };
    }
    if (data === null || typeof data !== 'object') {
        throw new Error('Input must be a JSON object or an array of objects.');
    }
    return { records: [data], isArray: false };
}
