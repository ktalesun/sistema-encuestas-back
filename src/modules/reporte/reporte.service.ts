/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Respuesta } from '../respuesta/entities/respuesta.entity';
import { Encuesta } from '../encuesta/entities/encuesta.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { FiltrosReporteDto } from './dto/filtros-reporte.dto';
import * as ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

interface TabulacionPregunta {
  pregunta_id: string;
  pregunta_texto: string;
  tipo: string;
  respuestas: Array<{
    valor: string | number;
    frecuencia: number;
    porcentaje: number;
  }>;
  total_respuestas: number;
}

export interface EstadisticasEncuesta {
  encuesta_id: string;
  titulo: string;
  total_respuestas: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  tasa_respuesta?: number;
  preguntas: TabulacionPregunta[];
}

@Injectable()
export class ReporteService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestaRepository: Repository<Respuesta>,
    @InjectRepository(Encuesta)
    private readonly encuestaRepository: Repository<Encuesta>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async obtenerEstadisticas(
    filtros: FiltrosReporteDto,
  ): Promise<EstadisticasEncuesta[]> {
    const whereConditions: any = {};

    if (filtros.encuesta_id) {
      whereConditions.encuesta_id = filtros.encuesta_id;
    }

    if (filtros.fecha_inicio && filtros.fecha_fin) {
      whereConditions.created_at = Between(
        new Date(filtros.fecha_inicio),
        new Date(filtros.fecha_fin),
      );
    } else if (filtros.fecha_inicio) {
      whereConditions.created_at = MoreThanOrEqual(
        new Date(filtros.fecha_inicio),
      );
    } else if (filtros.fecha_fin) {
      whereConditions.created_at = LessThanOrEqual(new Date(filtros.fecha_fin));
    }

    const respuestas = await this.respuestaRepository.find({
      where: whereConditions,
      relations: ['encuesta', 'encuesta.preguntas', 'encuesta.empresa'],
    });

    // Filtrar por empresa si es necesario
    const respuestasFiltradas = filtros.empresa_id
      ? respuestas.filter(
          (r) => r.encuesta?.empresa?.id_empresa === filtros.empresa_id,
        )
      : respuestas;

    // Agrupar por encuesta
    const encuestasMap = new Map<string, Respuesta[]>();
    for (const respuesta of respuestasFiltradas) {
      if (!respuesta.encuesta) continue;
      const encuestaId = respuesta.encuesta.id_encuesta;
      if (!encuestasMap.has(encuestaId)) {
        encuestasMap.set(encuestaId, []);
      }
      encuestasMap.get(encuestaId)!.push(respuesta);
    }

    // Generar estadísticas por encuesta
    const estadisticas: EstadisticasEncuesta[] = [];

    for (const [_encuestaId, respuestasEncuesta] of encuestasMap.entries()) {
      const encuesta = respuestasEncuesta[0].encuesta;
      if (!encuesta) continue;

      const tabulacionPreguntas = this.tabularPreguntas(
        encuesta,
        respuestasEncuesta,
      );

      estadisticas.push({
        encuesta_id: encuesta.id_encuesta,
        titulo: encuesta.titulo,
        total_respuestas: respuestasEncuesta.length,
        fecha_inicio: encuesta.fecha_inicio,
        fecha_fin: encuesta.fecha_fin,
        preguntas: tabulacionPreguntas,
      });
    }

    return estadisticas;
  }

  private tabularPreguntas(
    encuesta: Encuesta,
    respuestas: Respuesta[],
  ): TabulacionPregunta[] {
    const preguntas = encuesta.preguntas || [];
    const tabulacion: TabulacionPregunta[] = [];

    for (const pregunta of preguntas) {
      const respuestasPregunta: any[] = [];

      // Recopilar todas las respuestas para esta pregunta
      for (const respuesta of respuestas) {
        const respuestasJson = respuesta.respuestas_json as any;
        
        if (respuestasJson) {
          // Soportar tanto formato objeto como array
          if (Array.isArray(respuestasJson)) {
            // Formato array: [{ pregunta_id: "xxx", respuesta: "valor" }]
            const respPregunta = respuestasJson.find(
              (r: any) => r.pregunta_id === pregunta.id_pregunta,
            );
            if (respPregunta?.respuesta !== undefined) {
              respuestasPregunta.push(respPregunta.respuesta);
            }
          } else if (typeof respuestasJson === 'object') {
            // Formato objeto: { "pregunta_id": "valor" }
            const valor = respuestasJson[pregunta.id_pregunta];
            if (valor !== undefined && valor !== null) {
              respuestasPregunta.push(valor);
            }
          }
        }
      }

      // Calcular frecuencias
      const frecuencias = new Map<string, number>();
      for (const valor of respuestasPregunta) {
        const key = String(valor);
        frecuencias.set(key, (frecuencias.get(key) || 0) + 1);
      }

      const totalRespuestas = respuestasPregunta.length;
      const respuestasAgrupadas = Array.from(frecuencias.entries()).map(
        ([valor, frecuencia]) => ({
          valor: Number.isNaN(Number(valor)) ? valor : Number(valor),
          frecuencia,
          porcentaje:
            totalRespuestas > 0
              ? Math.round((frecuencia / totalRespuestas) * 100 * 100) / 100
              : 0,
        }),
      );

      // Ordenar por frecuencia descendente
      respuestasAgrupadas.sort((a, b) => b.frecuencia - a.frecuencia);

      tabulacion.push({
        pregunta_id: pregunta.id_pregunta,
        pregunta_texto: pregunta.texto,
        tipo: pregunta.tipo,
        respuestas: respuestasAgrupadas,
        total_respuestas: totalRespuestas,
      });
    }

    return tabulacion;
  }

  async exportarExcel(filtros: FiltrosReporteDto): Promise<ExcelJS.Buffer> {
    const estadisticas = await this.obtenerEstadisticas(filtros);

    if (estadisticas.length === 0) {
      throw new NotFoundException('No hay datos para exportar');
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema de Encuestas';
    workbook.created = new Date();

    // Crear una hoja por encuesta
    for (const stats of estadisticas) {
      const worksheet = workbook.addWorksheet(
        this.sanitizeSheetName(stats.titulo),
      );

      // Título y metadata
      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').value = stats.titulo;
      worksheet.getCell('A1').font = { size: 16, bold: true };
      worksheet.getCell('A1').alignment = { horizontal: 'center' };

      worksheet.getCell('A2').value = 'Total de respuestas:';
      worksheet.getCell('B2').value = stats.total_respuestas;
      worksheet.getCell('A3').value = 'Fecha inicio:';
      worksheet.getCell('B3').value = stats.fecha_inicio;
      worksheet.getCell('A4').value = 'Fecha fin:';
      worksheet.getCell('B4').value = stats.fecha_fin;

      let currentRow = 6;

      // Por cada pregunta
      for (const pregunta of stats.preguntas) {
        worksheet.getCell(`A${currentRow}`).value = pregunta.pregunta_texto;
        worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
        currentRow++;

        worksheet.getCell(`A${currentRow}`).value = `Tipo: ${pregunta.tipo}`;
        currentRow++;

        // Encabezados de la tabla
        worksheet.getCell(`A${currentRow}`).value = 'Respuesta';
        worksheet.getCell(`B${currentRow}`).value = 'Frecuencia';
        worksheet.getCell(`C${currentRow}`).value = 'Porcentaje';
        worksheet.getRow(currentRow).font = { bold: true };
        worksheet.getRow(currentRow).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9D9D9' },
        };
        currentRow++;

        // Datos de respuestas
        for (const resp of pregunta.respuestas) {
          worksheet.getCell(`A${currentRow}`).value = resp.valor;
          worksheet.getCell(`B${currentRow}`).value = resp.frecuencia;
          worksheet.getCell(`C${currentRow}`).value = `${resp.porcentaje}%`;
          currentRow++;
        }

        worksheet.getCell(`A${currentRow}`).value = 'Total';
        worksheet.getCell(`B${currentRow}`).value = pregunta.total_respuestas;
        worksheet.getRow(currentRow).font = { bold: true };
        currentRow += 2;
      }

      // Ajustar anchos de columna
      worksheet.getColumn('A').width = 50;
      worksheet.getColumn('B').width = 15;
      worksheet.getColumn('C').width = 15;
    }

    return workbook.xlsx.writeBuffer();
  }

  async exportarPDF(filtros: FiltrosReporteDto): Promise<Buffer> {
    const estadisticas = await this.obtenerEstadisticas(filtros);

    if (estadisticas.length === 0) {
      throw new NotFoundException('No hay datos para exportar');
    }

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Título del documento
      doc.fontSize(20).text('Reporte de Encuestas', { align: 'center' });
      doc.moveDown();

      for (const [index, stats] of estadisticas.entries()) {
        if (index > 0) {
          doc.addPage();
        }

        // Información de la encuesta
        doc.fontSize(16).text(stats.titulo, { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Total de respuestas: ${stats.total_respuestas}`);
        doc.text(`Fecha inicio: ${new Date(stats.fecha_inicio).toLocaleDateString()}`);
        doc.text(`Fecha fin: ${new Date(stats.fecha_fin).toLocaleDateString()}`);
        doc.moveDown(2);

        // Por cada pregunta
        for (const pregunta of stats.preguntas) {
          doc.fontSize(14).text(pregunta.pregunta_texto);
          doc.fontSize(10).text(`Tipo: ${pregunta.tipo}`);
          doc.moveDown();

          // Tabla de respuestas
          for (const resp of pregunta.respuestas) {
            doc
              .fontSize(10)
              .text(
                `  • ${resp.valor}: ${resp.frecuencia} (${resp.porcentaje}%)`,
              );
          }

          doc.moveDown();
          doc
            .fontSize(11)
            .text(`Total de respuestas: ${pregunta.total_respuestas}`);
          doc.moveDown(2);
        }
      }

      doc.end();
    });
  }

  private sanitizeSheetName(name: string): string {
    // Excel no permite ciertos caracteres en nombres de hojas
    return name.replaceAll(/[[\]\\/?*:]/g, '').substring(0, 31);
  }
}
