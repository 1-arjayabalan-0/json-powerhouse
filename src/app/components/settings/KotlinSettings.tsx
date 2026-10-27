"use client"

import { KotlinConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, TextField } from "./fields";

export default function KotlinSettings({ config, update }: SettingsProps<KotlinConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="kt-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SelectField id="kt-fw" label="Framework" value={config.framework}
                    onChange={(v) => update('framework', v as KotlinConfig['framework'])}
                    options={[{ value: 'none', label: 'None' }, { value: 'kotlinx', label: 'Kotlinx Serialization' }, { value: 'jackson', label: 'Jackson' }]} />
                <SwitchField id="kt-data" label="Data classes" checked={config.useDataClasses} onChange={(v) => update('useDataClasses', v)} />
            </SettingsSection>
        </>
    );
}
