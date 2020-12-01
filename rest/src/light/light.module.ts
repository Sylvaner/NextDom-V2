import { Module } from '@nestjs/common';
import { LightService } from './light.service';
import { LightController } from './light.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Light } from './light.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Light])],
  providers: [LightService],
  controllers: [LightController]
})
export class LightModule { }
