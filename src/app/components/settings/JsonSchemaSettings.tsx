"use client"

import { JsonSchemaConfig } from "@/core/types/schema-generator-config";
import { JsonSchemaDraft, RequiredMode } from "@/core/lib/schema/json-schema";
import { SelectField, SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function JsonSchemaSettings({ config, update }: SettingsProps<JsonSchemaConfig>) {
    return (
        <>
            <SettingsSection title="Schema">
                <SelectField id="js-draft" label="Draft" value={config.draft}
                    options={[
                        { value: '2020-12', label: '2020-12 (latest)' },
                        { value: '07', label: 'Draft-07' },
                    ]}
                    onChange={(v) => update('draft', v as JsonSchemaDraft)} />
                <TextField id="js-title" label="Title" value={config.title} placeholder="Optional" onChange={(v) => update('title', v)} />
            </SettingsSection>
            <SettingsSection title="Rules">
                <SelectField id="js-required" label="Required properties" value={config.required}
                    options={[
                        { value: 'present', label: 'Keys present in every sample' },
                        { value: 'none', label: 'None' },
                    ]}
                    onChange={(v) => update('required', v as RequiredMode)} />
                <SwitchField id="js-additional" label="Allow additional properties" checked={config.additionalProperties} onChange={(v) => update('additionalProperties', v)}
                    hint="Turn off to add additionalProperties: false to every object." />
                <SwitchField id="js-formats" label="Detect string formats" checked={config.detectFormats} onChange={(v) => update('detectFormats', v)}
                    hint="date-time, date, email, uuid and uri." />
                <SwitchField id="js-merge" label="Merge top-level array items" checked={config.mergeRootArray} onChange={(v) => update('mergeRootArray', v)}
                    hint="Treat a top-level array as samples of one object instead of an array schema." />
            </SettingsSection>
        </>
    );
}
