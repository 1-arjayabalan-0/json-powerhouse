import { generatePHPCode } from '@/core/generators/json-to-php';
import { defaultPHPConfig } from '@/core/types/code-generator-config';
import { VALID_JSON_SAMPLES, INVALID_JSON_SAMPLES, EDGE_CASES, JSON_SAMPLES_FOR_CONVERTERS, PHP_UNION_TYPE_JSON } from '../fixtures/sample-data';

describe('PHP Code Generator', () => {
  const defaultConfig = defaultPHPConfig;

  describe('Positive Cases - Valid JSON input', () => {
    it('should generate PHP code from simple JSON', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.simple, defaultConfig);
      expect(result).toBeDefined();
      expect(result).toContain('class');
    });

    it('should generate PHP code from nested JSON', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.nested, defaultConfig);
      expect(result).toBeDefined();
      expect(result).toContain('class');
    });

    it('should generate PHP code from JSON with array', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.array, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should generate PHP code from complex nested JSON', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.complex, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should generate PHP code from JSON with null values', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.withNulls, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should generate PHP code from empty object', async () => {
      const result = await generatePHPCode(VALID_JSON_SAMPLES.empty, defaultConfig);
      expect(result).toBeDefined();
    });
  });

  describe('Negative Cases - Invalid JSON input', () => {
    it('should throw error on invalid JSON - trailing comma', async () => {
      await expect(
        generatePHPCode(INVALID_JSON_SAMPLES.trailingComma, defaultConfig)
      ).rejects.toThrow();
    });

    it('should throw error on invalid JSON - unclosed object', async () => {
      await expect(
        generatePHPCode(INVALID_JSON_SAMPLES.unclosedObject, defaultConfig)
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle deep nesting', async () => {
      const result = await generatePHPCode(EDGE_CASES.deepNesting, defaultConfig);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle PHP union type error gracefully', async () => {
      await expect(
        generatePHPCode(JSON.stringify(PHP_UNION_TYPE_JSON), defaultConfig)
      ).rejects.toThrow(/union types/i);
    });

    it('should throw descriptive error for empty input', async () => {
      await expect(
        generatePHPCode('', defaultConfig)
      ).rejects.toThrow();
    });
  });
});