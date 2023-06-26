"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../../lib/drivers/MieleHomeyDriver"));
class MieleDishWarmerDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        return type === 25;
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "onoff",
            "command_dish_warmer_program",
            "alarm_information",
            "alarm_failure",
            "button.sync_programs",
        ];
        if (type === 25) {
            return capabilities;
        }
        else {
            this.error('Incorrect type for this driver');
            return [];
        }
    }
}
module.exports = MieleDishWarmerDriver;
//# sourceMappingURL=driver.js.map