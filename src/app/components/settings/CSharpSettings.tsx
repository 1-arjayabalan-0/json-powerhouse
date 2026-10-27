"use client"

import { CSharpConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function CSharpSettings({ config, update }: SettingsProps<CSharpConfig>) {
    return (
        <>
            <SettingsSection title="Types">
                <SelectField id="cs-kind" label="Output type" value={config.recordType}
                    onChange={(v) => update('recordType', v as CSharpConfig['recordType'])}
                    options={[{ value: 'record', label: 'Records' }, { value: 'class', label: 'Classes' }, { value: 'struct', label: 'Structs' }]} />
                <SelectField id="cs-access" label="Access level" value={config.accessLevel}
                    onChange={(v) => update('accessLevel', v as CSharpConfig['accessLevel'])}
                    options={[{ value: 'public', label: 'public' }, { value: 'internal', label: 'internal' }]} />
                <SwitchField id="cs-nullable" label="Nullable reference types" checked={config.nullable} onChange={(v) => update('nullable', v)} />
            </SettingsSection>
            <SettingsSection title="Serializer">
                <SwitchField id="cs-stj" label="System.Text.Json attributes" checked={config.systemTextJson}
                    onChange={(v) => update('systemTextJson', v)} hint="Off = Newtonsoft.Json attributes." />
            </SettingsSection>
        </>
    );
}
