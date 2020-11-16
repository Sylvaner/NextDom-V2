import mqtt from 'mqtt';
import { Hue } from './plugins/hue';
import { Plugin } from './plugins/plugin';

const mqttCredentials = {
  username: 'nextdom',
  password: 'Pdua12wy7h8b8LfQ1KT9csX3TjDlTw'
};

const enabledPlugins = ['Hue'];

const availablePlugins = {
  'Hue': Hue
};

/**
 * Initialise les connexions Mqtt
 * @param plugins Liste des plugins
 */
function initMqtt(plugins: Map<string, Plugin>): void {
  const mqttClient = mqtt.connect('mqtt://localhost', mqttCredentials);
  // Liste des topics à inscrire
  const topicsToSubscribe = [];
  // Lien vers les parsers de messages
  const messageHandlers = new Map<string, Plugin>();

  plugins.forEach((translator) => {
    topicsToSubscribe.push(translator.getSubscribeTopic());
    messageHandlers.set(translator.getTopicPrefix(), translator);
  });

  // Inscriptions aux topics à la connexion
  mqttClient.on('connect', () => {
    console.log('Connected to MQTT');
    mqttClient.subscribe(topicsToSubscribe);
  });

  // Gestion des messages
  mqttClient.on('message', (topic: string, message: Buffer) => {
    // Recherche du plugin concerné
    // TODO: Trouver une méthode qui évite un parcours à chaque fois
    messageHandlers.forEach((plugin, topicPrefix) => {
      if (topic.indexOf(topicPrefix) !== -1) {
        const result = plugin.messageHandler(topic, message);
        // Test si le message a été traité
        if (result !== null) {
          console.log(result);
        }
      }
    })
  });
}

/**
 * Initialise la liste des plugins
 */
function initPlugins(): Map<string, Plugin> {
  const plugins = new Map<string, Plugin>();
  enabledPlugins.forEach(function (pluginName) {
    const pluginInstance: Plugin = new availablePlugins[pluginName]();
    console.log('Loading plugin ' + pluginInstance.getName());
    plugins.set(pluginInstance.getName(), pluginInstance);
  });
  return plugins;
}

const translators = initPlugins();
initMqtt(translators);