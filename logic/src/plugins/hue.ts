/**
 * Plugin pour la gestion des objets Philips Hue
 */
import { Plugin } from './plugin';
import { Light } from '../models/Light';
import { StoreService } from '../services/StoreService';
import { StateService } from '../services/StateService';

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

  async messageHandler(topic: string, message: Buffer) {
    // Le nom de l'objet se trouve dans la topic
    const lightState: RegExp = /^hue\/status\/lights\/(.*)$/;
    const regExpResult = lightState.exec(topic);
    // Si la regex a matché
    if (regExpResult !== null) {
      const lightName = regExpResult[1];
      const lightData = JSON.parse(message.toString());
      let light: Light;
      const lightId = 'hue-' + lightName;
      // Création de l'objet en cache
      if (!this.cache.lights.has(lightId)) {
        light = new Light(lightId, lightName);
        const objectFromDb = await StoreService.getInstance().getObject('light', lightId);
        if (objectFromDb !== null) {
          light.data = objectFromDb;
        }
        else {
          const dataTopic = 'hue/status/lights/' + lightName;
          light.addCapabilities('reachable', { get: { topic: dataTopic, path: 'hue_state.reachable' } });
          light.addCapabilities('state', { get: { topic: dataTopic, path: 'hue_state.on' } });
          light.addCapabilities('brightness', { get: { topic: dataTopic, path: 'hue_state.bri' } });
          light.data = await StoreService.getInstance().save(light.type, light.data);
        }
      }
      else {
        // Récupération de l'objet depuis le cache
        light = this.cache.lights.get(lightId) as Light;
      }
      // Mise à jour des informations
      if (light !== undefined) {
        light.state.state = lightData.hue_state.on;
        light.state.brightness = lightData.hue_state.bri;
        light.state.reachable = lightData.hue_state.reachable;
        light.state = await StateService.getInstance().save(lightId, light.state);
        this.cache.lights.set(lightId, light);
      }
    }
  }
}