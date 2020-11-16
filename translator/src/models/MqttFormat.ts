export class MqttFormat {
  topic: string;
  path: string;
  format: string;

  constructor(topic: string, path: string, format: string) {
    this.topic = topic;
    this.path = path;
    this.format = format;
  }
}