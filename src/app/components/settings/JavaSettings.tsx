"use client"

import { JavaConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, TextField } from "./fields";

export default function JavaSettings({ config, update }: SettingsProps<JavaConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="java-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Types">
                <SelectField id="java-array" label="Array type" value={config.arrayType}
                    onChange={(v) => update('arrayType', v as JavaConfig['arrayType'])}
                    options={[{ value: 'list', label: 'List<T>' }, { value: 'array', label: 'Array []' }]} />
                <SwitchField id="java-getters" label="Getters & setters" checked={config.useGettersSetters} onChange={(v) => update('useGettersSetters', v)} />
                <SwitchField id="java-bigdec" label="Use BigDecimal" checked={config.useBigDecimal} onChange={(v) => update('useBigDecimal', v)} />
            </SettingsSection>
        </>
    );
}
