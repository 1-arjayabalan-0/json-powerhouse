import { PythonConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generatePythonCode(jsonString: string, config: PythonConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "python",
        "Root",
        {
            "python-version": config.pythonVersion,
            "type-hints": config.useTypeHints ? "true" : "false",
            "nice-property-names": config.nicePropertyNames ? "true" : "false",
        }
    );
}
