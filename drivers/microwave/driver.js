"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("../../lib/drivers/ovens/driver"));
class MieleMicrowaveDriver extends driver_1.default {
    filterOnType(type) {
        return type === 16;
    }
}
module.exports = MieleMicrowaveDriver;
//# sourceMappingURL=driver.js.map