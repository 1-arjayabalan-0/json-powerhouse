import { GoConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generateGoCode(jsonString: string, config: GoConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "go",
        "Root",
        {
            "package": config.packageName,
            "omit-empty": config.useOmitEmpty ? "true" : "false",
            "field-tags": config.fieldNaming,
        }
    );
}
