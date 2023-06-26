"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homey_oauth2app_1 = require("homey-oauth2app");
class MieleHomeyDriver extends homey_oauth2app_1.OAuth2Driver {
    getDevices() {
        return super.getDevices();
    }
    getDevice(deviceData) {
        return super.getDevice(deviceData);
    }
    async onPairListDevices({ oAuth2Client }) {
        try {
            const response = await oAuth2Client.getDevices();
            const apiDevices = Object.values(response);
            this.log('Miele devices found!', JSON.stringify(apiDevices));
            return Promise.all(apiDevices
                .filter(apiDevice => this.filterOnType(apiDevice.ident.type.value_raw))
                .map(apiDevice => this.convertDevice(apiDevice, oAuth2Client)))
                .then(result => { this.log('Miele device', result); return result; });
        }
        catch (e) {
            this.error(e);
            return [];
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async convertDevice(device, oAuth2Client) {
        const deviceIdentity = device.ident;
        const capabilities = this.getTypeCapabilities(deviceIdentity.type.value_raw);
        let deviceName = deviceIdentity.deviceName;
        if (deviceName.length < 1) {
            // In case there is no user defined name, use the Miele technical name
            deviceName = `${deviceIdentity.deviceIdentLabel.techType} ${deviceIdentity.type.value_localized}`;
        }
        return {
            name: deviceName,
            data: {
                id: deviceIdentity.deviceIdentLabel.fabNumber,
                type: deviceIdentity.type.value_raw,
            },
            capabilities,
        };
    }
    async updateDeviceStates(data) {
        const devices = this.getDevices();
        const map = devices.map(device => {
            if (device.getId() in data) {
                const deviceState = data[device.getId()].state;
                return device.setState(deviceState);
            }
            else
                return device.setUnavailable(this.homey.__("device_removed"));
        });
        await Promise.all(map);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async updateDeviceActions(data) {
        return;
    }
}
exports.default = MieleHomeyDriver;
//# sourceMappingURL=MieleHomeyDriver.js.map