"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../MieleHomeyDevice"));
const MieleConstants_1 = require("../../MieleConstants");
class MieleOvensDevice extends MieleHomeyDevice_1.default {
    async updateAvailableTemperatureZones(temperatureZones) {
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
            if (!this.hasCapability(measureName)) {
                await this.addCapability(measureName);
                await this.addCapability(targetName);
                // Make the zones distinguishable in the UI
                if (zoneCount > 1) {
                    const zoneName = (0, MieleConstants_1.temperatureZoneToName)(zone);
                    await this.setCapabilityOptions(measureName, { title: zoneName.measure });
                    await this.setCapabilityOptions(targetName, { title: zoneName.target });
                }
            }
        }
    }
    async setState(state) {
        // Update the available temperature zones for this device
        const temperatureZones = state.temperature;
        await this.updateAvailableTemperatureZones(temperatureZones);
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff', status != MieleConstants_1.Status.OFF);
        // Programs
        await this.safeSetCapability('display_program', state.ProgramID.value_localized);
        await this.safeSetCapability('display_program_phase', state.programPhase.value_localized);
        // Times
        await this.safeSetCapability('display_time_remaining', (0, MieleConstants_1.printTime)(state.remainingTime));
        await this.safeSetCapability('display_time_start', (0, MieleConstants_1.printTime)(state.startTime));
        await this.safeSetCapability('display_time_elapsed', (0, MieleConstants_1.printTime)(state.elapsedTime));
        await this.safeSetCapability('numeric_time_remaining', (0, MieleConstants_1.minutesTime)(state.remainingTime));
        await this.safeSetCapability('numeric_time_start', (0, MieleConstants_1.minutesTime)(state.startTime));
        await this.safeSetCapability('numeric_time_elapsed', (0, MieleConstants_1.minutesTime)(state.elapsedTime));
        // Temperatures
        // display_temperature
        // display_target_temperature
        for (let i = 0; i < 3; i++) {
            const measureName = `display_temperature.${i + 1}`;
            const targetName = `display_target_temperature.${i + 1}`;
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
        await this.safeSetCapability('alarm_door', state.signalDoor);
        // Type Specific
        if (this.hasCapability('command_light')) {
            await this.safeSetCapability('command_light', state.light === MieleConstants_1.LightState.Enable);
        }
    }
    registerCapabilities() {
        const commands = [
            'command_start',
            'command_stop',
            'onoff',
            'command_light',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
}
exports.default = MieleOvensDevice;
//# sourceMappingURL=device.js.map