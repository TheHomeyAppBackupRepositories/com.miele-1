"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../../lib/drivers/MieleHomeyDevice"));
const MieleConstants_1 = require("../../lib/MieleConstants");
class MieleRobotVacuumDevice extends MieleHomeyDevice_1.default {
    async updateAvailablePrograms() {
        const programsResponse = await this.oAuth2Client.getDevicePrograms(this.getId());
        // Set programs available to select
        const programOptions = {};
        for (const program of programsResponse) {
            programOptions[program.program] = program.programId;
        }
        await this.setStoreValue('programs', programOptions);
    }
    async getAvailablePrograms() {
        const programs = await this.getStoreValue('programs');
        return programs ? programs : {};
    }
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
        // Signals
        await this.safeSetCapability('alarm_information', state.signalInfo);
        await this.safeSetCapability('alarm_failure', state.signalFailure);
        // Battery
        await this.safeSetCapability('measure_battery', state.batteryLevel);
    }
    registerCapabilities() {
        this.registerCapabilityListener('button.sync_programs', () => this.updateAvailablePrograms());
        const commands = [
            'onoff',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
    async executeCommand(command, value) {
        if (command === 'onoff') {
            throw new Error(this.homey.__('not_supported'));
        }
        else if (command === 'command_program') {
            const autocompleteValue = value;
            const availablePrograms = await this.getAvailablePrograms();
            const programId = availablePrograms[autocompleteValue.name];
            if (!programId) {
                throw new Error(this.homey.__("unknown_program"));
            }
            const action = {
                programId: programId,
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
exports.default = MieleRobotVacuumDevice;
module.exports = MieleRobotVacuumDevice;
//# sourceMappingURL=device.js.map