import { PythonConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generatePythonCode(jsonString: string, config: PythonConfig): Promise<string> {
    return await generateCodeFromJSON(
        jsonString,
        "python",
        "Root",
        {}
    );
}
