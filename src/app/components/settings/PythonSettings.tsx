"use client"

import { PythonConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function PythonSettings({ config, update }: SettingsProps<PythonConfig>) {
    const plain = config.classType === 'plain';
    return (
        <SettingsSection title="Output">
            <SelectField id="py-class" label="Class type" value={config.classType}
                onChange={(v) => update('classType', v as PythonConfig['classType'])}
                options={[{ value: 'dataclasses', label: 'Dataclasses' }, { value: 'pydantic', label: 'Pydantic models' }, { value: 'plain', label: 'Plain class' }]} />
            <SwitchField id="py-hints" label="Type hints" checked={plain ? config.useTypeHints : true} disabled={!plain}
                onChange={(v) => update('useTypeHints', v)} hint={plain ? undefined : 'Always on for dataclasses and pydantic.'} />
            <SwitchField id="py-nice" label="Pythonic property names" checked={config.nicePropertyNames} onChange={(v) => update('nicePropertyNames', v)} />
        </SettingsSection>
    );
}
