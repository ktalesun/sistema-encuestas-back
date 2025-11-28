import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respuesta } from './entities/respuesta.entity';
import { Encuesta } from '../encuesta/entities/encuesta.entity';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';

@Injectable()
export class RespuestaService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestaRepository: Repository<Respuesta>,
    @InjectRepository(Encuesta)
    private readonly encuestaRepository: Repository<Encuesta>,
  ) {}

  async create(createRespuestaDto: CreateRespuestaDto): Promise<Respuesta> {
    // Validar que la encuesta existe
    const encuesta = await this.encuestaRepository.findOne({
      where: { id_encuesta: createRespuestaDto.encuesta_id },
    });

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    // Validar vigencia (HU7)
    const hoy = new Date();
    const fechaFin = new Date(encuesta.fecha_fin);

    if (hoy > fechaFin) {
      throw new BadRequestException('Encuesta cerrada');
    }

    // Validar estado publicada
    if (encuesta.estado !== 'publicada') {
      throw new BadRequestException('Encuesta no disponible');
    }

    const respuesta = this.respuestaRepository.create({
      ...createRespuestaDto,
      timestamp: new Date(),
    });

    return await this.respuestaRepository.save(respuesta);
  }

  async findAll(): Promise<Respuesta[]> {
    return await this.respuestaRepository.find({
      relations: ['encuesta'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByEncuesta(encuestaId: string): Promise<Respuesta[]> {
    return await this.respuestaRepository.find({
      where: { encuesta_id: encuestaId },
      order: { timestamp: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Respuesta> {
    const respuesta = await this.respuestaRepository.findOne({
      where: { id_respuesta: id },
      relations: ['encuesta', 'usuario'],
    });

    if (!respuesta) {
      throw new NotFoundException('Respuesta no encontrada');
    }

    return respuesta;
  }
}
