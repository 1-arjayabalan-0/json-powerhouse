import { generateTypeScriptCode } from '@/core/generators/json-to-typescript';
import { defaultTypeScriptConfig } from '@/core/types/code-generator-config';
import { VALID_JSON_SAMPLES, INVALID_JSON_SAMPLES, EDGE_CASES, JSON_SAMPLES_FOR_CONVERTERS } from '../fixtures/sample-data';

describe('TypeScript Code Generator', () => {
  const defaultConfig = defaultTypeScriptConfig;

  describe('Positive Cases - Valid JSON input', () => {
    it('should generate TypeScript code from simple JSON', async () => {
      const result = await generateTypeScriptCode(VALID_JSON_SAMPLES.simple, defaultConfig);
      expect(result).toBeDefined();
      expect(result).toContain('interface');
      expect(result).toContain('Root');
    });

    it('should generate TypeScript code from nested JSON', async () => {
      const result = await generateTypeScriptCode(VALID_JSON_SAMPLES.nested, defaultConfig);
      expect(result).toBeDefined();
      expect(result).toContain('interface');
    });

    it('should generate TypeScript code from JSON with array', async () => {
      const result = await generateTypeScriptCode(VALID_JSON_SAMPLES.array, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should generate TypeScript code from complex nested JSON', async () => {
      const result = await generateTypeScriptCode(VALID_JSON_SAMPLES.complex, defaultConfig);
      expect(result).toBeDefined();
    });

    it('should generate TypeScript code from empty object', async () => {
      const result = await generateTypeScriptCode(VALID_JSON_SAMPLES.empty, defaultConfig);
      expect(result).toBeDefined();
    });
  });

  describe('Negative Cases - Invalid JSON input', () => {
    it('should throw error on invalid JSON - trailing comma', async () => {
      await expect(
        generateTypeScriptCode(INVALID_JSON_SAMPLES.trailingComma, defaultConfig)
      ).rejects.toThrow();
    });

    it('should throw error on invalid JSON - unclosed object', async () => {
      await expect(
        generateTypeScriptCode(INVALID_JSON_SAMPLES.unclosedObject, defaultConfig)
      ).rejects.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle deep nesting', async () => {
      const result = await generateTypeScriptCode(EDGE_CASES.deepNesting, defaultConfig);
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw descriptive error for empty input', async () => {
      await expect(
        generateTypeScriptCode('', defaultConfig)
      ).rejects.toThrow();
    });
  });
});