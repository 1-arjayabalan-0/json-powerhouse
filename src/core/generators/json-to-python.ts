import { PythonConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generatePythonCode(jsonString: string, config: PythonConfig): Promise<string> {
    // quicktype's "python-version" is really a feature switch: 3.5 = no hints, 3.6 = hints, 3.7 = dataclasses.
    // Dataclasses and pydantic models need annotations, so type hints only toggle for plain classes.
    const plain = config.classType === 'plain';
    const pythonVersion = plain ? (config.useTypeHints ? "3.6" : "3.5") : "3.7";

    return await generateCodeFromJSON(
        jsonString,
        "python",
        "Root",
        {
            "python-version": pythonVersion,
            "pydantic-base-model": config.classType === 'pydantic',
            "nice-property-names": config.nicePropertyNames,
        }
    );
}
