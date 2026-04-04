import '@testing-library/jest-dom';
import type { ReactNode } from 'react';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJSON(): R;
      toBeValidJSONWithError(): R;
      toContainJSON(expected: object): R;
    }
  }
}

expect.extend({
  toBeValidJSON() {
    try {
      JSON.parse(this.passed ? '' : (this as any).actual);
      return { pass: true, message: () => 'Expected not to be valid JSON' };
    } catch (e: any) {
      return { pass: false, message: () => `Expected to be valid JSON but got: ${e.message}` };
    }
  },
  toBeValidJSONWithError() {
    try {
      JSON.parse(this.passed ? '' : (this as any).actual);
      return { pass: false, message: () => 'Expected to throw on invalid JSON' };
    } catch (e: any) {
      return { pass: true, message: () => 'Expected to throw on invalid JSON' };
    }
  },
  toContainJSON(expected: object) {
    try {
      const actual = JSON.parse((this as any).actual);
      const pass = JSON.stringify(actual) === JSON.stringify(expected);
      return {
        pass,
        message: () => pass ? 'JSON matches expected' : `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`
      };
    } catch (e: any) {
      return { pass: false, message: () => `Failed to parse JSON: ${e.message}` };
    }
  },
});

export {};