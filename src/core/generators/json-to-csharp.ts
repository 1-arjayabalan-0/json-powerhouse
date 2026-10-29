import { CSharpConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

const quicktypeFramework: Record<string, string> = {
    SystemTextJson: "SystemTextJson",
    NewtonsoftJson: "NewtonSoft",
};

export async function generateCSharpCode(jsonString: string, config: CSharpConfig): Promise<string> {
    const code = await generateCodeFromJSON(
        jsonString,
        "csharp",
        "Root",
        {
            "namespace": config.namespace,
            "framework": quicktypeFramework[config.framework] ?? "SystemTextJson",
            "features": config.framework === 'none' ? "just-types-and-namespace" : "complete",
            "number-type": config.numberType,
            "array-type": config.arrayType,
            "density": config.density,
        }
    );
    return applyTypeOptions(code, config);
}

// quicktype only emits `public partial class`; record/struct and internal access are applied here.
function applyTypeOptions(code: string, config: CSharpConfig): string {
    let result = code;
    if (config.recordType === 'record' || config.recordType === 'struct') {
        result = result.replace(/\bpartial class\b/g, `partial ${config.recordType}`);
    }
    if (config.accessLevel === 'internal') {
        result = result.replace(/^(\s*)public (partial (?:class|record|struct)|static class Serialize|enum)\b/gm, '$1internal $2');
    }
    return result;
}
