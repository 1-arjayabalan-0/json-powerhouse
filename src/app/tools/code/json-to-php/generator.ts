import { PHPConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generatePHPCode(jsonString: string, config: PHPConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "php",
        "Root",
        {
            "namespace": config.namespace,
            "strict-types": config.strictTypes ? "true" : "false",
            "acronym-style": config.acronymStyle,
        }
    );
}
