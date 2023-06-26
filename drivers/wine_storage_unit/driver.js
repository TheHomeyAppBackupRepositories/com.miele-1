"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("../../lib/drivers/refrigeration/driver"));
class MieleWineStorageUnitDriver extends driver_1.default {
    filterOnType(type) {
        const groupTypes = [
            32,
            33,
            34,
            68
        ];
        return groupTypes.includes(type);
    }
}
module.exports = MieleWineStorageUnitDriver;
//# sourceMappingURL=driver.js.map