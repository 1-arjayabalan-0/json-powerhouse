"use client"

import { PrismaSchemaConfig } from "@/core/types/schema-generator-config";
import { NestedStrategy } from "@/core/lib/schema/relational";
import { PrismaProvider } from "@/core/lib/schema/prisma";
import { SelectField, SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function PrismaSchemaSettings({ config, update }: SettingsProps<PrismaSchemaConfig>) {
    return (
        <>
            <SettingsSection title="Model">
                <TextField id="prisma-model" label="Root model name" value={config.modelName} placeholder="Item" onChange={(v) => update('modelName', v)} />
                <SelectField id="prisma-provider" label="Database" value={config.provider}
                    options={[
                        { value: 'postgresql', label: 'PostgreSQL' },
                        { value: 'mysql', label: 'MySQL' },
                        { value: 'sqlite', label: 'SQLite' },
                    ]}
                    onChange={(v) => update('provider', v as PrismaProvider)}
                    hint="Controls native types (@db.*), scalar lists and Json support." />
                <SelectField id="prisma-nested" label="Nested objects & arrays" value={config.nested}
                    options={[
                        { value: 'tables', label: 'Related models' },
                        { value: 'json', label: 'Json fields' },
                    ]}
                    onChange={(v) => update('nested', v as NestedStrategy)} />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="prisma-map" label="snake_case @map / @@map" checked={config.mapNames} onChange={(v) => update('mapNames', v)}
                    hint="Keeps camelCase fields in code and snake_case names in the database." />
                <SwitchField id="prisma-header" label="generator & datasource blocks" checked={config.includeHeader} onChange={(v) => update('includeHeader', v)} />
            </SettingsSection>
        </>
    );
}
