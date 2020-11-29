import mqtt from 'mqtt';
import { exit } from 'process';
import { MqttConfig } from '../interfaces/MqttConfig';

export class MqttService {
  private config: MqttConfig;
  private connected: boolean;
  private mqttClient!: mqtt.Client;
  private messageParser!: (topic: string, data: Buffer) => void;

  constructor(config: MqttConfig) {
    this.config = config;
    this.connected = false;
  }

  /**
   * Get connection state
   *
   * @returns Connection state
   */
  public isConnected(): boolean {
    return this.connected;
  }

  /**
   * Connect to MQTT server and initialise events listeners
   *
   * @param connectionCallback Function called when connection established
   */
  public connect(connectionCallback?: () => void): void {
    this.connected = true;
    let protocol = 'mqtt';
    if (this.config.useTls) {
      protocol = protocol + 's';
    }
    this.mqttClient = mqtt.connect(`${protocol}://${this.config.server}`, {
      username: this.config.login,
      password: this.config.password,
      port: this.config.port
    });
    this.mqttClient.on('error', (e) => {
      if (e.message.indexOf('Connection refused') >= 0) {
        console.error('MQTT: connection failed');
        exit(1);
      } else if (e.message.indexOf('connect ECONNREFUSED') >= 0) {
        console.error('MQTT: Server unreachable');
        exit(1);
      } else {
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
    this.mqttClient.on('message', (topic: string, message: Buffer) => {
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
  public publish(topic: string, data: object): void {
    this.mqttClient.publish(topic, JSON.stringify(data));
  }

  /**
   * Subscribe to topic
   *
   * @param topic Source topic
   * @param messageParser Message parser
   */
  public subscribe(topic: string, messageParser: (topic: string, data: Buffer) => void): void {
    this.mqttClient.subscribe(topic);
    this.messageParser = messageParser;
  }

  /**
   * Subscribe to multiple topics
   *
   * @param topics List of topics
   * @param messageParser Message parser
   */
  public multipleSubscribes(topics: string[], messageParser: (topic: string, data: Buffer) => void): void {
    this.mqttClient.subscribe(topics);
    this.messageParser = messageParser;
  }
}