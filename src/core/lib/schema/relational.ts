/**
 * Turns JSON records into a relational model: tables, typed columns, primary
 * and foreign keys, and the rows to insert. Nested objects and arrays of
 * objects become child tables (or JSON columns), arrays of scalars become
 * array columns. SQL and Prisma emitters render this model.
 */
import { inferShape, isRequired, kindsOf, primaryFormat, singular, snakeCase, uniqueName, type Shape } from './infer';

export type ScalarColumnType =
    | { kind: 'int'; big: boolean }
    | { kind: 'float' }
    | { kind: 'bool' }
    | { kind: 'string'; maxLength: number }
    | { kind: 'date' }
    | { kind: 'datetime'; zoned: boolean }
    | { kind: 'uuid' };

export type ColumnType = ScalarColumnType | { kind: 'json' } | { kind: 'array'; of: ScalarColumnType };

export interface Column {
    name: string;
    /** Original JSON key, if the column maps to one. */
    key?: string;
    type: ColumnType;
    nullable: boolean;
    primary?: boolean;
    /** Surrogate auto-increment key added by the generator. */
    generated?: boolean;
    references?: { table: Table; unique: boolean };
}

export interface Table {
    name: string;
    columns: Column[];
    pk: Column;
    fk?: Column;
    parent?: Table;
    relation?: 'one' | 'many';
    /** JSON key in the parent that holds this table's data. */
    parentKey?: string;
    children: Table[];
    rows: unknown[][];
}

export type NestedStrategy = 'tables' | 'json';

export interface RelationalOptions {
    rootName: string;
    nested: NestedStrategy;
}

const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;

function scalarType(shape: Shape): ScalarColumnType | undefined {
    const kinds = kindsOf(shape);
    if (kinds.length === 0) return { kind: 'string', maxLength: 0 };
    if (kinds.some(k => k === 'object' || k === 'array')) return undefined;
    if (kinds.length > 1) return { kind: 'string', maxLength: Math.max(shape.maxLength, 32) };
    switch (kinds[0]) {
        case 'boolean': return { kind: 'bool' };
        case 'integer': return { kind: 'int', big: shape.intMin < INT32_MIN || shape.intMax > INT32_MAX };
        case 'number': return { kind: 'float' };
        case 'string': {
            const f = primaryFormat(shape);
            if (f === 'uuid') return { kind: 'uuid' };
            if (f === 'date-time') return { kind: 'datetime', zoned: shape.allZoned };
            if (f === 'date') return { kind: 'date' };
            return { kind: 'string', maxLength: shape.maxLength };
        }
    }
    return undefined;
}

type FieldPlan = { type: ColumnType } | { child: 'one' | 'many' };

function planField(shape: Shape, nested: NestedStrategy): FieldPlan {
    const kinds = kindsOf(shape);
    if (kinds.length === 1 && kinds[0] === 'object') {
        return nested === 'tables' && shape.fields.size > 0 ? { child: 'one' } : { type: { kind: 'json' } };
    }
    if (kinds.length === 1 && kinds[0] === 'array') {
        const items = shape.items;
        if (!items || items.samples === items.nulls) return { type: { kind: 'json' } };
        const itemKinds = kindsOf(items);
        if (itemKinds.length === 1 && itemKinds[0] === 'object') {
            return nested === 'tables' && items.fields.size > 0 && items.nulls === 0 ? { child: 'many' } : { type: { kind: 'json' } };
        }
        const of = items.nulls === 0 && itemKinds.length === 1 ? scalarType(items) : undefined;
        return of ? { type: { kind: 'array', of } } : { type: { kind: 'json' } };
    }
    const scalar = scalarType(shape);
    return { type: scalar ?? { kind: 'json' } };
}

interface PendingRecord { rec: Record<string, unknown>; parentPk?: unknown }

/** Builds the relational model. Tables are ordered parents first. */
export function buildRelationalModel(records: Record<string, unknown>[], opts: RelationalOptions): Table[] {
    const tables: Table[] = [];
    const tableNames = new Set<string>();

    function build(name: string, pending: PendingRecord[], parent?: Table, relation?: 'one' | 'many', parentKey?: string): Table {
        const shape = inferShape(pending.map(p => p.rec));
        const taken = new Set<string>();

        // Primary key: reuse an `id` field when it is present, non-null, scalar and unique.
        const idKey = [...shape.fields.keys()].find(k => snakeCase(k) === 'id');
        let pkFromData = false;
        if (idKey && isRequired(shape, idKey)) {
            const t = scalarType(shape.fields.get(idKey)!);
            const values = pending.map(p => p.rec[idKey]);
            pkFromData = Boolean(t) && ['int', 'uuid', 'string'].includes(t!.kind) && new Set(values).size === values.length;
        }

        let pk: Column;
        if (pkFromData) {
            pk = { name: uniqueName('id', taken), key: idKey, type: scalarType(shape.fields.get(idKey!)!)!, nullable: false, primary: true };
        } else {
            pk = { name: uniqueName(idKey ? 'row_id' : 'id', taken), type: { kind: 'int', big: true }, nullable: false, primary: true, generated: true };
        }

        const table: Table = { name, columns: [pk], pk, parent, relation, parentKey, children: [], rows: [] };
        tables.push(table);

        if (parent) {
            const fkType: ColumnType = parent.pk.generated ? { kind: 'int', big: true } : parent.pk.type;
            const fk: Column = {
                name: uniqueName(`${snakeCase(singular(parent.name))}_id`, taken),
                type: fkType,
                nullable: false,
                references: { table: parent, unique: relation === 'one' },
            };
            table.fk = fk;
            table.columns.push(fk);
        }

        const childPlans: { key: string; relation: 'one' | 'many' }[] = [];
        for (const [key, fieldShape] of shape.fields) {
            if (pkFromData && key === idKey) continue;
            const plan = planField(fieldShape, opts.nested);
            if ('child' in plan) {
                childPlans.push({ key, relation: plan.child });
                continue;
            }
            table.columns.push({
                name: uniqueName(snakeCase(key), taken),
                key,
                type: plan.type,
                nullable: !isRequired(shape, key),
            });
        }

        // Rows, and the records each child table will receive.
        const childRecords = new Map<string, PendingRecord[]>(childPlans.map(c => [c.key, []]));
        let counter = 0;
        for (const p of pending) {
            const pkValue = pkFromData ? p.rec[idKey!] : ++counter;
            table.rows.push(table.columns.map(col => {
                if (col === pk) return pkValue;
                if (col === table.fk) return p.parentPk;
                const v = col.key === undefined ? null : p.rec[col.key];
                return v === undefined ? null : v;
            }));
            for (const { key, relation: rel } of childPlans) {
                const v = p.rec[key];
                if (v === null || v === undefined) continue;
                const list = childRecords.get(key)!;
                if (rel === 'one') list.push({ rec: v as Record<string, unknown>, parentPk: pkValue });
                else for (const item of v as Record<string, unknown>[]) list.push({ rec: item, parentPk: pkValue });
            }
        }

        for (const { key, relation: rel } of childPlans) {
            const base = snakeCase(key, 'child');
            const childName = tableNames.has(base) ? uniqueName(`${name}_${base}`, tableNames) : uniqueName(base, tableNames);
            table.children.push(build(childName, childRecords.get(key)!, table, rel, key));
        }
        return table;
    }

    const rootName = uniqueName(snakeCase(opts.rootName || 'items', 'items'), tableNames);
    build(rootName, records.map(rec => ({ rec })));
    return tables;
}
