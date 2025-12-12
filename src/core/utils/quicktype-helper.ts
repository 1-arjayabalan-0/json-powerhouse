
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
    rendererOptions: { [key: string]: string | boolean | undefined } = {}
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
        console.log(jsonInput);

        // Filter out undefined or null values from rendererOptions
        const safeRendererOptions = Object.entries(rendererOptions).reduce(
            (acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    acc[key] = value;
                }
                return acc;
            },
            {} as { [key: string]: string | boolean }
        );

        console.log("safeRendererOptions", safeRendererOptions);
        const result = await quicktype({
            inputData,
            lang: targetLanguage as any,
            rendererOptions: safeRendererOptions,
        });

        return result.lines.join("\n");
    } catch (error: any) {
        console.log(error);

        throw new Error(`Failed to generate code: ${error.message}`);
    }
}
