"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const process_1 = require("process");
class MqttService {
    constructor(config) {
        this.config = config;
        this.connected = false;
    }
    /**
     * Get connection state
     *
     * @returns Connection state
     */
    isConnected() {
        return this.connected;
    }
    /**
     * Connect to MQTT server and initialise events listeners
     *
     * @param connectionCallback Function called when connection established
     */
    connect(connectionCallback) {
        this.connected = true;
        let protocol = 'mqtt';
        if (this.config.useTls) {
            protocol = protocol + 's';
        }
        this.mqttClient = mqtt_1.default.connect(`${protocol}://${this.config.server}`, {
            username: this.config.login,
            password: this.config.password,
            port: this.config.port
        });
        this.mqttClient.on('error', (e) => {
            if (e.message.indexOf('Connection refused') >= 0) {
                console.error('MQTT: connection failed');
                process_1.exit(1);
            }
            else if (e.message.indexOf('connect ECONNREFUSED') >= 0) {
                console.error('MQTT: Server unreachable');
                process_1.exit(1);
            }
            else {
                console.error(e);
            }
        });
        this.mqttClient.on('connect', () => {
            console.log('MQTT: Connected');
            this.connected = true;
            if (connectionCallback) {
                connectionCallback();
            }
        });
        this.mqttClient.on('message', (topic, message) => {
            if (this.messageParser !== undefined) {
                this.messageParser(topic, message);
            }
        });
    }
    /**
     * Publish message on topic
     *
     * @param topic Target topic
     * @param data JSON object stringify in process
     */
    publish(topic, data) {
        this.mqttClient.publish(topic, JSON.stringify(data));
    }
    /**
     * Subscribe to topic
     *
     * @param topic Source topic
     * @param messageParser Message parser
     */
    subscribe(topic, messageParser) {
        this.mqttClient.subscribe(topic);
        this.messageParser = messageParser;
    }
    /**
     * Subscribe to multiple topics
     *
     * @param topics List of topics
     * @param messageParser Message parser
     */
    multipleSubscribes(topics, messageParser) {
        this.mqttClient.subscribe(topics);
        this.messageParser = messageParser;
    }
}
exports.MqttService = MqttService;
//# sourceMappingURL=MqttService.js.map