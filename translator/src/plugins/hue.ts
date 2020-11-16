/**
 * Plugin pour la gestion des objets Philips Hue
 */
import { Plugin } from './plugin';
import { IoTObject } from '../models/BaseModel';
import { Light } from '../models/light';

export class Hue implements Plugin {
  cache = {
    lights: {}
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

  messageHandler(topic: string, message: Buffer): IoTObject {
    // Le nom de l'objet se trouve dans la topic
    const lightState: RegExp = /^hue\/status\/lights\/(.*)$/;
    const regExpResult = lightState.exec(topic);
    // Si la regex a matché
    if (regExpResult !== null) {
      const lightName = regExpResult[1];
      const lightData = JSON.parse(message.toString());
      // Création de l'objet en cache
      if (!this.cache.lights.hasOwnProperty(lightName)) {
        this.cache.lights[lightName] = new Light('hue-' + lightName, lightName);
      }
      // Mise à jour des informations
      this.cache.lights[lightName].state = lightData.hue_state.on;
      this.cache.lights[lightName].brightness = lightData.hue_state.bri;
      this.cache.lights[lightName].reachable = lightData.hue_state.reachable;
      return this.cache.lights[lightName];
    }
    return null;
  }
}