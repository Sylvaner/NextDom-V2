import { MqttFormat } from '../interfaces/MqttFormat';

export interface IoTObject {
  id: string
  name: string
}

export class BaseModel implements IoTObject {
  id: string;
  name: string;
  reachable: boolean;
  reachableData?: MqttFormat;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.reachable = false;
  }
};
