"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../../lib/drivers/MieleHomeyDriver"));
class MieleCoffeeDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        return type === 17;
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "onoff",
            "command_light",
            "display_program",
            "alarm_information",
            "alarm_failure"
        ];
        if (type === 17) {
            return capabilities;
        }
        else {
            // TODO add incorrect type error to all drivers
            return [];
        }
    }
}
module.exports = MieleCoffeeDriver;
//# sourceMappingURL=driver.js.map