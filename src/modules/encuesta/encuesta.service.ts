/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuesta } from './entities/encuesta.entity';
import { Pregunta } from '../pregunta/entities/pregunta.entity';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { UpdateEncuestaDto } from './dto/update-encuesta.dto';

@Injectable()
export class EncuestaService {
  constructor(
    @InjectRepository(Encuesta)
    private readonly encuestaRepository: Repository<Encuesta>,
    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,
  ) {}

  async create(createEncuestaDto: CreateEncuestaDto): Promise<Encuesta> {
    // Validar fechas (HU4)
    const fechaInicio = new Date(createEncuestaDto.fecha_inicio);
    const fechaFin = new Date(createEncuestaDto.fecha_fin);

    if (fechaInicio >= fechaFin) {
      throw new BadRequestException(
        'La fecha de inicio debe ser anterior a la fecha de fin',
      );
    }

    // Crear encuesta
    const encuesta = this.encuestaRepository.create({
      titulo: createEncuestaDto.titulo,
      descripcion: createEncuestaDto.descripcion,
      fecha_inicio: createEncuestaDto.fecha_inicio,
      fecha_fin: createEncuestaDto.fecha_fin,
      empresa_id: createEncuestaDto.empresa_id,
      estado: 'borrador',
    });

    // Generar URL pública (HU12)
    const savedEncuesta = await this.encuestaRepository.save(encuesta);
    savedEncuesta.url_publica = this.generarUrlPublica(
      savedEncuesta.id_encuesta,
      savedEncuesta.empresa_id,
    );
    await this.encuestaRepository.save(savedEncuesta);

    // Crear preguntas si vienen
    if (createEncuestaDto.preguntas && createEncuestaDto.preguntas.length > 0) {
      const preguntas = createEncuestaDto.preguntas.map((p, index) =>
        this.preguntaRepository.create({
          texto: p.texto,
          tipo: p.tipo as any,
          opciones: p.opciones,
          rango: p.rango,
          orden: p.orden || index + 1,
          encuesta: savedEncuesta,
        }),
      );
      await this.preguntaRepository.save(preguntas);
    }

    return this.findOne(savedEncuesta.id_encuesta);
  }

  async findAll(): Promise<Encuesta[]> {
    return await this.encuestaRepository.find({
      relations: ['empresa', 'preguntas'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Encuesta> {
    const encuesta = await this.encuestaRepository.findOne({
      where: { id_encuesta: id },
      relations: ['empresa', 'preguntas'],
    });

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    // Ordenar preguntas
    if (encuesta.preguntas) {
      encuesta.preguntas.sort((a, b) => a.orden - b.orden);
    }

    return encuesta;
  }

  async findByUrlPublica(
    empresaId: string,
    encuestaId: string,
  ): Promise<Encuesta> {
    const encuesta = await this.encuestaRepository.findOne({
      where: { id_encuesta: encuestaId, empresa_id: empresaId },
      relations: ['preguntas'],
    });

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    // Validar vigencia (HU6)
    const hoy = new Date();
    const fechaInicio = new Date(encuesta.fecha_inicio);
    const fechaFin = new Date(encuesta.fecha_fin);

    if (hoy < fechaInicio || hoy > fechaFin) {
      throw new BadRequestException('Encuesta cerrada. Gracias por su interés');
    }

    // Solo si está publicada
    if (encuesta.estado !== 'publicada') {
      throw new BadRequestException('Encuesta no disponible');
    }

    if (encuesta.preguntas) {
      encuesta.preguntas.sort((a, b) => a.orden - b.orden);
    }

    return encuesta;
  }

  async update(
    id: string,
    updateEncuestaDto: UpdateEncuestaDto,
  ): Promise<Encuesta> {
    const encuesta = await this.findOne(id);

    // Validar fechas si se actualizan
    if (updateEncuestaDto.fecha_inicio || updateEncuestaDto.fecha_fin) {
      const fechaInicio = new Date(
        updateEncuestaDto.fecha_inicio || encuesta.fecha_inicio,
      );
      const fechaFin = new Date(
        updateEncuestaDto.fecha_fin || encuesta.fecha_fin,
      );

      if (fechaInicio >= fechaFin) {
        throw new BadRequestException(
          'La fecha de inicio debe ser anterior a la fecha de fin',
        );
      }
    }

    Object.assign(encuesta, updateEncuestaDto);
    return await this.encuestaRepository.save(encuesta);
  }

  async updateEstado(id: string, estado: string): Promise<Encuesta> {
    const estadosValidos = ['borrador', 'publicada', 'inactiva', 'archivada'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }

    const encuesta = await this.findOne(id);
    encuesta.estado = estado;
    return await this.encuestaRepository.save(encuesta);
  }

  // HU11: Duplicar encuesta
  async duplicar(id: string): Promise<Encuesta> {
    const original = await this.findOne(id);

    // Crear copia
    const copia = this.encuestaRepository.create({
      titulo: `${original.titulo} (Copia)`,
      descripcion: original.descripcion,
      fecha_inicio: original.fecha_inicio,
      fecha_fin: original.fecha_fin,
      empresa_id: original.empresa_id,
      estado: 'borrador',
    });

    const savedCopia = await this.encuestaRepository.save(copia);

    // Generar URL
    savedCopia.url_publica = this.generarUrlPublica(
      savedCopia.id_encuesta,
      savedCopia.empresa_id,
    );
    await this.encuestaRepository.save(savedCopia);

    // Copiar preguntas
    if (original.preguntas && original.preguntas.length > 0) {
      const preguntasCopia = original.preguntas.map((p) =>
        this.preguntaRepository.create({
          texto: p.texto,
          tipo: p.tipo,
          opciones: p.opciones,
          rango: p.rango,
          orden: p.orden,
          encuesta_id: savedCopia.id_encuesta,
        }),
      );
      await this.preguntaRepository.save(preguntasCopia);
    }

    return this.findOne(savedCopia.id_encuesta);
  }

  async remove(id: string): Promise<void> {
    const encuesta = await this.findOne(id);
    await this.encuestaRepository.remove(encuesta);
  }

  // HU12: Generar URL pública
  private generarUrlPublica(encuestaId: string, empresaId: string): string {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return `${baseUrl}/encuestas/public/${empresaId}/${encuestaId}`;
  }
}
