"use strict";
"use server";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCodeFromJSON = generateCodeFromJSON;
const quicktype_core_1 = require("quicktype-core");
/**
 * Helper function to generate code from JSON using quicktype
 */
function generateCodeFromJSON(jsonString_1, targetLanguage_1) {
    return __awaiter(this, arguments, void 0, function* (jsonString, targetLanguage, typeName = "Root", rendererOptions = {}) {
        try {
            const jsonInput = (0, quicktype_core_1.jsonInputForTargetLanguage)(targetLanguage);
            // Parse and add the JSON sample
            yield jsonInput.addSource({
                name: typeName,
                samples: [jsonString],
            });
            const inputData = new quicktype_core_1.InputData();
            inputData.addInput(jsonInput);
            console.log(jsonInput);
            // Filter out undefined or null values from rendererOptions
            const safeRendererOptions = Object.entries(rendererOptions).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    acc[key] = value;
                }
                return acc;
            }, {});
            console.log("safeRendererOptions", safeRendererOptions);
            const result = yield (0, quicktype_core_1.quicktype)({
                inputData,
                lang: targetLanguage,
                rendererOptions: safeRendererOptions,
            });
            return result.lines.join("\n");
        }
        catch (error) {
            console.log(error);
            throw new Error(`Failed to generate code: ${error.message}`);
        }
    });
}
//# sourceMappingURL=quicktype-helper.js.map