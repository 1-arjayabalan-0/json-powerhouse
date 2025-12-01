

"use server";

import {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
    TargetLanguage,
} from "quicktype-core";

/**
 * Helper function to generate code from JSON using quicktype
 */
export async function generateCodeFromJSON(
    jsonString: string,
    targetLanguage: string | TargetLanguage,
    typeName: string = "Root",
    rendererOptions: { [key: string]: string } = {}
): Promise<string> {
    try {
        const jsonInput = jsonInputForTargetLanguage(targetLanguage as any);

        // Parse and add the JSON sample
        await jsonInput.addSource({
            name: typeName,
            samples: [jsonString],
        });

        const inputData = new InputData();
        inputData.addInput(jsonInput);

        const result = await quicktype({
            inputData,
            lang: targetLanguage as any,
            rendererOptions,
        });

        return result.lines.join("\n");
    } catch (error: any) {
        throw new Error(`Failed to generate code: ${error.message}`);
    }
}
