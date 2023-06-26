"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.temperatureZoneToCapability = exports.temperatureZoneToName = exports.tempZoneToSelector = exports.TempZoneSelector = exports.temperatureToApi = exports.temperatureFromApi = exports.minutesTime = exports.printTime = exports.SabbathMode = exports.AmbientLightColor = exports.VentilationStep = exports.LightState = exports.ProcessAction = exports.enumStatusToString = exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["OFF"] = 1] = "OFF";
    Status[Status["ON"] = 2] = "ON";
    Status[Status["PROGRAMMED"] = 3] = "PROGRAMMED";
    Status[Status["PROGRAMMED_WAITING_TO_START"] = 4] = "PROGRAMMED_WAITING_TO_START";
    Status[Status["RUNNING"] = 5] = "RUNNING";
    Status[Status["PAUSE"] = 6] = "PAUSE";
    Status[Status["END_PROGRAMMED"] = 7] = "END_PROGRAMMED";
    Status[Status["FAILURE"] = 8] = "FAILURE";
    Status[Status["PROGRAMME_INTERRUPTED"] = 9] = "PROGRAMME_INTERRUPTED";
    Status[Status["IDLE"] = 10] = "IDLE";
    Status[Status["RINSE_HOLD"] = 11] = "RINSE_HOLD";
    Status[Status["SERVICE"] = 12] = "SERVICE";
    Status[Status["SUPERFREEZING"] = 13] = "SUPERFREEZING";
    Status[Status["SUPERCOOLING"] = 14] = "SUPERCOOLING";
    Status[Status["SUPERHEATING"] = 15] = "SUPERHEATING";
    Status[Status["LOCKED"] = 145] = "LOCKED";
    Status[Status["SUPERCOOLING_SUPERFREEZING"] = 146] = "SUPERCOOLING_SUPERFREEZING";
    Status[Status["NOT_CONNECTED"] = 255] = "NOT_CONNECTED";
})(Status = exports.Status || (exports.Status = {}));
function enumStatusToString(status) {
    switch (status) {
        case Status.OFF:
            return 'Off';
        case Status.ON:
            return 'On';
        case Status.PROGRAMMED:
            return 'Programme selected';
        case Status.PROGRAMMED_WAITING_TO_START:
            return 'Waiting to start';
        case Status.RUNNING:
            return 'In use';
        case Status.PAUSE:
            return 'Pause';
        case Status.END_PROGRAMMED:
            return 'Finished';
        case Status.FAILURE:
            return 'Fault';
        case Status.PROGRAMME_INTERRUPTED:
            return 'Cancelled';
        case Status.IDLE:
            return 'Idle';
        case Status.RINSE_HOLD:
            return 'Rinse hold';
        case Status.SERVICE:
            return 'Settings';
        case Status.SUPERFREEZING:
            return 'Super freeze';
        case Status.SUPERCOOLING:
            return 'Super cool';
        case Status.SUPERHEATING:
            return 'Super heat';
        case Status.LOCKED:
            return 'Locked';
        case Status.SUPERCOOLING_SUPERFREEZING:
            return 'Super freeze/cool';
        case Status.NOT_CONNECTED:
            return 'Not connected';
    }
}
exports.enumStatusToString = enumStatusToString;
var ProcessAction;
(function (ProcessAction) {
    ProcessAction[ProcessAction["START"] = 1] = "START";
    ProcessAction[ProcessAction["STOP"] = 2] = "STOP";
    ProcessAction[ProcessAction["PAUSE"] = 3] = "PAUSE";
    ProcessAction[ProcessAction["START_SUPERFREEZING"] = 4] = "START_SUPERFREEZING";
    ProcessAction[ProcessAction["STOP_SUPERFREEZING"] = 5] = "STOP_SUPERFREEZING";
    ProcessAction[ProcessAction["START_SUPERCOOLING"] = 6] = "START_SUPERCOOLING";
    ProcessAction[ProcessAction["STOP_SUPERCOOLING"] = 7] = "STOP_SUPERCOOLING";
})(ProcessAction = exports.ProcessAction || (exports.ProcessAction = {}));
var LightState;
(function (LightState) {
    LightState[LightState["Enable"] = 1] = "Enable";
    LightState[LightState["Disable"] = 2] = "Disable";
})(LightState = exports.LightState || (exports.LightState = {}));
var VentilationStep;
(function (VentilationStep) {
    VentilationStep[VentilationStep["Step1"] = 1] = "Step1";
    VentilationStep[VentilationStep["Step2"] = 2] = "Step2";
    VentilationStep[VentilationStep["Step3"] = 3] = "Step3";
    VentilationStep[VentilationStep["Step4"] = 4] = "Step4";
})(VentilationStep = exports.VentilationStep || (exports.VentilationStep = {}));
var AmbientLightColor;
(function (AmbientLightColor) {
    AmbientLightColor[AmbientLightColor["white"] = 0] = "white";
    AmbientLightColor[AmbientLightColor["blue"] = 1] = "blue";
    AmbientLightColor[AmbientLightColor["red"] = 2] = "red";
    AmbientLightColor[AmbientLightColor["yellow"] = 3] = "yellow";
    AmbientLightColor[AmbientLightColor["orange"] = 4] = "orange";
    AmbientLightColor[AmbientLightColor["green"] = 5] = "green";
    AmbientLightColor[AmbientLightColor["pink"] = 6] = "pink";
    AmbientLightColor[AmbientLightColor["purple"] = 7] = "purple";
    AmbientLightColor[AmbientLightColor["turquoise"] = 8] = "turquoise";
})(AmbientLightColor = exports.AmbientLightColor || (exports.AmbientLightColor = {}));
var SabbathMode;
(function (SabbathMode) {
    SabbathMode[SabbathMode["Normal"] = 0] = "Normal";
    SabbathMode[SabbathMode["Sabbath"] = 1] = "Sabbath";
})(SabbathMode = exports.SabbathMode || (exports.SabbathMode = {}));
function printTime(time) {
    const hours = time[0];
    const minutes = time[1];
    const hoursPadded = String(hours).padStart(2, '0');
    const minutesPadded = String(minutes).padStart(2, '0');
    return hoursPadded + ':' + minutesPadded;
}
exports.printTime = printTime;
function minutesTime(time) {
    return time[0] * 60 + time[1];
}
exports.minutesTime = minutesTime;
function temperatureFromApi(temperature) {
    // Check for the Miele API invalid value indicator
    if (temperature === -32768 || (typeof temperature !== 'number' && typeof temperature !== 'string'))
        return NaN;
    return Number(temperature) / 100;
}
exports.temperatureFromApi = temperatureFromApi;
function temperatureToApi(temperature) {
    return temperature * 100;
}
exports.temperatureToApi = temperatureToApi;
var TempZoneSelector;
(function (TempZoneSelector) {
    TempZoneSelector[TempZoneSelector["FRIDGE"] = -2] = "FRIDGE";
    TempZoneSelector[TempZoneSelector["FREEZER"] = -1] = "FREEZER";
    TempZoneSelector[TempZoneSelector["WINE"] = 0] = "WINE";
    TempZoneSelector[TempZoneSelector["ZONE1"] = 1] = "ZONE1";
    TempZoneSelector[TempZoneSelector["ZONE2"] = 2] = "ZONE2";
    TempZoneSelector[TempZoneSelector["ZONE3"] = 3] = "ZONE3";
    TempZoneSelector[TempZoneSelector["ZONE4"] = 4] = "ZONE4";
    TempZoneSelector[TempZoneSelector["ZONE5"] = 5] = "ZONE5";
    TempZoneSelector[TempZoneSelector["ZONE6"] = 6] = "ZONE6";
})(TempZoneSelector = exports.TempZoneSelector || (exports.TempZoneSelector = {}));
function tempZoneToSelector(type, zone) {
    switch (type) {
        case 19:
            if (zone === 1) {
                return TempZoneSelector.FRIDGE;
            }
            break;
        case 20:
            if (zone === 1) {
                return TempZoneSelector.FREEZER;
            }
            break;
        case 21:
            switch (zone) {
                case 1:
                    return TempZoneSelector.FRIDGE;
                case 2:
                    return TempZoneSelector.FREEZER;
            }
            break;
        case 32:
        case 33:
        case 34:
            if (zone === 1) {
                return TempZoneSelector.WINE;
            }
            break;
        case 68:
            switch (zone) {
                case 1:
                    return TempZoneSelector.FREEZER;
                case 2:
                    return TempZoneSelector.WINE;
            }
            break;
    }
    return zone;
}
exports.tempZoneToSelector = tempZoneToSelector;
function temperatureZoneToName(selector) {
    switch (selector) {
        case TempZoneSelector.FRIDGE:
            return {
                measure: {
                    en: 'Fridge temperature',
                    nl: 'Koelkast temperatuur',
                    de: 'Kühlschrank Temperatur'
                },
                target: {
                    en: 'Fridge target',
                    nl: 'Koelkast doel',
                    de: 'Kühlschrank Ziel'
                },
            };
        case TempZoneSelector.FREEZER:
            return {
                measure: {
                    en: 'Freezer temperature',
                    nl: 'Vriezer temperatuur',
                    de: 'Gefrierschrank Temperatur'
                },
                target: {
                    en: 'Freezer target',
                    nl: 'Vriezer doel',
                    de: 'Gefrierschrank Ziel'
                },
            };
        case TempZoneSelector.WINE:
            return {
                measure: {
                    en: 'Wine storage temperature',
                    nl: 'Wijnopslag temperatuur',
                    de: 'Weinlager Temperatur'
                },
                target: {
                    en: 'Wine storage target',
                    nl: 'Wijnopslag doel',
                    de: 'Weinlager Ziel'
                },
            };
        default:
            return {
                measure: {
                    en: `Zone ${selector} temperature`,
                    nl: `Zone ${selector} temperatuur`,
                    de: `Zone ${selector} Temperatur`
                },
                target: {
                    en: `Zone ${selector} target`,
                    nl: `Zone ${selector} doel`,
                    de: `Zone ${selector} Ziel`
                },
            };
    }
}
exports.temperatureZoneToName = temperatureZoneToName;
function temperatureZoneToCapability(type, zone) {
    const selector = tempZoneToSelector(type, zone);
    switch (selector) {
        case TempZoneSelector.FRIDGE:
            return 'fridge';
        case TempZoneSelector.FREEZER:
            return 'freezer';
        case TempZoneSelector.WINE:
            return 'wine';
        default:
            return selector.toString();
    }
}
exports.temperatureZoneToCapability = temperatureZoneToCapability;
//# sourceMappingURL=MieleConstants.js.map