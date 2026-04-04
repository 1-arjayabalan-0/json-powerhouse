import { VALID_JSON_SAMPLES, INVALID_JSON_SAMPLES, EDGE_CASES } from '../fixtures/sample-data';

export type JSONOperation = 'parse' | 'stringify' | 'format' | 'minify' | 'validate' | 'convert';

export interface TestCase<T = unknown> {
  name: string;
  input: string;
  expected?: T;
  shouldThrow?: boolean;
  errorMessage?: string;
}

export function createPositiveTestCases(
  operation: JSONOperation,
  samples: Record<string, string> = VALID_JSON_SAMPLES
): TestCase[] {
  return Object.entries(samples).map(([key, value]) => ({
    name: `${operation}: ${key}`,
    input: value,
  }));
}

export function createNegativeTestCases(
  operation: JSONOperation,
  samples: Record<string, string> = INVALID_JSON_SAMPLES
): TestCase[] {
  return Object.entries(samples).map(([key, value]) => ({
    name: `${operation}: invalid - ${key}`,
    input: value,
    shouldThrow: true,
  }));
}

export function createEdgeCaseTestCases(
  operation: JSONOperation,
  samples: Record<string, string> = EDGE_CASES
): TestCase[] {
  return Object.entries(samples).map(([key, value]) => ({
    name: `${operation}: edge - ${key}`,
    input: value,
  }));
}

export async function runBatchTests<T>(
  testCases: TestCase<T>[],
  testFn: (input: string) => Promise<T> | T
): Promise<{ passed: number; failed: number; results: TestCaseResult<T>[] }> {
  const results: TestCaseResult<T>[] = [];
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    const startTime = Date.now();
    try {
      const result = await testFn(testCase.input);
      const duration = Date.now() - startTime;
      
      if (testCase.shouldThrow) {
        results.push({
          ...testCase,
          status: 'failed',
          duration,
          error: 'Expected to throw but succeeded',
        });
        failed++;
      } else if (testCase.expected && JSON.stringify(result) !== JSON.stringify(testCase.expected)) {
        results.push({
          ...testCase,
          status: 'failed',
          duration,
          error: `Expected ${JSON.stringify(testCase.expected)} but got ${JSON.stringify(result)}`,
        });
        failed++;
      } else {
        results.push({
          ...testCase,
          status: 'passed',
          duration,
          result,
        });
        passed++;
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      if (testCase.shouldThrow) {
        results.push({
          ...testCase,
          status: 'passed',
          duration,
        });
        passed++;
      } else {
        results.push({
          ...testCase,
          status: 'failed',
          duration,
          error: error.message,
        });
        failed++;
      }
    }
  }

  return { passed, failed, results };
}

export interface TestCaseResult<T> extends TestCase<T> {
  status: 'passed' | 'failed';
  duration: number;
  result?: T;
  error?: string;
}

export function measurePerformance(
  fn: () => void | Promise<void>,
  iterations: number = 100
): { avg: number; min: number; max: number; total: number } {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    fn();
    times.push(Date.now() - start);
  }

  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    total: times.reduce((a, b) => a + b, 0),
  };
}

export async function measureAsyncPerformance(
  fn: () => Promise<void>,
  iterations: number = 100
): Promise<{ avg: number; min: number; max: number; total: number }> {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await fn();
    times.push(Date.now() - start);
  }

  return {
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    total: times.reduce((a, b) => a + b, 0),
  };
}

export function assertJSONEquals(actual: string, expected: string, message?: string): void {
  try {
    const actualParsed = JSON.parse(actual);
    const expectedParsed = JSON.parse(expected);
    expect(JSON.stringify(actualParsed)).toBe(JSON.stringify(expectedParsed));
  } catch (e: any) {
    throw new Error(message || `JSON comparison failed: ${e.message}\nActual: ${actual}\nExpected: ${expected}`);
  }
}

export function assertValidJSON(json: string): void {
  try {
    JSON.parse(json);
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message}`);
  }
}

export function assertInvalidJSON(json: string): void {
  try {
    JSON.parse(json);
    throw new Error('Expected invalid JSON but parsing succeeded');
  } catch (e: any) {
    // Expected to throw
  }
}

export const JSON_OPERATIONS = {
  PARSE: 'parse',
  STRINGIFY: 'stringify',
  FORMAT: 'format',
  MINIFY: 'minify',
  VALIDATE: 'validate',
  CONVERT: 'convert',
} as const;

export const GENERATORS = [
  'php',
  'typescript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'kotlin',
  'swift',
  'dart',
] as const;

export type GeneratorType = typeof GENERATORS[number];