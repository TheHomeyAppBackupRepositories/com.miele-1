"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../../lib/drivers/MieleHomeyDriver"));
class MieleHoodDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        return type === 18;
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "onoff",
            "command_stop",
            "command_light",
            "command_colors",
            "command_ventilation_level",
            "alarm_information",
            "alarm_failure"
        ];
        if (type === 18) {
            return capabilities;
        }
        else {
            return [];
        }
    }
}
module.exports = MieleHoodDriver;
//# sourceMappingURL=driver.js.map