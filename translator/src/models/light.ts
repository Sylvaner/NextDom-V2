import { BaseModel } from './BaseModel';
import { MqttFormat } from './MqttFormat';

export class Light extends BaseModel {
  state: boolean;
  stateData: MqttFormat;
  brightness: Number;
  brightnessData: MqttFormat;

  constructor(id: string, name: string) {
    super(id, name);
  }
};
