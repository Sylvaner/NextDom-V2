"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StoreDb_1 = require("./services/StoreDb");
const MqttService_1 = require("./services/MqttService");
const mqttConfig = {
    login: 'nextdom',
    password: 'mosquittopassword',
    server: 'localhost'
};
const storeCredentials = {
    host: 'localhost',
    database: 'nextdom',
    username: 'nextdom',
    password: 'admin',
};
/*
const stateCredentials = {
  host: 'localhost',
  database: 'nextdomstate',
  username: 'nextdom',
  password: 'admin',
}
*/
console.log('A');
const storeDb = StoreDb_1.StoreDb.getInstance();
storeDb.connect(storeCredentials).then(() => {
    storeDb.registerModels();
    console.log(StoreDb_1.StoreDb.lightModel);
    start();
});
/*
const stateDb = StateDb.getInstance();
stateDb.connect(stateCredentials);
*/
console.log('B');
const hue_1 = require("./plugins/hue");
console.log('c');
const enabledPlugins = ['Hue'];
const availablePlugins = new Map();
availablePlugins.set('Hue', hue_1.Hue);
const mqttConnector = new MqttService_1.MqttService(mqttConfig);
// Lien vers les parsers de messages
const messageParsers = new Map();
function mqttConnected(plugins) {
    // Liste des topics à inscrire
    const topicsToSubscribe = [];
    plugins.forEach((translator) => {
        topicsToSubscribe.push(translator.getSubscribeTopic());
        messageParsers.set(translator.getTopicPrefix(), translator);
    });
    mqttConnector.multipleSubscribes(topicsToSubscribe, mqttMessageParser);
}
// Gestion des messages
function mqttMessageParser(topic, message) {
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
function initPlugins() {
    const plugins = new Map();
    enabledPlugins.forEach((pluginName) => {
        const pluginInstance = new (availablePlugins.get(pluginName))();
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
//# sourceMappingURL=app.js.map