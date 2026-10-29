"use client"

import { PHPConfig } from "@/core/types/code-generator-config";
import { SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function PhpSettings({ config, update }: SettingsProps<PHPConfig>) {
    return (
        <>
            <SettingsSection title="Namespace">
                <TextField id="php-ns" label="Namespace" value={config.namespace} onChange={(v) => update('namespace', v)} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="php-strict" label="Strict types" checked={config.strictTypes} onChange={(v) => update('strictTypes', v)} />
                <SwitchField id="php-getters" label="Getters / setters" checked={config.useGettersSetters} onChange={(v) => update('useGettersSetters', v)} />
            </SettingsSection>
        </>
    );
}
