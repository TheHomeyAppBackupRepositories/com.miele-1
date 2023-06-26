"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("../../lib/drivers/ovens/driver"));
class MieleDialogOvenDriver extends driver_1.default {
    filterOnType(type) {
        return type === 67;
    }
}
module.exports = MieleDialogOvenDriver;
//# sourceMappingURL=driver.js.map