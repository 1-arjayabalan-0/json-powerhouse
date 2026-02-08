
export interface TestCase {
    id: string;
    name: string;
    input: string;
    expectedStatus: 'valid' | 'fixed' | 'invalid';
    description: string;
}

export const TEST_CASES: TestCase[] = [
    {
        id: 'valid-1',
        name: 'Standard Valid JSON',
        input: '{\n  "key": "value",\n  "number": 123,\n  "bool": true\n}',
        expectedStatus: 'valid',
        description: 'Should pass without any issues.'
    },
    {
        id: 'recoverable-comments',
        name: 'Comments (Recoverable)',
        input: '{\n  // This is a comment\n  "key": "value" /* Block comment */\n}',
        expectedStatus: 'fixed', // Auto-fixable
        description: 'Should detect and remove comments.'
    },
    {
        id: 'recoverable-trailing-comma',
        name: 'Trailing Commas (Recoverable)',
        input: '{\n  "array": [1, 2, 3,],\n  "object": {\n    "a": 1,\n  }\n}',
        expectedStatus: 'fixed',
        description: 'Should detect and remove trailing commas.'
    },
    {
        id: 'fixable-single-quotes',
        name: 'Single Quotes (Fixable)',
        input: '{\n  \'key\': \'value\'\n}',
        expectedStatus: 'fixed', // Engine now patches this
        description: 'Should convert single quotes to double quotes.'
    },
    {
        id: 'fixable-unquoted-keys',
        name: 'Unquoted Keys (Fixable)',
        input: '{\n  key: "value",\n  other_key: 123\n}',
        expectedStatus: 'fixed',
        description: 'Should quote keys.'
    },
    {
        id: 'fatal-unquoted-values',
        name: 'Unquoted Values (Heuristic Fix)',
        input: '{\n  "status": active,\n  "count": number\n}',
        expectedStatus: 'fixed', // Our new engine logic should fix this via patch
        description: 'Should quote unquoted string values like "active" and "number".'
    },
    {
        id: 'complex-kitchen-sink',
        name: 'Complex Mixed Issues',
        input: '{\n  // Header\n  key: \'value\',\n  "list": [1, 2,],\n  "status": pending\n}',
        expectedStatus: 'fixed',
        description: 'Should fix comments, single quotes, trailing commas, unquoted keys, and unquoted values.'
    },
    {
        id: 'fatal-missing-brace',
        name: 'Fatal Missing Brace',
        input: '{\n  "key": "value"',
        expectedStatus: 'invalid',
        description: 'Should fail gracefully as it is structurally incomplete.'
    }
];
