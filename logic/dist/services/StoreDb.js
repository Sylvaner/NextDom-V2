"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Light = exports.StoreDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Light_1 = require("../models/Light");
class StoreDb {
    static getInstance() {
        if (StoreDb.instance === undefined) {
            StoreDb.instance = new StoreDb();
        }
        return StoreDb.instance;
    }
    connect(credentials) {
        console.log('DEB');
        return new Promise((resolve) => {
            mongoose_1.default.createConnection(`mongodb://${credentials.username}:${credentials.password}@${credentials.host}/${credentials.database}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err, conn) => {
                this.connection = conn;
                console.log(`DB (${credentials.database}): Connected`);
                resolve(this.connection);
            });
        });
    }
    registerModels() {
        console.log('REGISTER');
        StoreDb.lightModel = this.connection.model('Light', Light_1.LightSchema);
    }
}
exports.StoreDb = StoreDb;
exports.Light = StoreDb.lightModel;
//# sourceMappingURL=StoreDb.js.map