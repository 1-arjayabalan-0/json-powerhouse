import { JavaConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateJavaCode(
    jsonString: string,
    config: JavaConfig
): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "java",
        "Root",
        {
            "package": config.packageName,
            "use-getters-setters": config.useGettersSetters ? "true" : "false",
            "use-optional": config.useOptional ? "true" : "false",
            "use-big-decimal": config.useBigDecimal ? "true" : "false",
            "array-type": config.arrayType,
            "acronym-style": config.acronymStyle,
        }
    );
}
