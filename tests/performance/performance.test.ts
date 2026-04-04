import { generatePHPCode } from '@/core/generators/json-to-php';
import { generateTypeScriptCode } from '@/core/generators/json-to-typescript';
import { generatePythonCode } from '@/core/generators/json-to-python';
import { generateJavaCode } from '@/core/generators/json-to-java';
import { defaultPHPConfig, defaultTypeScriptConfig, defaultPythonConfig, defaultJavaConfig } from '@/core/types/code-generator-config';
import { generateLargeJSON } from '../fixtures/sample-data';

describe('Performance Tests', () => {
  const testJson = JSON.stringify({ id: 1, name: 'Test', data: { a: 1, b: 2, c: 3 } });

  describe('Small JSON', () => {
    it('PHP generator should complete in < 3s', async () => {
      const start = Date.now();
      await generatePHPCode(testJson, defaultPHPConfig);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });

    it('TypeScript generator should complete in < 3s', async () => {
      const start = Date.now();
      await generateTypeScriptCode(testJson, defaultTypeScriptConfig);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });

    it('Python generator should complete in < 3s', async () => {
      const start = Date.now();
      await generatePythonCode(testJson, defaultPythonConfig);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });

    it('Java generator should complete in < 3s', async () => {
      const start = Date.now();
      await generateJavaCode(testJson, defaultJavaConfig);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000);
    });
  });

  describe('Medium JSON (100 items)', () => {
    const mediumJson = generateLargeJSON(100);

    it('PHP should handle medium JSON', async () => {
      const result = await generatePHPCode(mediumJson, defaultPHPConfig);
      expect(result).toBeDefined();
    }, 10000);

    it('TypeScript should handle medium JSON', async () => {
      const result = await generateTypeScriptCode(mediumJson, defaultTypeScriptConfig);
      expect(result).toBeDefined();
    }, 10000);
  });

  describe('Empty JSON', () => {
    it('PHP should handle empty object', async () => {
      const result = await generatePHPCode('{}', defaultPHPConfig);
      expect(result).toBeDefined();
    });

    it('TypeScript should handle empty object', async () => {
      const result = await generateTypeScriptCode('{}', defaultTypeScriptConfig);
      expect(result).toBeDefined();
    });
  });
});