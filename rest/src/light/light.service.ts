import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Light } from './light.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class LightService extends TypeOrmCrudService<Light> {
  constructor(@InjectRepository(Light) light) {
    super(light);
  }
}
