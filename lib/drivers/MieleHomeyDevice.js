"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homey_oauth2app_1 = require("homey-oauth2app");
const MieleConstants_1 = require("../MieleConstants");
class MieleHomeyDevice extends homey_oauth2app_1.OAuth2Device {
    async onOAuth2Init() {
        const app = this.homey.app;
        app.setClient(this.oAuth2Client);
        if (!this.hasCapability('display_status')) {
            await this.addCapability('display_status');
        }
        this._status_changed_to_device_trigger = this.homey.flow.getDeviceTriggerCard('display_status_changed_to');
        return this.oAuth2Client.getDeviceState(this.getId())
            .then(deviceState => {
            this.setState(deviceState).then(() => this.registerCapabilities()).catch(e => this.error(e));
        })
            .catch(() => {
            this.setUnavailable(this.homey.__("device_removed"));
        });
    }
    async safeSetCapability(capabilityId, value) {
        if (value !== undefined && value !== null && value !== '' && !Number.isNaN(value)) {
            if (value !== this.getCapabilityValue(capabilityId)) {
                this.log('Changed value of', capabilityId, 'to', value);
            }
            return this.setCapabilityValue(capabilityId, value)
                .then(() => {
                if (capabilityId !== 'onoff.visual') {
                    return;
                }
                // Manual flow card trigger for visual onoff capability
                this.homey.flow
                    .getDeviceTriggerCard(value ? 'visual_onoff_true' : 'visual_onoff_false')
                    .trigger(this)
                    .catch(this.error);
            })
                .catch(e => this.error('Failed to set', capabilityId, 'with', e));
        }
        else {
            // Set the status to unknown
            if (null !== this.getCapabilityValue(capabilityId)) {
                this.log('Changed value of', capabilityId, 'to unknown');
            }
            return this.setCapabilityValue(capabilityId, null)
                .catch(e => this.error('Failed to set', capabilityId, 'with', e));
        }
    }
    getId() {
        return this.getData().id;
    }
    getType() {
        return this.getData().type;
    }
    onRenamed(name) {
        this.oAuth2Client.put({
            path: `/devices/${this.getId()}/actions`,
            body: {
                "deviceName": name,
            }
        }).catch(this.error);
    }
    async setStateAvailable(state) {
        const status = state.status.value_raw;
        if (status === MieleConstants_1.Status.NOT_CONNECTED) {
            await this.setUnavailable(this.homey.__("device_offline"));
            return false;
        }
        else {
            await this.setAvailable();
            return true;
        }
    }
    async setState(state) {
        const currentStatus = this.getCapabilityValue('display_status');
        const newStatus = (0, MieleConstants_1.enumStatusToString)(state.status.value_raw);
        await this.safeSetCapability('display_status', newStatus);
        if (currentStatus != newStatus) {
            await this._status_changed_to_device_trigger?.trigger(this, {}, { status: newStatus });
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setActions(actions) {
        return;
    }
    async executeCommand(command, value) {
        let action = undefined;
        switch (command) {
            case 'command_start':
                action = { processAction: MieleConstants_1.ProcessAction.START };
                break;
            case 'command_stop':
                action = { processAction: MieleConstants_1.ProcessAction.STOP };
                break;
            case 'command_light':
                action = { light: value ? MieleConstants_1.LightState.Enable : MieleConstants_1.LightState.Disable };
                break;
            case 'onoff':
                action = value ? { powerOn: true } : { powerOff: true };
                break;
        }
        if (action) {
            return this.oAuth2Client.sendDeviceAction(this.getId(), action)
                .catch(() => {
                throw new Error(this.homey.__('command_failed'));
            });
        }
        else {
            return this.error('Unknown command');
        }
    }
}
exports.default = MieleHomeyDevice;
//# sourceMappingURL=MieleHomeyDevice.js.map