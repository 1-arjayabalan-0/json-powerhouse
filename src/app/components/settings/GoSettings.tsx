"use client"

import { GoConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function GoSettings({ config, update }: SettingsProps<GoConfig>) {
    return (
        <>
            <SettingsSection title="Package">
                <TextField id="go-pkg" label="Package name" value={config.packageName} onChange={(v) => update('packageName', v)} />
            </SettingsSection>
            <SettingsSection title="Tags">
                <SwitchField id="go-omit" label="omitempty" checked={config.useOmitEmpty} onChange={(v) => update('useOmitEmpty', v)}
                    hint="Optional fields always get omitempty; this extends it to optional null and any fields." />
            </SettingsSection>
        </>
    );
}
