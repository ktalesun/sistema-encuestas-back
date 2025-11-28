import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { Encuesta } from '../encuesta/entities/encuesta.entity';
import { Empresa } from '../empresa/entities/empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Respuesta, Encuesta, Empresa])],
  controllers: [ReporteController],
  providers: [ReporteService],
})
export class ReporteModule {}
