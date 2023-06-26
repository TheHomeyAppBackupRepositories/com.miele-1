"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../MieleHomeyDevice"));
const MieleConstants_1 = require("../../MieleConstants");
class MieleWashingDevice extends MieleHomeyDevice_1.default {
    async setState(state) {
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
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
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
        // Eco Feedback
        const ecoFeedback = state.ecoFeedback;
        if (ecoFeedback) {
            await this.safeSetCapability('display_energy_prediction', ecoFeedback.energyforecast);
            await this.safeSetCapability('display_water_prediction', ecoFeedback.waterforecast);
            await this.safeSetCapability('meter_energy_consumption', ecoFeedback.currentEnergyConsumption.value);
            await this.safeSetCapability('meter_water_consumption', ecoFeedback.currentWaterConsumption.value);
        }
        // Type Specific
        if (this.hasCapability('onoff')) {
            await this.safeSetCapability('onoff', status != MieleConstants_1.Status.OFF);
        }
        if (this.hasCapability('display_spin_speed')) {
            await this.safeSetCapability('display_spin_speed', state.spinningSpeed.value_raw);
        }
        if (this.hasCapability('display_drying_level')) {
            await this.safeSetCapability('display_drying_level', state.dryingStep.value_localized);
        }
    }
    registerCapabilities() {
        const commands = [
            'command_start',
            'command_stop',
            'onoff',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, value => this.executeCommand(command, value));
        }
    }
}
exports.default = MieleWashingDevice;
//# sourceMappingURL=device.js.map