"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../MieleHomeyDriver"));
const MieleConstants_1 = require("../../MieleConstants");
class MieleRefrigerationDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        const groupTypes = [
            19,
            20,
            21,
            32,
            33,
            34,
            68
        ];
        return groupTypes.includes(type);
    }
    getTypeCapabilities(type) {
        // Temperature zones are added later
        const capabilities = [
            "display_status",
            "onoff.visual",
            "alarm_information",
            "alarm_failure",
        ];
        switch (type) {
            case 19:
                return [
                    ...capabilities,
                    "command_supercooling",
                    "alarm_door",
                    "display_light",
                ];
            case 20:
                return [
                    ...capabilities,
                    "command_superfreezing",
                    "alarm_door",
                    "display_light",
                ];
            case 21:
                return [
                    ...capabilities,
                    "command_superfreezing",
                    "command_supercooling",
                    "alarm_door",
                    "display_light",
                ];
            case 32:
            case 33:
            case 34:
                return [
                    ...capabilities,
                    "command_light",
                    "alarm_door",
                ];
            case 68:
                return [
                    ...capabilities,
                    "command_superfreezing",
                    "command_light"
                ];
            default:
                return [];
        }
    }
    async convertDevice(device, oAuth2Client) {
        const deviceResult = await super.convertDevice(device, oAuth2Client);
        // Get the available temperature zones for this device
        const actionsResponse = await oAuth2Client.getDeviceActions(deviceResult.data.id);
        const temperatureZones = actionsResponse.targetTemperature;
        if (!deviceResult.capabilitiesOptions) {
            deviceResult.capabilitiesOptions = {};
        }
        // Add capabilities for each temperature zone
        for (const temperatureZone of temperatureZones) {
            const zoneCapabilityName = (0, MieleConstants_1.temperatureZoneToCapability)(device.ident.type.value_raw, temperatureZone.zone);
            const measureName = `measure_temperature.${zoneCapabilityName}`;
            const targetName = `target_temperature.${zoneCapabilityName}`;
            deviceResult.capabilities?.push(measureName);
            deviceResult.capabilities?.push(targetName);
            deviceResult.capabilitiesOptions[targetName] = {
                min: temperatureZone.min,
                max: temperatureZone.max,
                step: 1,
            };
            // Make the zones distinguishable in the UI
            if (temperatureZones.length > 1) {
                const zoneSelector = (0, MieleConstants_1.tempZoneToSelector)(device.ident.type.value_raw, temperatureZone.zone);
                const zoneName = (0, MieleConstants_1.temperatureZoneToName)(zoneSelector);
                deviceResult.capabilitiesOptions[measureName] = { title: zoneName.measure };
                deviceResult.capabilitiesOptions[targetName].title = zoneName.target;
            }
        }
        // Add Sabbath mode if available
        if (actionsResponse.modes.length > 0) {
            deviceResult.capabilities?.push('command_sabbath_mode');
        }
        return deviceResult;
    }
    async updateDeviceActions(data) {
        const devices = this.getDevices();
        const map = devices.map(device => {
            if (device.getId() in data) {
                const deviceActions = data[device.getId()];
                return device.setActions(deviceActions);
            }
        });
        await Promise.all(map);
    }
}
exports.default = MieleRefrigerationDriver;
//# sourceMappingURL=driver.js.map