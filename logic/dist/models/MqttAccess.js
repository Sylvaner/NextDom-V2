"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttAccess = void 0;
const mongoose_1 = require("mongoose");
const MqttAccessSchema = new mongoose_1.Schema({
    topic: { type: String, required: true },
    path: { type: String, required: true },
    format: { type: Object, required: false },
});
exports.MqttAccess = mongoose_1.model('MqttAccess', MqttAccessSchema);
//# sourceMappingURL=MqttAccess.js.map