"use client"

import { TypeScriptConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField } from "./fields";

export default function TypeScriptSettings({ config, update }: SettingsProps<TypeScriptConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="ts-kind" label="Type kind" value={config.typeKind}
                onChange={(v) => update('typeKind', v as TypeScriptConfig['typeKind'])}
                options={[{ value: 'interface', label: 'Interface' }, { value: 'type', label: 'Type alias' }]} />
            <SelectField id="ts-runtime" label="Runtime check" value={config.runtimeTypecheck}
                onChange={(v) => update('runtimeTypecheck', v as TypeScriptConfig['runtimeTypecheck'])}
                options={[{ value: 'none', label: 'None' }, { value: 'zod', label: 'Zod schema' }]} />
        </SettingsSection>
    );
}
