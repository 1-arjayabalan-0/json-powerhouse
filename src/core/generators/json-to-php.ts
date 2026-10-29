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

    const code = await generateCodeFromJSON(
        jsonString,
        "php",
        "Root",
        {
            "with-get": config.useGettersSetters ? "true" : "false",
            "fast-get": config.fastMode ? "true" : "false",
            "acronym-style": acronymStyle,
        }
    );
    return addFileHeader(code, config);
}

// quicktype has no PHP namespace or strict_types options, so add them after the opening tag.
function addFileHeader(code: string, config: PHPConfig): string {
    const header: string[] = [];
    if (config.strictTypes) header.push("declare(strict_types=1);");
    const namespace = config.namespace.trim().replace(/^\\+|\\+$/g, '');
    if (namespace) header.push(`namespace ${namespace};`);
    if (header.length === 0) return code;
    return code.replace(/^<\?php\n/, `<?php\n\n${header.join("\n\n")}\n`);
}
