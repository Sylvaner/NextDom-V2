import { Plugin } from './plugins/plugin';
import { StoreDb } from './services/StoreDb';
//import { StateDb } from './services/StateDb';
import { MqttConfig } from './interfaces/MqttConfig';
import { MqttService } from './services/MqttService';

const mqttConfig: MqttConfig = {
  login: 'nextdom',
  password: 'mosquittopassword',
  server: 'localhost'
};

const storeCredentials = {
  host: 'localhost',
  database: 'nextdom',
  username: 'nextdom',
  password: 'admin',
}
/*
const stateCredentials = {
  host: 'localhost',
  database: 'nextdomstate',
  username: 'nextdom',
  password: 'admin',
}
*/
console.log('A');
const storeDb = StoreDb.getInstance();
storeDb.connect(storeCredentials).then(() => {
  storeDb.registerModels();
  console.log(StoreDb.lightModel);
  start();
})
/*
const stateDb = StateDb.getInstance();
stateDb.connect(stateCredentials);
*/
console.log('B');

import { Hue } from './plugins/hue';

console.log('c');

const enabledPlugins = ['Hue'];
const availablePlugins = new Map<string, any>();
availablePlugins.set('Hue', Hue);

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
      plugin.messageHandler(topic, message);
      // Test si le message a été traité
      //     if (result !== null) {
      //dbService.save(result);
      //   }
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

function start() {
  const translators = initPlugins();
  mqttConnector.connect(() => {
    mqttConnected(translators);
  });
}
