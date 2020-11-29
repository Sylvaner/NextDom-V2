export class MqttConfig {
  server: string = 'localhost';
  login: string = '';
  password: string = '';
  port?: number = 1883;
  useTls?: boolean = false;
};
