"use client"

import { JsonTreeViewerConfig, IndentationType } from "@/core/types/json-viewer-config";
import { SettingsProps, SettingsSection, SelectField, SwitchField, NumberField } from "./fields";

export default function ViewerSettings({ config, update }: SettingsProps<JsonTreeViewerConfig>) {
    return (
        <>
            <SettingsSection title="Tree">
                <SelectField id="tv-indent" label="Indentation" value={config.indentation}
                    onChange={(v) => update('indentation', v as IndentationType)}
                    options={[{ value: '2', label: '2 spaces' }, { value: '4', label: '4 spaces' }, { value: 'tab', label: 'Tab' }]} />
                <NumberField id="tv-depth" label="Auto-expand depth" value={config.autoExpandDepth} min={0} max={100}
                    onChange={(v) => update('autoExpandDepth', v)} />
            </SettingsSection>
            <SettingsSection title="Display">
                <SwitchField id="tv-types" label="Show data types" checked={config.showDataTypes} onChange={(v) => update('showDataTypes', v)} />
                <SwitchField id="tv-counts" label="Show item counts" checked={config.showItemCounts} onChange={(v) => update('showItemCounts', v)} />
                <SwitchField id="tv-brackets" label="Show brackets" checked={config.showBrackets} onChange={(v) => update('showBrackets', v)} />
                <SwitchField id="tv-commas" label="Show commas" checked={config.showCommas} onChange={(v) => update('showCommas', v)} />
            </SettingsSection>
        </>
    );
}
