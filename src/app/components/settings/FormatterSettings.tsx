"use client"

import { JSONFormatterConfig, IndentationType, KeySorting, KeyCase, QuoteStyle } from "@/core/types/json-formatter-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function FormatterSettings({ config, update }: SettingsProps<JSONFormatterConfig>) {
    return (
        <>
            <SettingsSection title="Layout">
                <SelectField id="fmt-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as IndentationType)}
                    options={[
                        { value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' },
                        { value: 'tab', label: 'Tabs' }, { value: '0', label: 'Minify (no spaces)' },
                    ]} />
                <SelectField id="fmt-sort" label="Sort keys" value={config.keySorting}
                    onChange={(v) => update('keySorting', v as KeySorting)}
                    options={[
                        { value: 'none', label: 'None' }, { value: 'asc', label: 'Ascending (A–Z)' },
                        { value: 'desc', label: 'Descending (Z–A)' },
                    ]} />
            </SettingsSection>
            <SettingsSection title="Keys & quotes">
                <SelectField id="fmt-case" label="Key case" value={config.keyCase}
                    onChange={(v) => update('keyCase', v as KeyCase)}
                    options={[
                        { value: 'none', label: 'Original' }, { value: 'camelCase', label: 'camelCase' },
                        { value: 'PascalCase', label: 'PascalCase' }, { value: 'snake_case', label: 'snake_case' },
                        { value: 'kebab-case', label: 'kebab-case' },
                    ]} />
                <SelectField id="fmt-quote" label="Quote style" value={config.quoteStyle}
                    onChange={(v) => update('quoteStyle', v as QuoteStyle)}
                    options={[{ value: 'double', label: 'Double (")' }, { value: 'single', label: "Single (')" }]} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="fmt-comments" label="Strip comments" checked={config.stripComments}
                    onChange={(v) => update('stripComments', v)} disabled hint="Comment handling follows the input format." />
                <SwitchField id="fmt-nulls" label="Remove null values" checked={config.removeNull}
                    onChange={(v) => update('removeNull', v)} />
                <SwitchField id="fmt-trailing" label="Trailing commas" checked={config.trailingCommas}
                    onChange={(v) => update('trailingCommas', v)} />
            </SettingsSection>
        </>
    );
}
