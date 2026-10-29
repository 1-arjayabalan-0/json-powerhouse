"use client"

import { TextViewerConfig } from "@/core/types/text-viewer-config";
import { SettingsProps, SettingsSection, SwitchField, NumberField } from "./fields";

export default function TextViewerSettings({ config, update }: SettingsProps<TextViewerConfig>) {
    return (
        <>
            <SettingsSection title="Detection">
                <NumberField id="txt-threshold" label="Text length threshold" value={config.textThreshold} min={1} max={10000}
                    onChange={(v) => update('textThreshold', v)} />
            </SettingsSection>
            <SettingsSection title="Display">
                <SwitchField id="txt-md" label="Markdown document view" checked={config.markdownMode} onChange={(v) => update('markdownMode', v)} />
                <SwitchField id="txt-collapse" label="Collapse long cells" checked={config.collapsedMaxHeight} onChange={(v) => update('collapsedMaxHeight', v)} />
            </SettingsSection>
        </>
    );
}
