"use client"

import { RustConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function RustSettings({ config, update }: SettingsProps<RustConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="rs-vis" label="Visibility" value={config.visibility}
                onChange={(v) => update('visibility', v as RustConfig['visibility'])}
                options={[{ value: 'public', label: 'pub' }, { value: 'crate', label: 'pub(crate)' }, { value: 'private', label: 'private' }]} />
            <SwitchField id="rs-debug" label="Derive Debug" checked={config.deriveDebug} onChange={(v) => update('deriveDebug', v)} />
            <SwitchField id="rs-clone" label="Derive Clone" checked={config.deriveClone} onChange={(v) => update('deriveClone', v)} />
        </SettingsSection>
    );
}
