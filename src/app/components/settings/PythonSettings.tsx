"use client"

import { PythonConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function PythonSettings({ config, update }: SettingsProps<PythonConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="py-ver" label="Python version" value={config.pythonVersion}
                onChange={(v) => update('pythonVersion', v as PythonConfig['pythonVersion'])}
                options={[{ value: '3.10+', label: '3.10+' }, { value: '3.9', label: '3.9' }, { value: '3.8', label: '3.8' }]} />
            <SelectField id="py-class" label="Class type" value={config.classType}
                onChange={(v) => update('classType', v as PythonConfig['classType'])}
                options={[{ value: 'dataclasses', label: 'Dataclasses' }, { value: 'attrs', label: 'Attrs' }, { value: 'plain', label: 'Plain class' }]} />
            <SwitchField id="py-hints" label="Type hints" checked={config.useTypeHints} onChange={(v) => update('useTypeHints', v)} />
        </SettingsSection>
    );
}
