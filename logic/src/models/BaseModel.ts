import { MqttAccessDesc } from '../interfaces/MqttAccessDesc';
import ObjectState from './ObjectState';

export interface IoTObject {
  _id?: string
  id: string
  name: string
  capabilities: Capabilities;
}

export interface CapabilityAccessor {
  get?: MqttAccessDesc,
  set?: MqttAccessDesc
}

export interface Capabilities {
  [capabilityName: string]: CapabilityAccessor
}

export class BaseModel {
  data: IoTObject;
  state: ObjectState;
  type: string;

  constructor(id: string, name: string) {
    this.data = {
      id,
      name,
      capabilities: {}
    };
    this.state = { objectId: id };
    this.type = 'light';
  }

  public addCapabilities(name: string, capability: CapabilityAccessor) {
    this.data.capabilities[name] = capability;
  }
};
