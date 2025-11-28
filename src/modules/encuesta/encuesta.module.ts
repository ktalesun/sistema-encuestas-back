import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EncuestaService } from './encuesta.service';
import { EncuestaController } from './encuesta.controller';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Encuesta, Pregunta])],
  controllers: [EncuestaController],
  providers: [EncuestaService],
  exports: [EncuestaService],
})
export class EncuestaModule {}
