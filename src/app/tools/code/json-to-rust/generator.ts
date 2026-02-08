import { RustConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generateRustCode(jsonString: string, config: RustConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "rust",
        "Root",
        {
            "derive-debug": config.deriveDebug ? "true" : "false",
            "derive-clone": config.deriveClone ? "true" : "false",
            "visibility": config.visibility,
            "density": config.density,
        }
    );
}
