import {Entity, model, property} from '@loopback/repository';

@model()
export class Light extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'object',
    required: true,
  })
  data: object;


  constructor(data?: Partial<Light>) {
    super(data);
  }
}

export interface LightRelations {
  // describe navigational properties here
}

export type LightWithRelations = Light & LightRelations;
