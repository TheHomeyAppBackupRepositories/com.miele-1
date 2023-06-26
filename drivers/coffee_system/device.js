"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../../lib/drivers/MieleHomeyDevice"));
const MieleConstants_1 = require("../../lib/MieleConstants");
class MieleCoffeeDevice extends MieleHomeyDevice_1.default {
    async setState(state) {
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff', status != MieleConstants_1.Status.OFF);
        // Programs
        await this.safeSetCapability('display_program', state.ProgramID.value_localized);
        // Lights
        await this.safeSetCapability('command_light', state.light === MieleConstants_1.LightState.Enable);
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
    }
    registerCapabilities() {
        const commands = [
            'onoff',
            'command_light',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
}
module.exports = MieleCoffeeDevice;
//# sourceMappingURL=device.js.map