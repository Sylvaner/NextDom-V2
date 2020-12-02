type MqttFormat = 'raw' | 'json';

export class MqttAccessDesc {
  topic: string = '';
  path: string = '';
  format?: MqttFormat = 'raw';
}