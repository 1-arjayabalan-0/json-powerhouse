import type { ComponentType } from "react";
import type { ToolId } from "@/app/config/tool-registry";
import type { SettingsProps } from "./fields";
import FormatterSettings from "./FormatterSettings";
import Json5Settings from "./Json5Settings";
import ViewerSettings from "./ViewerSettings";
import TextViewerSettings from "./TextViewerSettings";
import TypeScriptSettings from "./TypeScriptSettings";
import JavaSettings from "./JavaSettings";
import KotlinSettings from "./KotlinSettings";
import DartSettings from "./DartSettings";
import SwiftSettings from "./SwiftSettings";
import GoSettings from "./GoSettings";
import CSharpSettings from "./CSharpSettings";
import PythonSettings from "./PythonSettings";
import RustSettings from "./RustSettings";
import PhpSettings from "./PhpSettings";

// Diff and Transform currently expose no user settings.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const settingsByTool: Partial<Record<ToolId, ComponentType<SettingsProps<any>>>> = {
    'json-formatter': FormatterSettings,
    'json-minifier': FormatterSettings,
    'json-validator': FormatterSettings,
    'json-normalize': FormatterSettings,
    'json-json5': Json5Settings,
    'json-viewer': ViewerSettings,
    'json-text-viewer': TextViewerSettings,
    'json-to-typescript': TypeScriptSettings,
    'json-to-java': JavaSettings,
    'json-to-kotlin': KotlinSettings,
    'json-to-dart': DartSettings,
    'json-to-swift': SwiftSettings,
    'json-to-go': GoSettings,
    'json-to-csharp': CSharpSettings,
    'json-to-python': PythonSettings,
    'json-to-rust': RustSettings,
    'json-to-php': PhpSettings,
};
