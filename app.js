"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const homey_log_1 = require("homey-log");
const homey_oauth2app_1 = require("homey-oauth2app");
const source_map_support_1 = __importDefault(require("source-map-support"));
const eventsource_1 = __importDefault(require("eventsource"));
source_map_support_1.default.install();
class MieleApp extends homey_oauth2app_1.OAuth2App {
    subscribeToSSE() {
        this.oAuthClient?.addListener('save', (...args) => {
            this.log('Client Saved!', args);
            const eventUrl = `${MieleApp.OAUTH2_CLIENT.API_URL}/devices/all/events`;
            this.eventSource?.close();
            this.eventSource = new eventsource_1.default(eventUrl, {
                headers: {
                    Authorization: `Bearer ${this.oAuthClient?.getToken().access_token}`,
                    Accept: 'text/event-stream',
                }
            });
            this.eventSource.onopen = (event) => {
                this.log('SSE Opened:', event);
            };
            const updateDevices = async (event) => {
                this.log('SSE device data', event.data);
                const devicesData = JSON.parse(event.data);
                const drivers = Object.values(this.homey.drivers.getDrivers());
                await Promise.all(drivers.map(driver => driver.updateDeviceStates(devicesData)));
            };
            this.eventSource.addEventListener('devices', updateDevices);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.eventSource.addEventListener('actions', async (event) => {
                this.log('SSE device actions', event.data);
                const actionsData = JSON.parse(event.data);
                const drivers = Object.values(this.homey.drivers.getDrivers());
                await Promise.all(drivers.map(driver => driver.updateDeviceActions(actionsData)));
            });
            this.eventSource.onerror = (event) => {
                this.error('SSE Error:', event);
            };
        });
    }
    setClient(client) {
        if (!this.oAuthClient) {
            this.oAuthClient = client;
            this.subscribeToSSE();
            this.oAuthClient.save();
        }
        else {
            if (this.oAuthClient.getToken().access_token !== client.getToken().access_token) {
                this.error('Unequal access tokens in OAuth2 clients!');
            }
        }
    }
    async onOAuth2Init() {
        try {
            await super.onOAuth2Init();
            this.homeyLog = new homey_log_1.Log({ homey: this.homey });
            const commands = [
                'command_start',
                'command_stop',
                'command_superfreezing',
                'command_supercooling',
                'command_light',
                'command_ventilation_level',
                'command_colors',
                'command_sabbath_mode',
                'command_program',
                'target_temperature.1',
                'target_temperature.2',
                'target_temperature.3',
                'target_temperature.fridge',
                'target_temperature.freezer',
                'target_temperature.wine',
            ];
            for (const command of commands) {
                const actionCard = this.homey.flow.getActionCard(command);
                actionCard
                    .registerRunListener(async (args) => {
                    this.log('Triggered command flow', command, 'with value', args.value);
                    const device = args.device;
                    await device.executeCommand(command, args.value);
                });
            }
            // Add callback to give available programs
            const actionCard = this.homey.flow.getActionCard('command_program');
            actionCard.registerArgumentAutocompleteListener('value', async (query, args) => {
                const device = args.device;
                const availablePrograms = await device.getAvailablePrograms();
                const availableProgramKeys = Object.keys(availablePrograms);
                return availableProgramKeys.map((name) => ({ name }));
            });
            this.homey.flow.getConditionCard('visual_onoff_value')
                .registerRunListener((args) => {
                if (args.device.hasCapability('onoff.visual')) {
                    return args.device.getCapabilityValue('onoff.visual');
                }
                throw new Error(this.homey.__('not_supported'));
            });
            this.homey.flow.getDeviceTriggerCard('display_status_changed_to')
                .registerRunListener((args, state) => {
                return args.status === state.status;
            });
            this.homey.flow.getConditionCard('display_status_value')
                .registerRunListener((args) => {
                if (args.device.hasCapability('display_status')) {
                    return args.device.getCapabilityValue('display_status') === args.status;
                }
                throw new Error(this.homey.__('not_supported'));
            });
            this.log('Miele has been initialized');
        }
        catch (e) {
            this.log('Miele failed to initialize');
            this.error(e);
        }
    }
    async onUninit() {
        this.eventSource?.close();
        delete this.eventSource;
        await super.onUninit();
    }
}
MieleApp.OAUTH2_CLIENT = require('./lib/MieleApi');
MieleApp.OAUTH2_DEBUG = homey_1.default.env.DEBUG === '1';
module.exports = MieleApp;
//# sourceMappingURL=app.js.map