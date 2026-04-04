import { PHPConfig } from "@/core/types/code-generator-config";
import { generateCodeFromJSON } from "@/core/utils/quicktype-helper";

export async function generatePHPCode(jsonString: string, config: PHPConfig): Promise<string> {
    const acronymMap: { [key: string]: string } = {
        'pascal': 'pascal',
        'camel': 'camel',
        'lowerCase': 'lowerCase',
        'original': 'original',
        'upperCase': 'pascal',
    };
    
    const acronymStyle = acronymMap[config.acronymStyle] || 'pascal';

    return await generateCodeFromJSON(
        jsonString,
        "php",
        "Root",
        {
            "with-get": config.useGettersSetters ? "true" : "false",
            "fast-get": config.fastMode ? "true" : "false",
            "acronym-style": acronymStyle,
        }
    );
}
