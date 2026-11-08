import { camelCase, detectFormats, singular, snakeCase, pascalCase, rootRecords } from '@/core/lib/schema/infer';
import { generateSqlSchema, MAX_INSERT_ROWS, quoteIdent, type SqlOptions } from '@/core/lib/schema/sql';
import { generatePrismaSchema, type PrismaOptions } from '@/core/lib/schema/prisma';
import { generateJsonSchema, type JsonSchemaOptions } from '@/core/lib/schema/json-schema';
import { COMPLEX_JSON_SAMPLE } from '@/core/config/samples';

const users = JSON.stringify([
    { id: 1, firstName: 'Ada', email: 'ada@x.io', active: true, createdAt: '2026-01-02T10:00:00Z', tags: ['a', "b'c"], address: { city: 'London' }, orders: [{ sku: 'X1', qty: 2, price: 9.5 }] },
    { id: 2, firstName: 'Bob', email: null, active: false, createdAt: '2026-02-03T11:30:00Z', tags: [], orders: [] },
]);

const sql = (json: string, o: Partial<SqlOptions> = {}) =>
    generateSqlSchema(json, { dialect: 'postgresql', tableName: 'users', nested: 'tables', includeInserts: false, ifNotExists: false, ...o });
const prisma = (json: string, o: Partial<PrismaOptions> = {}) =>
    generatePrismaSchema(json, { modelName: 'User', provider: 'postgresql', nested: 'tables', mapNames: true, includeHeader: false, ...o });
const schema = (json: string, o: Partial<JsonSchemaOptions> = {}) =>
    JSON.parse(generateJsonSchema(json, { draft: '2020-12', title: '', required: 'present', additionalProperties: true, detectFormats: true, mergeRootArray: true, ...o }));

describe('naming helpers', () => {
    it('converts case', () => {
        expect(snakeCase('firstName')).toBe('first_name');
        expect(snakeCase('HTTPStatus')).toBe('http_status');
        expect(snakeCase('2fa code')).toBe('_2fa_code');
        expect(snakeCase('!!!')).toBe('column');
        expect(camelCase('first_name')).toBe('firstName');
        expect(pascalCase('order_items')).toBe('OrderItems');
    });
    it('singularizes common plurals', () => {
        expect(singular('users')).toBe('user');
        expect(singular('categories')).toBe('category');
        expect(singular('boxes')).toBe('box');
        expect(singular('status')).toBe('status');
        expect(singular('address')).toBe('address');
    });
    it('detects string formats', () => {
        expect(detectFormats('2026-01-02').formats.has('date')).toBe(true);
        expect(detectFormats('2026-01-02T10:00:00Z')).toEqual({ formats: new Set(['date-time']), zoned: true });
        expect(detectFormats('550e8400-e29b-41d4-a716-446655440000').formats.has('uuid')).toBe(true);
        expect(detectFormats('2026-13-02').formats.size).toBe(0);
    });
    it('rejects unusable roots', () => {
        expect(() => rootRecords('[1,2]')).toThrow(/only objects/);
        expect(() => rootRecords('"x"')).toThrow(/object or an array/);
        expect(() => rootRecords('[]')).toThrow(/empty/);
    });
});

