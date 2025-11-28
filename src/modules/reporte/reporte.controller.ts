import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ReporteService, EstadisticasEncuesta } from './reporte.service';
import { FiltrosReporteDto } from './dto/filtros-reporte.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReporteController {
  constructor(private readonly reporteService: ReporteService) {}

  @Get('estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas y tabulación de encuestas (HU8)',
    description: 'Retorna tabulación y estadísticas con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas generadas exitosamente',
  })
  @ApiQuery({ name: 'empresa_id', required: false, type: String })
  @ApiQuery({ name: 'encuesta_id', required: false, type: String })
  @ApiQuery({ name: 'fecha_inicio', required: false, type: String })
  @ApiQuery({ name: 'fecha_fin', required: false, type: String })
  obtenerEstadisticas(
    @Query() filtros: FiltrosReporteDto,
  ): Promise<EstadisticasEncuesta[]> {
    return this.reporteService.obtenerEstadisticas(filtros);
  }

  @Get('exportar/excel')
  @ApiOperation({
    summary: 'Exportar reporte a Excel (HU8)',
    description: 'Genera un archivo Excel con las estadísticas de encuestas',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo Excel generado',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({ name: 'empresa_id', required: false, type: String })
  @ApiQuery({ name: 'encuesta_id', required: false, type: String })
  @ApiQuery({ name: 'fecha_inicio', required: false, type: String })
  @ApiQuery({ name: 'fecha_fin', required: false, type: String })
  async exportarExcel(
    @Query() filtros: FiltrosReporteDto,
    @Res() res: Response,
  ) {
    const buffer = await this.reporteService.exportarExcel(filtros);

    const filename = `reporte_encuestas_${new Date().toISOString().split('T')[0]}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HttpStatus.OK).send(buffer);
  }

  @Get('exportar/pdf')
  @ApiOperation({
    summary: 'Exportar reporte a PDF (HU8)',
    description: 'Genera un archivo PDF con las estadísticas de encuestas',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF generado',
    content: {
      'application/pdf': {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({ name: 'empresa_id', required: false, type: String })
  @ApiQuery({ name: 'encuesta_id', required: false, type: String })
  @ApiQuery({ name: 'fecha_inicio', required: false, type: String })
  @ApiQuery({ name: 'fecha_fin', required: false, type: String })
  async exportarPDF(@Query() filtros: FiltrosReporteDto, @Res() res: Response) {
    const buffer = await this.reporteService.exportarPDF(filtros);

    const filename = `reporte_encuestas_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HttpStatus.OK).send(buffer);
  }
}
