import { BaseModel } from './BaseModel';
import ObjectState from './ObjectState';

interface LightState extends ObjectState {
  state?: boolean,
  brightness?: number,
  reachable?: boolean
}

export class Light extends BaseModel {
  public state: LightState;

  constructor(id: string, name: string) {
    super(id, name);
    this.state = { objectId: id }
  }
};
