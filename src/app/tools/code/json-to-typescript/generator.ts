import { TypeScriptConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateTypeScriptCode(
    jsonString: string,
    config: TypeScriptConfig
): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "typescript",
        "Root",
        {
            "just-types": config.typeKind === "type" ? "true" : "false",
            "runtime-typecheck": config.runtimeTypecheck,
            "readonly": config.readonlyProperties ? "true" : "false",
            "explicit-any": config.explicitAny ? "true" : "false",
            "nice-property-names": config.nicePropertyNames ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
