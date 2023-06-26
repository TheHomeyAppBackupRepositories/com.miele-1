"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MieleHomeyDevice_1 = __importDefault(require("../../lib/drivers/MieleHomeyDevice"));
const MieleConstants_1 = require("../../lib/MieleConstants");
class MieleHobDevice extends MieleHomeyDevice_1.default {
    async updateAvailableCookingZones(cookingZones) {
        const zoneCount = cookingZones.length;
        for (let zone = 1; zone <= zoneCount; zone++) {
            const measureName = `display_cooking_zone_level.${zone}`;
            await this.addCapability(measureName);
            if (zoneCount > 1) {
                await this.setCapabilityOptions(measureName, {
                    title: this.homey.__("cooking_zone_number", { number: zone })
                });
            }
        }
    }
    async setState(state) {
        // Update the available cooking zones for this device
        const cookingZones = state.plateStep;
        await this.updateAvailableCookingZones(cookingZones);
        // State
        const status = state.status.value_raw;
        if (!await super.setStateAvailable(state)) {
            return;
        }
        await super.setState(state);
        await this.safeSetCapability('onoff.visual', status != MieleConstants_1.Status.OFF);
        // Signals
        await this.safeSetCapability('alarm_failure', state.signalFailure);
        // Cooking Zones
        for (let i = 0; i < cookingZones.length; i++) {
            const measureName = `display_cooking_zone_level.${i + 1}`;
            await this.safeSetCapability(measureName, state.plateStep[i].value_raw);
        }
        // Type Specific
        if (this.hasCapability('display_ventilation_level')) {
            await this.safeSetCapability('display_ventilation_level', state.ventilationStep.value_raw);
        }
    }
    registerCapabilities() {
        const commands = [
            'onoff.visual',
        ];
        for (const command of commands) {
            this.registerCapabilityListener(command, (value) => this.executeCommand(command, value));
        }
    }
    async executeCommand(command, value) {
        if (command === 'onoff.visual') {
            throw new Error(this.homey.__('not_supported'));
        }
        else {
            return super.executeCommand(command, value);
        }
    }
}
exports.default = MieleHobDevice;
module.exports = MieleHobDevice;
//# sourceMappingURL=device.js.map