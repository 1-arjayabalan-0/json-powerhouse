"use client"

import { SqlSchemaConfig } from "@/core/types/schema-generator-config";
import { NestedStrategy } from "@/core/lib/schema/relational";
import { SelectField, SettingsProps, SettingsSection, SwitchField, TextField } from "./fields";

export default function SqlSchemaSettings({ config, update }: SettingsProps<SqlSchemaConfig>) {
    return (
        <>
            <SettingsSection title="Table">
                <TextField id="sql-table" label="Root table name" value={config.tableName} placeholder="items" onChange={(v) => update('tableName', v)} />
                <SelectField id="sql-nested" label="Nested objects & arrays" value={config.nested}
                    options={[
                        { value: 'tables', label: 'Child tables with foreign keys' },
                        { value: 'json', label: 'JSON columns' },
                    ]}
                    onChange={(v) => update('nested', v as NestedStrategy)}
                    hint="Arrays of plain values become array columns in PostgreSQL and JSON elsewhere." />
            </SettingsSection>
            <SettingsSection title="Output">
                <SwitchField id="sql-inserts" label="INSERT statements" checked={config.includeInserts} onChange={(v) => update('includeInserts', v)}
                    hint="Adds the JSON data as rows, with generated ids linking child tables." />
                <SwitchField id="sql-ifnot" label="IF NOT EXISTS" checked={config.ifNotExists} onChange={(v) => update('ifNotExists', v)} />
            </SettingsSection>
        </>
    );
}
