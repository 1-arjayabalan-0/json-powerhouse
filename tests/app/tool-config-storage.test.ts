import { configKey, readToolConfig, writeToolConfig, clearToolConfig, KeyValueStorage } from '@/app/lib/tool-config-storage';

function memoryStorage(): KeyValueStorage & { data: Record<string, string> } {
    const data: Record<string, string> = {};
    return {
        data,
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
        removeItem: (k) => { delete data[k]; },
    };
}

const defaults = { indent: '2', sort: false };

describe('tool-config-storage', () => {
    it('uses the jph:config: key prefix', () => {
        expect(configKey('json-formatter')).toBe('jph:config:json-formatter');
    });

    it('returns defaults when nothing is stored or storage is null', () => {
        expect(readToolConfig(memoryStorage(), 'a', defaults)).toEqual(defaults);
        expect(readToolConfig(null, 'a', defaults)).toBe(defaults);
    });

    it('round-trips a config', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: '4', sort: true });
        expect(readToolConfig(s, 'a', defaults)).toEqual({ indent: '4', sort: true });
    });

    it('keeps tools isolated', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: 'tab', sort: true });
        expect(readToolConfig(s, 'b', defaults)).toEqual(defaults);
    });

    it('merges stored values over defaults so new default keys appear', () => {
        const s = memoryStorage();
        s.setItem(configKey('a'), JSON.stringify({ indent: '4' }));
        expect(readToolConfig(s, 'a', { ...defaults, newKey: 1 })).toEqual({ indent: '4', sort: false, newKey: 1 });
    });

    it('ignores corrupt or non-object storage', () => {
        const s = memoryStorage();
        s.setItem(configKey('a'), '{not json');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
        s.setItem(configKey('a'), '[1,2]');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
        s.setItem(configKey('a'), 'null');
        expect(readToolConfig(s, 'a', defaults)).toEqual(defaults);
    });

    it('clear removes the stored config', () => {
        const s = memoryStorage();
        writeToolConfig(s, 'a', { indent: '4', sort: true });
        clearToolConfig(s, 'a');
        expect(s.data).toEqual({});
    });

    it('swallows storage exceptions', () => {
        const throwing: KeyValueStorage = {
            getItem: () => { throw new Error('denied'); },
            setItem: () => { throw new Error('quota'); },
            removeItem: () => { throw new Error('denied'); },
        };
        expect(readToolConfig(throwing, 'a', defaults)).toEqual(defaults);
        expect(() => writeToolConfig(throwing, 'a', defaults)).not.toThrow();
        expect(() => clearToolConfig(throwing, 'a')).not.toThrow();
    });
});
