"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../../lib/drivers/MieleHomeyDevice"));
const MieleConstants_1 = require("../../lib/MieleConstants");
class MieleDishWarmerDevice extends MieleHomeyDevice_1.default {
    async setState(state) {
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff', status != MieleConstants_1.Status.OFF);
        const programId = state.ProgramID.value_raw;
        // Programs
        await this.safeSetCapability('command_dish_warmer_program', programId ? `${programId}` : null);
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
    }
    registerCapabilities() {
        const commands = [
            'onoff',
            'command_dish_warmer_program',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
    async executeCommand(command, value) {
        if (command === 'command_dish_warmer_program') {
            const action = {
                programId: parseInt(value),
            };
            return this.oAuth2Client.sendDeviceAction(this.getId(), action)
                .catch(() => {
                throw new Error(this.homey.__('command_failed'));
            });
        }
        else {
            return super.executeCommand(command, value);
        }
    }
}
module.exports = MieleDishWarmerDevice;
//# sourceMappingURL=device.js.map