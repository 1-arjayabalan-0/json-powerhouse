"use client"

import { DartConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField } from "./fields";

export default function DartSettings({ config, update }: SettingsProps<DartConfig>) {
    return (
        <SettingsSection title="Output">
            <SwitchField id="dart-null" label="Null safety" checked={config.nullSafety} onChange={(v) => update('nullSafety', v)} />
            <SwitchField id="dart-freezed" label="Use Freezed" checked={config.useFreezed} onChange={(v) => update('useFreezed', v)} />
            <SwitchField id="dart-serial" label="JSON Serializable" checked={config.useJsonSerializable} onChange={(v) => update('useJsonSerializable', v)} />
        </SettingsSection>
    );
}
