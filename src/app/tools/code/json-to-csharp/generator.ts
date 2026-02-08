import { CSharpConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateCSharpCode(jsonString: string, config: CSharpConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "csharp",
        "Root",
        {
            "namespace": config.namespace,
            "framework": config.framework,
            "use-properties": config.useProperties ? "true" : "false",
            "number-type": config.numberType,
            "array-type": config.arrayType,
            "density": config.density,
            "acronym-style": config.acronymStyle,
        }
    );
}
