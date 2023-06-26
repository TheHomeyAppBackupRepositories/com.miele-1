"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../../lib/drivers/MieleHomeyDevice"));
const MieleConstants_1 = require("../../lib/MieleConstants");
class MieleHoodDevice extends MieleHomeyDevice_1.default {
    async setState(state) {
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff', status != MieleConstants_1.Status.OFF);
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
        // Lights
        await this.safeSetCapability('command_light', state.light === MieleConstants_1.LightState.Enable);
        // Ventilation
        await this.safeSetCapability('command_ventilation_level', state.ventilationStep.value_raw);
    }
    registerCapabilities() {
        const commands = [
            'onoff',
            'command_stop',
            'command_light',
            'command_ventilation_level',
            'command_colors',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
    async executeCommand(command, value) {
        let action = undefined;
        switch (command) {
            case 'command_ventilation_level':
                action = { ventilationStep: value };
                break;
            case 'command_colors':
                action = { colors: value };
                break;
        }
        if (action) {
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
module.exports = MieleHoodDevice;
//# sourceMappingURL=device.js.map