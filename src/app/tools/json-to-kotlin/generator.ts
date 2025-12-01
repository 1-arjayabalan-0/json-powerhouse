import { KotlinConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateKotlinCode(
    jsonString: string,
    config: KotlinConfig
): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "kotlin",
        "Root",
        {
            "package": config.packageName,
            "framework": config.framework,
            "use-data-classes": config.useDataClasses ? "true" : "false",
            "use-arrays": config.useArrays ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
