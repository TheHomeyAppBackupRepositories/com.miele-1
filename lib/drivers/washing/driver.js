"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../MieleHomeyDriver"));
class MieleWashingDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        const groupTypes = [
            1,
            2,
            7,
            24
        ];
        return groupTypes.includes(type);
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "command_start",
            "command_stop",
            "display_program",
            "display_program_phase",
            "display_time_remaining",
            "display_time_start",
            "display_time_elapsed",
            "numeric_time_start",
            "numeric_time_remaining",
            "numeric_time_elapsed",
            "alarm_information",
            "alarm_failure",
            "display_energy_prediction",
            "display_water_prediction",
            "meter_energy_consumption",
            "meter_water_consumption",
        ];
        switch (type) {
            case 1:
                return [
                    ...capabilities,
                    "onoff",
                    "display_spin_speed",
                ];
            case 2:
                return [
                    ...capabilities,
                    "onoff",
                    "display_drying_level",
                ];
            case 7:
                return [
                    ...capabilities,
                    "onoff",
                ];
            case 24:
                return [
                    ...capabilities,
                    "display_spin_speed",
                    "display_drying_level",
                ];
            default:
                this.error('Incorrect type for this driver');
                return [];
        }
    }
}
exports.default = MieleWashingDriver;
//# sourceMappingURL=driver.js.map