/**
 * Plugin pour la gestion des objets Philips Hue
 */
import { Plugin } from './plugin';
import { IoTObject } from '../models/BaseModel';
import { Light } from '../models/Light';

export class Hue implements Plugin {
  cache = {
    lights: new Map<string, Light>()
  }

  getCache() {
    return this.cache;
  }

  getName(): string {
    return 'Philips Hue';
  }

  getTopicPrefix(): string {
    return 'hue';
  }

  getSubscribeTopic(): string {
    return 'hue/status/lights/#';
  }

  messageHandler(topic: string, message: Buffer): IoTObject | null {
    // Le nom de l'objet se trouve dans la topic
    const lightState: RegExp = /^hue\/status\/lights\/(.*)$/;
    const regExpResult = lightState.exec(topic);
    // Si la regex a matché
    if (regExpResult !== null) {
      const lightName = regExpResult[1];
      const lightData = JSON.parse(message.toString());
      let light;
      // Création de l'objet en cache
      if (!this.cache.lights.hasOwnProperty(lightName)) {
        const dataTopic = 'hue/status/lights/' + lightName;
        light = new Light('hue-' + lightName, lightName);
        light.addCapabilities('reachable', { get: { topic: dataTopic, path: 'hue_state.reachable' } });
        light.addCapabilities('state', { get: { topic: dataTopic, path: 'hue_state.on' } });
        light.addCapabilities('brightness', { get: { topic: dataTopic, path: 'hue_state.bri' } });
      }
      else {
        light = this.cache.lights.get(lightName);
      }
      // Mise à jour des informations
      if (light !== undefined) {
        light.state = lightData.hue_state.on;
        light.brightness = lightData.hue_state.bri;
        light.reachable = lightData.hue_state.reachable;
        this.cache.lights.set(lightName, light);
        return light;
      }
    }
    return null;
  }
}