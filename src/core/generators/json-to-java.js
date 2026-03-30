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
exports.generateJavaCode = generateJavaCode;
const quicktype_helper_1 = require("@/core/utils/quicktype-helper");
function generateJavaCode(jsonString, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, quicktype_helper_1.generateCodeFromJSON)(jsonString, "java", "Root", {
            "package": config.packageName,
            "use-getters-setters": config.useGettersSetters ? "true" : "false",
            "use-optional": config.useOptional ? "true" : "false",
            "use-big-decimal": config.useBigDecimal ? "true" : "false",
            "array-type": config.arrayType === "list" ? "list" : "array",
            "acronym-style": config.acronymStyle,
        });
    });
}
//# sourceMappingURL=json-to-java.js.map