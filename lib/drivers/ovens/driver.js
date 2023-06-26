"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../MieleHomeyDriver"));
class MieleOvensDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        const groupTypes = [
            12,
            13,
            15,
            16,
            31,
            45,
            67
        ];
        return groupTypes.includes(type);
    }
    getTypeCapabilities(type) {
        // Temperature zones are added later
        const capabilities = [
            "display_status",
            "onoff",
            "command_start",
            "command_stop",
            "display_program",
            "display_program_phase",
            "display_time_start",
            "display_time_remaining",
            "display_time_elapsed",
            "numeric_time_start",
            "numeric_time_remaining",
            "numeric_time_elapsed",
            "alarm_information",
            "alarm_failure",
            "alarm_door"
        ];
        switch (type) {
            case 67:
                return capabilities;
            case 12:
            case 13:
            case 15:
            case 16:
            case 31:
            case 45:
                return [
                    ...capabilities,
                    "command_light",
                ];
            default:
                return [];
        }
    }
    async convertDevice(device, oAuthClient) {
        const deviceResult = await super.convertDevice(device, oAuthClient);
        if (!deviceResult.capabilitiesOptions) {
            deviceResult.capabilitiesOptions = {};
        }
        // Get the available temperature zones for this device
        const temperatureZones = device.state.temperature;
        let zoneCount = 0;
        let zonePointer = 1;
        for (const temperatureZone of temperatureZones) {
            if (temperatureZone.value_localized) {
                zoneCount = Math.max(zoneCount, zonePointer);
            }
            zonePointer++;
        }
        for (let zone = 1; zone <= zoneCount; zone++) {
            const measureName = `display_temperature.${zone}`;
            const targetName = `display_target_temperature.${zone}`;
            deviceResult.capabilities?.push(measureName);
            deviceResult.capabilities?.push(targetName);
            // Make the zones distinguishable in the UI
            if (zoneCount > 1) {
                const zoneName = this.homey.__("temperature_zone_number", { number: zone });
                deviceResult.capabilitiesOptions[measureName] = {
                    title: this.homey.__("measure_name_temperature_zone", { zone: zoneName })
                };
                deviceResult.capabilitiesOptions[targetName] = {
                    title: this.homey.__("target_name_temperature_zone", { zone: zoneName })
                };
            }
        }
        return deviceResult;
    }
}
exports.default = MieleOvensDriver;
//# sourceMappingURL=driver.js.map