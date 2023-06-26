"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDriver_1 = __importDefault(require("../../lib/drivers/MieleHomeyDriver"));
class MieleRobotVacuumDriver extends MieleHomeyDriver_1.default {
    filterOnType(type) {
        return type === 23;
    }
    getTypeCapabilities(type) {
        const capabilities = [
            "display_status",
            "onoff",
            "display_program",
            "alarm_information",
            "alarm_failure",
            "measure_battery",
            "button.sync_programs",
        ];
        if (type === 23) {
            return capabilities;
        }
        else {
            this.error('Incorrect type for this driver');
            return [];
        }
    }
    async convertDevice(device, oAuth2Client) {
        const deviceResult = await super.convertDevice(device, oAuth2Client);
        // Get the available programs for this device
        const programsResponse = await oAuth2Client.getDevicePrograms(deviceResult.data.id);
        // Set programs available to select
        const programOptions = {};
        for (const program of programsResponse) {
            programOptions[program.program] = program.programId;
        }
        if (!deviceResult.store) {
            deviceResult.store = {};
        }
        deviceResult.store['programs'] = programOptions;
        return deviceResult;
    }
}
module.exports = MieleRobotVacuumDriver;
//# sourceMappingURL=driver.js.map