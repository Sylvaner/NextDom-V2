import { MqttAccessDesc } from '../interfaces/MqttAccessDesc';

export interface IoTObject {
  id: string
  name: string
}

export interface CapabilityAccessor {
  get?: MqttAccessDesc,
  set?: MqttAccessDesc
}

export interface Capability {
  [capabilityName: string]: CapabilityAccessor
}

export class BaseModel implements IoTObject {
  id: string;
  name: string;
  reachable: boolean;
  capabilities: Capability;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.reachable = false;
    this.capabilities = {};
  }

  public addCapabilities(name: string, capability: CapabilityAccessor) {
    this.capabilities[name] = capability;
  }
};
