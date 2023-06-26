"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("../../lib/drivers/refrigeration/driver"));
class MieleFreezerDriver extends driver_1.default {
    filterOnType(type) {
        return type === 20;
    }
}
module.exports = MieleFreezerDriver;
//# sourceMappingURL=driver.js.map