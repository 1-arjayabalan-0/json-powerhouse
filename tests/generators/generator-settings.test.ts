import { generateCSharpCode } from '@/core/generators/json-to-csharp';
import { generatePythonCode } from '@/core/generators/json-to-python';
import { generatePHPCode } from '@/core/generators/json-to-php';
import { generateGoCode } from '@/core/generators/json-to-go';
import { defaultCSharpConfig, defaultPythonConfig, defaultPHPConfig, defaultGoConfig } from '@/core/types/code-generator-config';

const sample = JSON.stringify({ id: 1, userName: 'a', tags: ['x'], address: { city: 'c' } });

describe('C# generator settings', () => {
  it('defaults to System.Text.Json attributes, the configured namespace and List<T>', async () => {
    const result = await generateCSharpCode(sample, defaultCSharpConfig);
    expect(result).toContain('[JsonPropertyName("id")]');
    expect(result).not.toContain('Newtonsoft');
    expect(result).toContain('namespace MyNamespace');
    expect(result).toContain('List<string> Tags');
  });

  it('framework NewtonsoftJson emits Newtonsoft attributes', async () => {
    const result = await generateCSharpCode(sample, { ...defaultCSharpConfig, framework: 'NewtonsoftJson' });
    expect(result).toContain('using Newtonsoft.Json;');
    expect(result).toContain('[JsonProperty("id")]');
  });

  it('framework none emits plain types without attributes or helpers', async () => {
    const result = await generateCSharpCode(sample, { ...defaultCSharpConfig, framework: 'none' });
    expect(result).not.toMatch(/JsonProperty/);
    expect(result).not.toContain('FromJson');
    expect(result).toContain('public partial class Root');
  });

  it('recordType switches class to record or struct', async () => {
    const asClass = await generateCSharpCode(sample, defaultCSharpConfig);
    const asRecord = await generateCSharpCode(sample, { ...defaultCSharpConfig, recordType: 'record' });
    const asStruct = await generateCSharpCode(sample, { ...defaultCSharpConfig, recordType: 'struct' });
    expect(asClass).toContain('public partial class Root');
    expect(asRecord).toContain('public partial record Root');
    expect(asRecord).toContain('public partial record Address');
    expect(asRecord).not.toContain('partial class');
    expect(asStruct).toContain('public partial struct Root');
    expect(asStruct).not.toContain('partial class');
  });

  it('accessLevel internal makes the generated types internal', async () => {
    const result = await generateCSharpCode(sample, { ...defaultCSharpConfig, accessLevel: 'internal', recordType: 'record' });
    expect(result).toContain('internal partial record Root');
    expect(result).toContain('internal partial record Address');
    expect(result).toContain('internal static class Serialize');
    expect(result).not.toMatch(/public partial (class|record|struct)/);
  });

  it('numberType decimal and arrayType array reach quicktype', async () => {
    const result = await generateCSharpCode(JSON.stringify({ price: 1.5, tags: ['x'] }), { ...defaultCSharpConfig, numberType: 'decimal', arrayType: 'array' });
    expect(result).toContain('decimal Price');
    expect(result).toContain('string[] Tags');
  });
});

describe('Python generator settings', () => {
  it('dataclasses emits @dataclass', async () => {
    const result = await generatePythonCode(sample, defaultPythonConfig);
    expect(result).toContain('@dataclass');
    expect(result).not.toContain('BaseModel');
  });

  it('pydantic emits BaseModel subclasses', async () => {
    const result = await generatePythonCode(sample, { ...defaultPythonConfig, classType: 'pydantic' });
    expect(result).toContain('from pydantic import BaseModel');
    expect(result).toContain('class Root(BaseModel)');
    expect(result).not.toContain('@dataclass');
  });

  it('plain classes with and without type hints', async () => {
    const hinted = await generatePythonCode(sample, { ...defaultPythonConfig, classType: 'plain', useTypeHints: true });
    const unhinted = await generatePythonCode(sample, { ...defaultPythonConfig, classType: 'plain', useTypeHints: false });
    expect(hinted).not.toContain('@dataclass');
    expect(hinted).toContain('id: int');
    expect(unhinted).not.toContain('@dataclass');
    expect(unhinted).not.toContain('id: int');
  });

  it('nicePropertyNames toggles snake_case', async () => {
    const nice = await generatePythonCode(sample, defaultPythonConfig);
    const raw = await generatePythonCode(sample, { ...defaultPythonConfig, nicePropertyNames: false });
    expect(nice).toContain('user_name');
    expect(raw).toContain('userName:');
  });
});

describe('PHP generator settings', () => {
  it('adds strict_types and namespace by default', async () => {
    const result = await generatePHPCode(sample, defaultPHPConfig);
    expect(result).toMatch(/^<\?php\n\ndeclare\(strict_types=1\);\n\nnamespace App;\n/);
  });

  it('namespace is configurable and omitted when empty', async () => {
    const custom = await generatePHPCode(sample, { ...defaultPHPConfig, namespace: '\\App\\Models\\' });
    const none = await generatePHPCode(sample, { ...defaultPHPConfig, namespace: '' });
    expect(custom).toContain('namespace App\\Models;');
    expect(none).not.toContain('namespace');
  });

  it('strictTypes false omits declare(strict_types)', async () => {
    const result = await generatePHPCode(sample, { ...defaultPHPConfig, strictTypes: false });
    expect(result).not.toContain('strict_types');
    expect(result).toContain('namespace App;');
  });
});

describe('Go generator settings', () => {
  it('default config emits json struct tags', async () => {
    const result = await generateGoCode(sample, defaultGoConfig);
    expect(result).toContain('`json:"id"`');
    expect(result).not.toContain('pascal:');
  });

  // quicktype always tags optional scalar fields; the option extends omitempty to optional null/any/union fields.
  it('useOmitEmpty adds omitempty to optional null fields', async () => {
    const json = JSON.stringify([{ id: 1, nick: null }, { id: 2 }]);
    const withOmit = await generateGoCode(json, defaultGoConfig);
    const withoutOmit = await generateGoCode(json, { ...defaultGoConfig, useOmitEmpty: false });
    expect(withOmit).toContain('json:"nick,omitempty"');
    expect(withoutOmit).not.toContain('omitempty');
  });
});
