import { PythonConfig } from "@/app/types/code-generator-config";
import { generateCodeFromJSON } from "@/app/utils/quicktype-helper";

export async function generatePythonCode(jsonString: string, config: PythonConfig): Promise<string> {
    const versionMap: { [key: string]: string } = {
        '3.10+': '3.7',
        '3.9': '3.7',
        '3.8': '3.7',
        '3.7': '3.7',
        '3.6': '3.6',
    };

    const pythonVersion = versionMap[config.pythonVersion] || '3.7';
    const classType = config.classType === 'plain' ? undefined : config.classType === 'attrs' ? undefined : true;

    return await generateCodeFromJSON(
        jsonString,
        "python",
        "Root",
        {
            "features": pythonVersion,
            "just-types": !classType ? "true" : "false",
            "nice-property-names": config.nicePropertyNames ? "true" : "false",
        }
    );
}
