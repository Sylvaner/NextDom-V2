"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.reachable = false;
        this.capabilities = {};
    }
    addCapabilities(name, capability) {
        this.capabilities[name] = capability;
    }
}
exports.BaseModel = BaseModel;
;
//# sourceMappingURL=BaseModel.js.map