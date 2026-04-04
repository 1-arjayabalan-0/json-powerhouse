export const VALID_JSON_SAMPLES = {
  simple: '{"name":"John","age":30}',
  nested: '{"user":{"name":"John","email":"john@example.com"}}',
  array: '{"items":["a","b","c"]}',
  complex: '{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}',
  withNulls: '{"a":null,"b":true,"c":false,"d":123,"e":"text"}',
  unicode: '{"name":"你好世界","emoji":"🎉"}',
  empty: '{}',
  emptyArray: '[]',
  number: '42',
  string: '"hello"',
  booleanTrue: 'true',
  booleanFalse: 'false',
  nullValue: 'null',
};

export const INVALID_JSON_SAMPLES = {
  trailingComma: '{"a":1,"b":2,}',
  missingQuote: '{"name":}',
  unclosedObject: '{"name":',
  unclosedArray: '[1,2,3',
  extraComma: '[1,2,3,]',
  brokenEscape: '{"text":"test\\"}',
  invalidNumber: '{"num":1..2}',
  singleQuotes: "{'name': 'John'}",
  comments: '{"a":1} // comment',
  trailingWhitespace: '{"a":1}   ',
};

export const EDGE_CASES = {
  maxSafeInteger: Number.MAX_SAFE_INTEGER.toString(),
  minSafeInteger: Number.MIN_SAFE_INTEGER.toString(),
  maxValue: '1.7976931348623157e+308',
  emptyString: '""',
  whitespaceOnly: '   ',
  deepNesting: JSON.stringify({ a: { b: { c: { d: { e: {} } } } } }),
  longString: '"' + 'a'.repeat(10000) + '"',
  manyProperties: JSON.stringify(
    Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]))
  ),
  largeArray: JSON.stringify(Array.from({ length: 1000 }, (_, i) => i)),
};

export const EXPECTED_FORMATTED_OUTPUT = {
  simple: `{
  "name": "John",
  "age": 30
}`,
  nested: `{
  "user": {
    "name": "John",
    "email": "john@example.com"
  }
}`,
  array: `[
  "a",
  "b",
  "c"
]`,
  compact: '{"name":"John","age":30}',
};

export const EXPECTED_MINIFIED_OUTPUT = {
  simple: '{"name":"John","age":30}',
  nested: '{"user":{"name":"John","email":"john@example.com"}}',
  array: '["a","b","c"]',
  complex: '{"users":[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]}',
};

export const PHP_UNION_TYPE_JSON = [
  { type: 'a', value: 'test' },
  { type: 'b', value: 123 },
];

export const JSON_SAMPLES_FOR_CONVERTERS = {
  user: JSON.stringify({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    roles: ['admin', 'user'],
    profile: {
      avatar: 'https://example.com/avatar.png',
      bio: 'Software developer'
    },
    metadata: {
      tags: ['developer', 'fullstack'],
      stats: {
        posts: 42,
        followers: 100
      }
    }
  }),
  product: JSON.stringify({
    id: 'prod_123',
    name: 'Product Name',
    price: 99.99,
    inStock: true,
    variants: [
      { color: 'red', size: 'M' },
      { color: 'blue', size: 'L' }
    ],
    categories: ['electronics', 'gadgets']
  }),
  settings: JSON.stringify({
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    preferences: {
      privacy: 'public',
      timezone: 'UTC'
    }
  }),
  empty: '{}',
  minimal: '{"id":1}',
  withNull: '{"value":null}',
  withFalse: '{"active":false}',
};

export const CONFIG_OPTIONS = {
  php: {
    namespace: 'App\\Models',
    strictTypes: true,
    useGettersSetters: true,
    fastMode: false,
    acronymStyle: 'pascal' as const,
  },
  typescript: {
    typeKind: 'interface' as const,
    runtimeTypecheck: false,
    readonlyProperties: true,
    explicitAny: false,
    nicePropertyNames: true,
    acronymStyle: 'pascal' as const,
  },
  python: {
    pythonVersion: '3.9' as const,
    pydantic: false,
    dataclass: true,
    acronymStyle: 'pascal' as const,
  },
  java: {
    javaVersion: '17' as const,
    jackson: true,
    equalsBuilder: true,
    hashCodeBuilder: true,
    builder: true,
    acronymStyle: 'pascal' as const,
  },
  csharp: {
    namespace: 'App.Models',
    newtonsoftJson: false,
    systemTextJson: true,
    initializer: true,
    acronymStyle: 'pascal' as const,
  },
  go: {
    packageName: 'models',
    jsonTags: true,
    jsonOmitempty: false,
    anyType: 'interface{}' as const,
    acronymStyle: 'pascal' as const,
  },
  rust: {
    serde: true,
    serialization: 'json' as const,
    visibility: 'pub' as const,
    acronymStyle: 'pascal' as const,
  },
  kotlin: {
    kotlinVersion: '1.9' as const,
    serialization: true,
    jackson: false,
    acronymStyle: 'pascal' as const,
  },
  swift: {
    swiftVersion: '5.9' as const,
    codable: true,
    struct: true,
    acronymStyle: 'pascal' as const,
  },
  dart: {
    dartVersion: '3.0' as const,
    jsonSerializable: true,
    freezed: false,
    acronymStyle: 'pascal' as const,
  },
};

export const LARGE_JSON_SIZES = {
  small: 1000,
  medium: 10000,
  large: 100000,
};

export function generateLargeJSON(size: number): string {
  const data = {
    items: Array.from({ length: size }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `Description for item ${i}`,
      tags: ['tag1', 'tag2', 'tag3'],
      metadata: {
        created: new Date().toISOString(),
        count: i * 2,
      }
    }))
  };
  return JSON.stringify(data);
}