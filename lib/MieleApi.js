"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const homey_oauth2app_1 = require("homey-oauth2app");
class MieleApiImpl extends homey_oauth2app_1.OAuth2Client {
    getDevices() {
        return this.get({
            path: '/devices'
        });
    }
    getDevicesSummary() {
        return this.get({
            path: '/short/devices'
        });
    }
    getDevice(id) {
        return this.get({
            path: `/devices/${id}`
        });
    }
    getDeviceIdentity(id) {
        return this.get({
            path: `/devices/${id}/ident`
        });
    }
    getDeviceState(id) {
        return this.get({
            path: `/devices/${id}/state`
        });
    }
    getDeviceActions(id) {
        return this.get({
            path: `/devices/${id}/actions`
        });
    }
    getDevicePrograms(id) {
        return this.get({
            path: `/devices/${id}/programs`
        });
    }
    sendDeviceAction(id, action) {
        this.log('Sending action', action);
        return this.put({
            path: `/devices/${id}/actions`,
            body: JSON.stringify(action),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            // The answer is empty if successful
            return;
        })
            .catch(e => {
            this.error('Command failed', e);
        });
    }
}
MieleApiImpl.BASE_URL = homey_1.default.env.API_BASE_URL;
MieleApiImpl.API_URL = `${MieleApiImpl.BASE_URL}/v1`;
MieleApiImpl.TOKEN_URL = `${MieleApiImpl.BASE_URL}/thirdparty/token`;
MieleApiImpl.AUTHORIZATION_URL = `${MieleApiImpl.BASE_URL}/thirdparty/login`;
module.exports = MieleApiImpl;
//# sourceMappingURL=MieleApi.js.map