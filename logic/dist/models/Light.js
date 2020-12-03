"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightSchema = void 0;
const mongoose_1 = require("mongoose");
//import { StoreDb } from '../services/StoreDb';
//import { MqttAccess } from './MqttAccess';
console.log('a');
exports.LightSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    plugin: { type: String, required: true },
    name: { type: String, required: true },
    capabilities: { type: Array, required: false }
});
//export const Light = StoreDb.getInstance().connection.registerModel('Light', LightSchema);
// export const Light = StoreDb.getInstance().registerModel<LightInterface>('Light', LightSchema)
//export const Light = model('Light', ightSchema);
//# sourceMappingURL=Light.js.map