"use client"

import { TypeScriptConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField } from "./fields";

export default function TypeScriptSettings({ config, update }: SettingsProps<TypeScriptConfig>) {
    return (
        <SettingsSection title="Output">
            {/* typeKind maps to quicktype's "just-types": 'type' = interfaces only, 'interface' = with Convert helpers. */}
            <SelectField id="ts-kind" label="Output" value={config.typeKind}
                onChange={(v) => update('typeKind', v as TypeScriptConfig['typeKind'])}
                options={[{ value: 'type', label: 'Interfaces only' }, { value: 'interface', label: 'Interfaces + Convert helpers' }]}
                hint="Convert helpers parse JSON and check it against the interfaces at runtime (about 180 extra lines)." />
            <SelectField id="ts-runtime" label="Runtime check" value={config.runtimeTypecheck}
                onChange={(v) => update('runtimeTypecheck', v as TypeScriptConfig['runtimeTypecheck'])}
                options={[{ value: 'none', label: 'None' }, { value: 'zod', label: 'Zod schema' }]} />
        </SettingsSection>
    );
}
