"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class BaseMongoDb {
    static getInstance() {
        if (BaseMongoDb.instance === undefined) {
            BaseMongoDb.instance = new BaseMongoDb();
        }
        return BaseMongoDb.instance;
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
}
exports.BaseMongoDb = BaseMongoDb;
//# sourceMappingURL=BaseMongoDb.js.map