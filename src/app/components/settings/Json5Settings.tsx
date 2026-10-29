"use client"

import { JSON5ConverterConfig } from "@/core/types/json5-converter-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function Json5Settings({ config, update }: SettingsProps<JSON5ConverterConfig>) {
    return (
        <>
            <SettingsSection title="Layout">
                <SelectField id="j5-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as JSON5ConverterConfig['indentation'])}
                    options={[{ value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tabs' }]} />
                <SelectField id="j5-case" label="Key case" value={config.keyCase}
                    onChange={(v) => update('keyCase', v as JSON5ConverterConfig['keyCase'])}
                    options={[
                        { value: 'none', label: 'Original' }, { value: 'camelCase', label: 'camelCase' },
                        { value: 'PascalCase', label: 'PascalCase' }, { value: 'snake_case', label: 'snake_case' },
                        { value: 'kebab-case', label: 'kebab-case' },
                    ]} />
            </SettingsSection>
            <SettingsSection title="JSON5 syntax">
                <SelectField id="j5-quotes" label="Quotes" value={config.quoteStyle} disabled
                    onChange={(v) => update('quoteStyle', v as JSON5ConverterConfig['quoteStyle'])}
                    options={[{ value: 'single', label: "Single (')" }, { value: 'double', label: 'Double (")' }]} />
                <SwitchField id="j5-comments" label="Strip comments" checked={config.stripComments}
                    onChange={(v) => update('stripComments', v)} />
                <SwitchField id="j5-trailing" label="Trailing commas" checked={config.trailingCommas} disabled
                    onChange={(v) => update('trailingCommas', v)} />
                <SwitchField id="j5-unquoted" label="Unquoted keys" checked={config.unquotedKeys} disabled
                    onChange={(v) => update('unquotedKeys', v)} />
            </SettingsSection>
        </>
    );
}
