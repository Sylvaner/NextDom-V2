"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hue = void 0;
//import { LightSchema } from '../models/Light';
//import { IoTObject } from '../models/BaseModel';
//import { Light } from '../models/Light';
const StoreDb_1 = require("../services/StoreDb");
class Hue {
    constructor() {
        this.cache = {
        //lights: new Map<string, Light>()
        };
    }
    getCache() {
        return this.cache;
    }
    getName() {
        return 'Philips Hue';
    }
    getTopicPrefix() {
        return 'hue';
    }
    getSubscribeTopic() {
        return 'hue/status/lights/#';
    }
    messageHandler(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Le nom de l'objet se trouve dans la topic
            const lightState = /^hue\/status\/lights\/(.*)$/;
            const regExpResult = lightState.exec(topic);
            // Si la regex a matché
            if (regExpResult !== null) {
                const lightName = regExpResult[1];
                //const lightData = JSON.parse(message.toString());
                //let light;
                // Création de l'objet en cache
                //      if (!this.cache.lights.hasOwnProperty(lightName)) {
                //const dataTopic = 'hue/status/lights/' + lightName;
                /*
                const light = await Light.create({
                  id: 'test',
                  plugin: 'hue',
                  name: lightName,
                  capabilities: []
                });
                console.log(light);
                light.save();
                */
                console.log(StoreDb_1.Light);
                const light = new StoreDb_1.Light({
                    id: 'test',
                    plugin: 'hue',
                    name: lightName,
                    capabilities: []
                });
                console.log(light);
                console.log(lightName);
                light.save();
                /*
                light = new Light('hue-' + lightName, lightName);
                light.addCapabilities('reachable', { get: { topic: dataTopic, path: 'hue_state.reachable' } });
                light.addCapabilities('state', { get: { topic: dataTopic, path: 'hue_state.on' } });
                light.addCapabilities('brightness', { get: { topic: dataTopic, path: 'hue_state.bri' } });
                */
            }
            else {
                //        light = this.cache.lights.get(lightName);
            }
            // Mise à jour des informations
            /*
            if (light !== undefined) {
              light.state = lightData.hue_state.on;
              light.brightness = lightData.hue_state.bri;
              light.reachable = lightData.hue_state.reachable;
              this.cache.lights.set(lightName, light);
              return light;
            }
            */
            //  }
            //return null;
        });
    }
}
exports.Hue = Hue;
//# sourceMappingURL=hue.js.map