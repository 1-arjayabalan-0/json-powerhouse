import { DartConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateDartCode(jsonString: string, config: DartConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "dart",
        "Root",
        {
            "use-freezed": config.useFreezed ? "true" : "false",
            "use-json-annotation": config.useJsonSerializable ? "true" : "false",
            "null-safety": config.nullSafety ? "true" : "false",
            "use-num": config.useNum ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
