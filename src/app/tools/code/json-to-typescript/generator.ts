import { TypeScriptConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

function getTargetLanguage(config: TypeScriptConfig): string {
    if (config.runtimeTypecheck === "zod") return "typescript-zod";
    return "typescript";
}

export async function generateTypeScriptCode(
    jsonString: string,
    config: TypeScriptConfig
): Promise<string> {
    const targetLanguage = getTargetLanguage(config);
    return await generateCodeFromJSON(
        jsonString,
        targetLanguage,
        "Root",
        {
            "just-types": config.typeKind === "type" ? "true" : "false",
            "readonly": config.readonlyProperties ? "true" : "false",
            "explicit-any": config.explicitAny ? "true" : "false",
            "nice-property-names": config.nicePropertyNames ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
