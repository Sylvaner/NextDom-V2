import { Hue } from './plugins/hue';
import { Plugin } from './plugins/plugin';
import { StoreService } from './services/StoreService';
import { StateService } from './services/StateService';
import { MqttConfig } from './interfaces/MqttConfig';
import { MqttService } from './services/MqttService';

const mqttConfig: MqttConfig = {
  login: 'nextdom',
  password: 'mosquittopassword',
  server: 'nextdom-v2'
};

const storeCredentials = {
  host: 'nextdom-db',
  database: 'nextdom',
  user: 'nextdom',
  password: 'admin'
}

const stateCredentials = {
  host: 'nextdom-db',
  database: 'nextdomstate',
  user: 'nextdom',
  password: 'admin'
}

const enabledPlugins = ['Hue'];
const availablePlugins = new Map<string, any>();
availablePlugins.set('Hue', Hue);

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
      plugin.messageHandler(topic, message);
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

const mqttConnector = new MqttService(mqttConfig);
const messageParsers = new Map<string, Plugin>();

const storeService = StoreService.getInstance() as StoreService;
const stateService = StateService.getInstance() as StateService;
storeService.connect(storeCredentials).then(() => {
  stateService.connect(stateCredentials).then(() => {
    const translators = initPlugins();
    mqttConnector.connect(() => {
      mqttConnected(translators);
    });
  });
});
