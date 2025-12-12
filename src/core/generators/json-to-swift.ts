import { SwiftConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generateSwiftCode(jsonString: string, config: SwiftConfig): Promise<string> {
    let accessLevel = config.accessLevel;
    let postProcessOpen = false;

    // Quicktype doesn't support "open", so we generate as "public" and replace later
    if (accessLevel === "open") {
        accessLevel = "public";
        // Only classes can be open
        if (config.typeKind === "class") {
            postProcessOpen = true;
        }
    }

    const code = await generateCodeFromJSON(
        jsonString,
        "swift",
        "Root",
        {
            "struct-or-class": config.typeKind,
            "use-codable": config.useCodable ? "true" : "false",
            "access-level": accessLevel,
            "use-classes-for-mutable": config.useClassesForMutable ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );

    if (postProcessOpen) {
        // Replace "public class" with "open class"
        // And also "public var" / "public let" inside an open class could technically stay public (not overridable) 
        // or be open (overridable). 
        // For simplicity and safety, we usually just want the class to be open.
        // However, if the user wants "open", they likely expect the class to be subclassable.
        return code.replace(/public class/g, "open class");
    }

    return code;
}
