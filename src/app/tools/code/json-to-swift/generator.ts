import { SwiftConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateSwiftCode(jsonString: string, config: SwiftConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "swift",
        "Root",
        {
            "struct-or-class": config.typeKind,
            "use-codable": config.useCodable ? "true" : "false",
            "access-level": config.accessLevel,
            "use-classes-for-mutable": config.useClassesForMutable ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
