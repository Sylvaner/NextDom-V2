import { BaseModel } from './BaseModel';
import { MqttFormat } from '../interfaces/MqttFormat';

export class Light extends BaseModel {
  state?: boolean;
  stateData?: MqttFormat;
  brightness?: number;
  brightnessData?: MqttFormat;

  constructor(id: string, name: string) {
    super(id, name);
  }
};
