import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestaService } from './respuesta.service';
import { RespuestaController } from './respuesta.controller';
import { Respuesta } from './entities/respuesta.entity';
import { Encuesta } from '../encuesta/entities/encuesta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Respuesta, Encuesta])],
  controllers: [RespuestaController],
  providers: [RespuestaService],
  exports: [RespuestaService],
})
export class RespuestaModule {}
