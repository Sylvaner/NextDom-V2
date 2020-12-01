import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LightModule } from './light/light.module';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Light } from './light/light.entity';

console.log(__dirname + '/**/*.entity{.ts,.js}');
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    LightModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
