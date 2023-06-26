"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../../lib/drivers/MieleHomeyDriver"));
class MieleHobDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        const groupTypes = [
            14,
            27,
            74
        ];
        return groupTypes.includes(type);
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "onoff.visual",
            "alarm_failure"
        ];
        switch (type) {
            case 14:
            case 27:
                return capabilities;
            case 74:
                return [
                    ...capabilities,
                    'display_ventilation_level'
                ];
            default:
                return [];
        }
    }
    async convertDevice(device, oAuth2Client) {
        const deviceResult = await super.convertDevice(device, oAuth2Client);
        const cookingZones = device.state.plateStep;
        if (!deviceResult.capabilitiesOptions) {
            deviceResult.capabilitiesOptions = {};
        }
        const zoneCapabilities = [];
        for (let zone = 0; zone < cookingZones.length; zone++) {
            const measureName = `display_cooking_zone_level.${zone + 1}`;
            zoneCapabilities.push(measureName);
            if (cookingZones.length) {
                deviceResult.capabilitiesOptions[measureName] = {
                    title: this.homey.__("cooking_zone_number", { number: zone + 1 })
                };
            }
        }
        deviceResult.capabilities?.unshift(...zoneCapabilities);
        return deviceResult;
    }
}
exports.default = MieleHobDriver;
module.exports = MieleHobDriver;
//# sourceMappingURL=driver.js.map