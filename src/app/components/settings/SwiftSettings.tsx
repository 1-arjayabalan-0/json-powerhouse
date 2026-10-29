"use client"

import { SwiftConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField } from "./fields";

export default function SwiftSettings({ config, update }: SettingsProps<SwiftConfig>) {
    return (
        <SettingsSection title="Output">
            <SelectField id="swift-kind" label="Type kind" value={config.typeKind}
                onChange={(v) => update('typeKind', v as SwiftConfig['typeKind'])}
                options={[{ value: 'struct', label: 'Struct' }, { value: 'class', label: 'Class' }]} />
            <SelectField id="swift-access" label="Access level" value={config.accessLevel}
                onChange={(v) => update('accessLevel', v as SwiftConfig['accessLevel'])}
                options={[{ value: 'public', label: 'Public' }, { value: 'internal', label: 'Internal' }]} />
            <SwitchField id="swift-codable" label="Codable protocol" checked={config.useCodable} onChange={(v) => update('useCodable', v)} />
        </SettingsSection>
    );
}
