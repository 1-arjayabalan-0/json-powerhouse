"use strict";
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
exports.generateSwiftCode = generateSwiftCode;
const quicktype_helper_1 = require("@/core/utils/quicktype-helper");
function generateSwiftCode(jsonString, config) {
    return __awaiter(this, void 0, void 0, function* () {
        let accessLevel = config.accessLevel;
        let postProcessOpen = false;
        // Quicktype doesn't support "open", so we generate as "public" and replace later
        if (accessLevel === "open") {
            accessLevel = "public";
            // Only classes can be open
            if (config.typeKind === "class") {
                postProcessOpen = true;
            }
        }
        const code = yield (0, quicktype_helper_1.generateCodeFromJSON)(jsonString, "swift", "Root", {
            "struct-or-class": config.typeKind,
            "use-codable": config.useCodable ? "true" : "false",
            "access-level": accessLevel,
            "use-classes-for-mutable": config.useClassesForMutable ? "true" : "false",
            "acronym-style": config.acronymStyle,
        });
        if (postProcessOpen) {
            // Replace "public class" with "open class"
            // And also "public var" / "public let" inside an open class could technically stay public (not overridable) 
            // or be open (overridable). 
            // For simplicity and safety, we usually just want the class to be open.
            // However, if the user wants "open", they likely expect the class to be subclassable.
            return code.replace(/public class/g, "open class");
        }
        return code;
    });
}
//# sourceMappingURL=json-to-swift.js.map