import { VALID_JSON_SAMPLES, INVALID_JSON_SAMPLES, EDGE_CASES } from '../fixtures/sample-data';

describe('JSON Utilities', () => {
  describe('JSON.parse()', () => {
    describe('Valid JSON', () => {
      it('should parse simple JSON', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.simple);
        expect(result).toEqual({ name: 'John', age: 30 });
      });

      it('should parse nested JSON', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.nested);
        expect(result).toHaveProperty('user');
        expect(result.user).toHaveProperty('name');
      });

      it('should parse JSON array', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.array);
        expect(result).toEqual({ items: ['a', 'b', 'c'] });
      });

      it('should parse complex nested JSON', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.complex);
        expect(result).toHaveProperty('users');
        expect(Array.isArray(result.users)).toBe(true);
      });

      it('should parse JSON with null', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.withNulls);
        expect(result.a).toBeNull();
        expect(result.b).toBe(true);
        expect(result.c).toBe(false);
        expect(result.d).toBe(123);
        expect(result.e).toBe('text');
      });

      it('should parse empty object', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.empty);
        expect(result).toEqual({});
      });

      it('should parse empty array', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.emptyArray);
        expect(result).toEqual([]);
      });

      it('should parse number', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.number);
        expect(result).toBe(42);
      });

      it('should parse string', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.string);
        expect(result).toBe('hello');
      });

      it('should parse boolean true', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.booleanTrue);
        expect(result).toBe(true);
      });

      it('should parse boolean false', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.booleanFalse);
        expect(result).toBe(false);
      });

      it('should parse null', () => {
        const result = JSON.parse(VALID_JSON_SAMPLES.nullValue);
        expect(result).toBeNull();
      });
    });

    describe('Invalid JSON', () => {
      it('should throw on trailing comma', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.trailingComma)).toThrow();
      });

      it('should throw on missing quote', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.missingQuote)).toThrow();
      });

      it('should throw on unclosed object', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.unclosedObject)).toThrow();
      });

      it('should throw on unclosed array', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.unclosedArray)).toThrow();
      });

      it('should throw on extra comma', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.extraComma)).toThrow();
      });

      it('should throw on broken escape', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.brokenEscape)).toThrow();
      });

      it('should throw on single quotes', () => {
        expect(() => JSON.parse(INVALID_JSON_SAMPLES.singleQuotes)).toThrow();
      });
    });
  });

  describe('JSON.stringify()', () => {
    it('should stringify object', () => {
      const result = JSON.stringify({ name: 'John', age: 30 });
      expect(result).toBe('{"name":"John","age":30}');
    });

    it('should stringify with indentation', () => {
      const result = JSON.stringify({ name: 'John', age: 30 }, null, 2);
      expect(result).toContain('"name": "John"');
    });

    it('should handle special characters', () => {
      const result = JSON.stringify({ text: 'Hello\nWorld' });
      expect(result).toContain('\\n');
    });

    it('should handle unicode', () => {
      const result = JSON.stringify({ text: '你好' });
      expect(result).toContain('你好');
    });
  });

  describe('JSON.stringify() with replacer', () => {
    it('should filter properties', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = JSON.stringify(obj, ['a', 'c']);
      expect(result).toBe('{"a":1,"c":3}');
    });
  });

  describe('JSON.stringify() with space', () => {
    it('should format with 2 spaces', () => {
      const result = JSON.stringify({ a: 1 }, null, 2);
      expect(result).toBe('{\n  "a": 1\n}');
    });

    it('should format with tab', () => {
      const result = JSON.stringify({ a: 1 }, null, '\t');
      expect(result).toBe('{\n\t"a": 1\n}');
    });
  });
});