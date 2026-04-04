import { generatePythonCode } from '@/core/generators/json-to-python';
import { generateJavaCode } from '@/core/generators/json-to-java';
import { generateCSharpCode } from '@/core/generators/json-to-csharp';
import { generateGoCode } from '@/core/generators/json-to-go';
import { generateRustCode } from '@/core/generators/json-to-rust';
import { generateKotlinCode } from '@/core/generators/json-to-kotlin';
import { generateSwiftCode } from '@/core/generators/json-to-swift';
import { generateDartCode } from '@/core/generators/json-to-dart';
import { defaultPythonConfig, defaultJavaConfig, defaultCSharpConfig, defaultGoConfig, defaultRustConfig, defaultKotlinConfig, defaultSwiftConfig, defaultDartConfig } from '@/core/types/code-generator-config';
import { VALID_JSON_SAMPLES, INVALID_JSON_SAMPLES } from '../fixtures/sample-data';

describe('Python Generator', () => {
  const config = defaultPythonConfig;
  it('should generate Python code from simple JSON', async () => {
    const result = await generatePythonCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
  it('should throw on invalid JSON', async () => {
    await expect(generatePythonCode(INVALID_JSON_SAMPLES.trailingComma, config)).rejects.toThrow();
  });
});

describe('Java Generator', () => {
  const config = defaultJavaConfig;
  it('should generate Java code from simple JSON', async () => {
    const result = await generateJavaCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
  it('should throw on invalid JSON', async () => {
    await expect(generateJavaCode(INVALID_JSON_SAMPLES.trailingComma, config)).rejects.toThrow();
  });
});

describe('CSharp Generator', () => {
  const config = defaultCSharpConfig;
  it('should generate C# code from simple JSON', async () => {
    const result = await generateCSharpCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});

describe('Go Generator', () => {
  const config = defaultGoConfig;
  it('should generate Go code from simple JSON', async () => {
    const result = await generateGoCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});

describe('Rust Generator', () => {
  const config = defaultRustConfig;
  it('should generate Rust code from simple JSON', async () => {
    const result = await generateRustCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});

describe('Kotlin Generator', () => {
  const config = defaultKotlinConfig;
  it('should generate Kotlin code from simple JSON', async () => {
    const result = await generateKotlinCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});

describe('Swift Generator', () => {
  const config = defaultSwiftConfig;
  it('should generate Swift code from simple JSON', async () => {
    const result = await generateSwiftCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});

describe('Dart Generator', () => {
  const config = defaultDartConfig;
  it('should generate Dart code from simple JSON', async () => {
    const result = await generateDartCode(VALID_JSON_SAMPLES.simple, config);
    expect(result).toBeDefined();
  });
});