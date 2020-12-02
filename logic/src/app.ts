import { Hue } from './plugins/hue';
import { Plugin } from './plugins/plugin';
import { DbService } from './services/DbService';
import { MqttConfig } from './interfaces/MqttConfig';
import { MqttService } from './services/MqttService';

const mqttConfig: MqttConfig = {
  login: 'nextdom',
  password: 'mosquittopassword',
  server: 'nextdom-v2'
};

const dbCredentials = {
  host: 'nextdom-db',
  database: 'nextdom',
  user: 'postgres',
  password: 'admin',
  port: 5432
}

const enabledPlugins = ['Hue'];

const availablePlugins = new Map<string, any>();
availablePlugins.set('Hue', Hue);
const dbService = DbService.getInstance();
dbService.connect(dbCredentials);
const mqttConnector = new MqttService(mqttConfig);
// Lien vers les parsers de messages
const messageParsers = new Map<string, Plugin>();

function mqttConnected(plugins: Map<string, Plugin>): void {
  // Liste des topics à inscrire
  const topicsToSubscribe: string[] = [];

  plugins.forEach((translator) => {
    topicsToSubscribe.push(translator.getSubscribeTopic());
    messageParsers.set(translator.getTopicPrefix(), translator);
  });
  mqttConnector.multipleSubscribes(topicsToSubscribe, mqttMessageParser);
}

// Gestion des messages
function mqttMessageParser(topic: string, message: Buffer): void {
  // Recherche du plugin concerné
  // TODO: Trouver une méthode qui évite un parcours à chaque fois
  messageParsers.forEach((plugin, topicPrefix) => {
    if (topic.indexOf(topicPrefix) !== -1) {
      const result = plugin.messageHandler(topic, message);
      // Test si le message a été traité
      if (result !== null) {
        dbService.save(result);
      }
    }
  });
}

/**
 * Initialise la liste des plugins
 */
function initPlugins(): Map<string, Plugin> {
  const plugins = new Map<string, Plugin>();
  enabledPlugins.forEach((pluginName) => {
    const pluginInstance: Plugin = new (availablePlugins.get(pluginName))();
    console.log('Loading plugin ' + pluginInstance.getName());
    plugins.set(pluginInstance.getName(), pluginInstance);
  });
  return plugins;
}

const translators = initPlugins();
mqttConnector.connect(() => {
  mqttConnected(translators);
});