describe('SQL schema', () => {
    it('maps types per dialect', () => {
        const pg = sql(users);
        expect(pg).toContain('id INTEGER NOT NULL PRIMARY KEY');
        expect(pg).toContain('created_at TIMESTAMPTZ NOT NULL');
        expect(pg).toContain('tags TEXT[] NOT NULL');
        expect(pg).toMatch(/email TEXT,/);
        const my = sql(users, { dialect: 'mysql' });
        expect(my).toContain('first_name VARCHAR(255) NOT NULL');
        expect(my).toContain('tags JSON NOT NULL');
        expect(my).toContain('id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY');
        const lite = sql(users, { dialect: 'sqlite' });
        expect(lite).toContain('PRAGMA foreign_keys = ON;');
        expect(lite).toContain('id INTEGER PRIMARY KEY AUTOINCREMENT');
    });

    it('creates child tables with foreign keys', () => {
        const pg = sql(users);
        expect(pg).toContain('CREATE TABLE address');
        expect(pg).toContain('user_id INTEGER NOT NULL UNIQUE');
        expect(pg).toContain('FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        expect(pg).toContain('CREATE INDEX idx_orders_user_id ON orders (user_id);');
        expect(sql(users, { dialect: 'mysql' })).not.toContain('CREATE INDEX');
    });

    it('stores nested data as JSON when asked', () => {
        const pg = sql(users, { nested: 'json' });
        expect(pg).toContain('address JSONB');
        expect(pg).toContain('orders JSONB NOT NULL');
        expect(pg).not.toContain('FOREIGN KEY');
    });

    it('renders inserts with escaping per dialect', () => {
        const data = JSON.stringify([{ id: 1, note: "it's a \\ path", ok: true, at: '2026-01-02T10:00:00+02:00' }]);
        expect(sql(data, { includeInserts: true })).toContain("(1, 'it''s a \\ path', TRUE, '2026-01-02T10:00:00+02:00')");
        expect(sql(data, { dialect: 'mysql', includeInserts: true })).toContain("(1, 'it''s a \\\\ path', TRUE, '2026-01-02 08:00:00')");
        expect(sql(data, { dialect: 'sqlite', includeInserts: true })).toContain("(1, 'it''s a \\ path', 1, '2026-01-02T10:00:00+02:00')");
    });

    it('assigns child ids and resyncs PostgreSQL identities', () => {
        const pg = sql(users, { includeInserts: true });
        expect(pg).toContain("INSERT INTO orders (id, user_id, sku, qty, price) VALUES\n    (1, 1, 'X1', 2, 9.5);");
        expect(pg).toContain("SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT MAX(id) FROM orders));");
        expect(pg).toContain(`'{"a","b''c"}'`);
    });

    it('adds a surrogate key when id is missing or not unique', () => {
        const pg = sql(JSON.stringify([{ id: 1, n: 'a' }, { id: 1, n: 'b' }]));
        expect(pg).toContain('row_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY');
        expect(pg).toContain('id INTEGER NOT NULL');
        expect(sql('{"name":"x"}')).toContain('id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY');
    });

    it('quotes reserved identifiers', () => {
        expect(quoteIdent('user', 'postgresql')).toBe('"user"');
        expect(quoteIdent('order', 'mysql')).toBe('`order`');
        expect(quoteIdent('name', 'sqlite')).toBe('name');
        expect(sql('{"order":1}', { tableName: 'user' })).toContain('CREATE TABLE "user" (');
    });

    it('caps insert rows', () => {
        const rows = JSON.stringify(Array.from({ length: MAX_INSERT_ROWS + 5 }, (_, i) => ({ v: i })));
        expect(sql(rows, { includeInserts: true })).toContain('-- 5 more rows omitted');
    });

    it('handles the bundled sample', () => {
        const out = sql(JSON.stringify(COMPLEX_JSON_SAMPLE), { tableName: 'items', includeInserts: true });
        expect(out).toContain('id TEXT NOT NULL PRIMARY KEY');
        expect(out).toContain('complex_array JSONB NOT NULL');
        expect(out).toContain('CREATE TABLE flags');
    });
});

describe('Prisma schema', () => {
    it('emits models with relations', () => {
        const out = prisma(users);
        expect(out).toMatch(/model User \{/);
        expect(out).toMatch(/firstName\s+String\s+@map\("first_name"\)/);
        expect(out).toMatch(/tags\s+String\[\]/);
        expect(out).toMatch(/address\s+Address\?/);
        expect(out).toMatch(/orders\s+Order\[\]/);
        expect(out).toMatch(/userId\s+Int\s+@unique @map\("user_id"\)/);
        expect(out).toMatch(/user\s+User\s+@relation\(fields: \[userId\], references: \[id\], onDelete: Cascade\)/);
        expect(out).toMatch(/id\s+Int\s+@id @default\(autoincrement\(\)\)/);
    });

    it('adapts to the provider', () => {
        const lite = prisma(users, { provider: 'sqlite', nested: 'json' });
        expect(lite).toContain('/// JSON array stored as text');
        expect(lite).not.toContain('@db.');
        const my = prisma(users, { provider: 'mysql', includeHeader: true });
        expect(my).toContain('provider = "mysql"');
        expect(my).toMatch(/tags\s+Json/);
    });

    it('can skip @map attributes', () => {
        expect(prisma(users, { mapNames: false })).not.toContain('@map');
    });
});

describe('JSON Schema', () => {
    it('infers types, formats and required keys', () => {
        const s = schema(users);
        expect(s.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
        expect(s.type).toBe('object');
        expect(s.properties.email).toEqual({ type: ['string', 'null'], format: 'email' });
        expect(s.properties.createdAt.format).toBe('date-time');
        expect(s.properties.orders.items.properties.price.type).toBe('number');
        expect(s.required).toContain('email');
        expect(s.required).not.toContain('address');
    });

    it('honours options', () => {
        const s = schema(users, { draft: '07', required: 'none', additionalProperties: false, detectFormats: false, mergeRootArray: false, title: 'Users' });
        expect(s.$schema).toBe('http://json-schema.org/draft-07/schema#');
        expect(s.title).toBe('Users');
        expect(s.type).toBe('array');
        expect(s.items.additionalProperties).toBe(false);
        expect(s.items.required).toBeUndefined();
        expect(s.items.properties.createdAt.format).toBeUndefined();
    });

    it('uses anyOf for mixed values', () => {
        const s = schema('{"v":[1,"a",{"x":1},null]}');
        expect(s.properties.v.items.anyOf).toHaveLength(3);
    });
});
