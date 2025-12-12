import { CSharpConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generateCSharpCode(jsonString: string, config: CSharpConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "csharp",
        "Root",
        {
            "csharp-namespace": config.namespace,
            ...(config.framework !== "none" && {
                "framework": config.framework === "SystemTextJson"
                    ? "system-text-json"
                    : "json-net"
            }),
            "csharp-use-properties": config.useProperties,
            "csharp-number-type": config.numberType,
            "csharp-array-type": config.arrayType === "list" ? " list" : "array",
            "density": config.density,
            "csharp-acronym-style": config.acronymStyle,
        }
    );
}
