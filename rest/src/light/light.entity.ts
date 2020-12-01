import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

interface LightState {
  name: string,
  reachable: boolean,
  state: boolean,
  brightness: number
}

@Entity({ name: 'light' })
export class Light {
  @PrimaryColumn()
  @ApiProperty({
    name: 'id',
    type: 'string',
    description: 'ID of the light',
    example: "hue-Light"
  })
  id: string;

  @Column({ name: 'data', type: 'json' })
  @ApiProperty({
    name: 'data',
    type: 'json',
    description: 'All states',
    example: {
      "name": "Light name",
      "reachable": true,
      "state": true,
      "brightness": 75
    }
  })
  data: LightState
}