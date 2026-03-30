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
exports.generatePHPCode = generatePHPCode;
const quicktype_helper_1 = require("@/core/utils/quicktype-helper");
function generatePHPCode(jsonString, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, quicktype_helper_1.generateCodeFromJSON)(jsonString, "php", "Root", {
            "namespace": config.namespace,
            "strict-types": config.strictTypes ? "true" : "false",
            "acronym-style": config.acronymStyle,
        });
    });
}
//# sourceMappingURL=json-to-php.js.map