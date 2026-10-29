import { extractTextTable, normalizeText } from '@/core/lib/text-viewer/extractTextTable';
import { defaultTextViewerConfig, TextViewerConfig } from '@/core/types/text-viewer-config';

const cfg = (over: Partial<TextViewerConfig> = {}) => ({ ...defaultTextViewerConfig, ...over });

describe('normalizeText', () => {
    it('converts CRLF and CR to LF', () => {
        expect(normalizeText('a\r\nb\rc')).toBe('a\nb\nc');
    });
});

describe('extractTextTable', () => {
    it('returns empty table for null', () => {
        expect(extractTextTable(null, cfg())).toEqual({ columns: [], rows: [], isEmpty: true });
    });

    it('returns empty table for empty array', () => {
        expect(extractTextTable([], cfg()).isEmpty).toBe(true);
    });

    it('treats single object as one row with union-safe keys', () => {
        const t = extractTextTable({ id: 1, name: 'x' }, cfg());
        expect(t.rows).toHaveLength(1);
        expect(t.columns.map(c => c.key).sort()).toEqual(['id', 'name']);
    });

    it('uses union of keys across array items', () => {
        const t = extractTextTable([{ a: 1 }, { b: 2 }], cfg());
        expect(t.columns.map(c => c.key).sort()).toEqual(['a', 'b']);
    });

    it('marks string field as text when any value length >= threshold', () => {
        const long = 'x'.repeat(80);
        const t = extractTextTable([{ body: long }, { body: 'short' }], cfg());
        expect(t.columns.find(c => c.key === 'body')!.mode).toBe('text');
    });

    it('marks string field compact when all values below threshold', () => {
        const t = extractTextTable([{ body: 'short' }], cfg());
        expect(t.columns.find(c => c.key === 'body')!.mode).toBe('compact');
    });

    it('honors forceTextFields over threshold', () => {
        const t = extractTextTable([{ note: 'tiny' }], cfg({ forceTextFields: ['note'] }));
        expect(t.columns.find(c => c.key === 'note')!.mode).toBe('text');
    });

    it('honors excludeTextFields over threshold', () => {
        const t = extractTextTable([{ body: 'x'.repeat(200) }], cfg({ excludeTextFields: ['body'] }));
        expect(t.columns.find(c => c.key === 'body')!.mode).toBe('compact');
    });

    it('renders primitive array as single value column', () => {
        const t = extractTextTable(['alpha', 'beta'.repeat(100)], cfg());
        expect(t.columns).toHaveLength(1);
        expect(t.columns[0].key).toBe('value');
        expect(t.columns[0].mode).toBe('text');
        expect(t.rows).toHaveLength(2);
    });

    it('stringifies nested objects in compact cells', () => {
        const t = extractTextTable([{ meta: { a: 1 } }], cfg());
        expect(t.rows[0].cells.meta).toBe('{"a":1}');
    });

    it('normalizes newlines inside text cells', () => {
        const t = extractTextTable([{ body: 'a\r\nb' }], cfg({ forceTextFields: ['body'] }));
        expect(t.rows[0].cells.body).toBe('a\nb');
    });

    it('uses custom threshold', () => {
        const t = extractTextTable([{ body: 'y'.repeat(50) }], cfg({ textThreshold: 50 }));
        expect(t.columns.find(c => c.key === 'body')!.mode).toBe('text');
    });

    it('non-string values in text column stay stringified', () => {
        const t = extractTextTable([{ id: 1, body: 'z'.repeat(90) }], cfg());
        expect(t.rows[0].cells.id).toBe('1');
    });

    it('handles sparse arrays and nullish items without crashing', () => {
        const sparse: unknown[] = [];
        sparse[1] = { a: 1 };
        const t = extractTextTable(sparse, cfg());
        expect(t.rows).toHaveLength(2);
        expect(t.rows[0].cells).toEqual({ value: '', a: '' });
        expect(t.rows[1].cells.a).toBe('1');

        const t2 = extractTextTable([null, { a: 1 }], cfg());
        expect(t2.rows[0].cells).toEqual({ value: 'null', a: '' });
        expect(t2.rows[1].cells.a).toBe('1');
    });

    it('stores __proto__ as own cell key', () => {
        const t = extractTextTable(JSON.parse('{"__proto__": 1, "a": 2}'), cfg());
        expect(t.rows[0].cells['__proto__']).toBe('1');
        expect(t.rows[0].cells.a).toBe('2');
        expect(Object.keys(t.rows[0].cells)).toContain('__proto__');
    });
});
