import { BaseModel } from './BaseModel';

export class Light extends BaseModel {
  state: boolean;
  brightness: Number;

  constructor(id: string, name: string) {
    super(id, name);
  }
};
