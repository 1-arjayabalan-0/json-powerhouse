"use client"

import { CSharpConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField } from "./fields";

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
            </SettingsSection>
            <SettingsSection title="Serializer">
                <SelectField id="cs-framework" label="Framework" value={config.framework}
                    onChange={(v) => update('framework', v as CSharpConfig['framework'])}
                    options={[{ value: 'SystemTextJson', label: 'System.Text.Json' }, { value: 'NewtonsoftJson', label: 'Newtonsoft.Json' }, { value: 'none', label: 'None (plain types)' }]} />
            </SettingsSection>
        </>
    );
}
