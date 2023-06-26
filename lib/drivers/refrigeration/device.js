"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../MieleHomeyDevice"));
const MieleConstants_1 = require("../../MieleConstants");
class MieleRefrigerationDevice extends MieleHomeyDevice_1.default {
    async setState(state) {
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff.visual', status != MieleConstants_1.Status.OFF);
        // Temperatures
        for (let i = 0; i < 3; i++) {
            const zoneName = (0, MieleConstants_1.temperatureZoneToCapability)(this.getType(), i + 1);
            const measureName = `measure_temperature.${zoneName}`;
            const targetName = `target_temperature.${zoneName}`;
            if (this.hasCapability(measureName)) {
                await this.safeSetCapability(measureName, (0, MieleConstants_1.temperatureFromApi)(state.temperature[i]?.value_raw));
            }
            if (this.hasCapability(targetName)) {
                await this.safeSetCapability(targetName, (0, MieleConstants_1.temperatureFromApi)(state.targetTemperature[i]?.value_raw));
            }
        }
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
        // Type Specific
        if (this.hasCapability('alarm_door')) {
            await this.safeSetCapability('alarm_door', state.signalDoor);
        }
        if (this.hasCapability('display_light')) {
            await this.safeSetCapability('display_light', state.light === MieleConstants_1.LightState.Enable);
        }
        if (this.hasCapability('command_light')) {
            await this.safeSetCapability('command_light', state.light === MieleConstants_1.LightState.Enable);
        }
        if (this.hasCapability('command_supercooling')) {
            await this.safeSetCapability('command_supercooling', status === MieleConstants_1.Status.SUPERCOOLING || status === MieleConstants_1.Status.SUPERCOOLING_SUPERFREEZING);
        }
        if (this.hasCapability('command_superfreezing')) {
            await this.safeSetCapability('command_superfreezing', status === MieleConstants_1.Status.SUPERFREEZING || status === MieleConstants_1.Status.SUPERCOOLING_SUPERFREEZING);
        }
    }
    registerCapabilities() {
        const commands = [
            'onoff.visual',
            'command_superfreezing',
            'command_supercooling',
            'command_sabbath_mode',
            'target_temperature.1',
            'target_temperature.2',
            'target_temperature.3',
            'target_temperature.fridge',
            'target_temperature.freezer',
            'target_temperature.wine',
            'command_light',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
    async setActions(actions) {
        const supportsSabbathMode = (actions.modes.length > 0);
        if (supportsSabbathMode && !this.hasCapability('command_sabbath_mode')) {
            await this.addCapability('command_sabbath_mode');
        }
        if (this.hasCapability('command_sabbath_mode')) {
            const sabbathState = (actions.modes.length > 0) ? actions.modes[0] === MieleConstants_1.SabbathMode.Normal : null;
            await this.safeSetCapability('command_sabbath_mode', sabbathState);
        }
    }
    async executeCommand(command, value) {
        let action = undefined;
        // Temperatures
        for (let zone = 1; zone <= 3; zone++) {
            const zoneName = (0, MieleConstants_1.temperatureZoneToCapability)(this.getType(), zone);
            const targetName = `target_temperature.${zoneName}`;
            if (command === targetName) {
                action = { targetTemperature: [{ zone, value: value }] };
            }
        }
        switch (command) {
            case 'onoff.visual':
                throw new Error(this.homey.__('not_supported'));
            case 'command_superfreezing':
                action = value
                    ? { processAction: MieleConstants_1.ProcessAction.START_SUPERFREEZING }
                    : { processAction: MieleConstants_1.ProcessAction.STOP_SUPERFREEZING };
                break;
            case 'command_supercooling':
                action = value
                    ? { processAction: MieleConstants_1.ProcessAction.START_SUPERCOOLING }
                    : { processAction: MieleConstants_1.ProcessAction.STOP_SUPERCOOLING };
                break;
            case 'command_sabbath_mode':
                action = value
                    ? { modes: MieleConstants_1.SabbathMode.Sabbath }
                    : { modes: MieleConstants_1.SabbathMode.Normal };
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
exports.default = MieleRefrigerationDevice;
//# sourceMappingURL=device.js.map