"use client"

import { useState } from "react";
import { toolMetadata } from "@/app/config/tool-presets";
import JsonTreeViewer from "./components/JsonTreeViewer";

export default function JsonViewerPage() {
    const metadata = toolMetadata['json-viewer'];

    return (
        <JsonTreeViewer />
    );
}
