import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateEstadoEmpresaDto } from './dto/update-estado-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    // Validar NIT único
    const existeNit = await this.empresaRepository.findOne({
      where: { nit: createEmpresaDto.nit },
    });

    if (existeNit) {
      throw new ConflictException('El NIT ya está registrado');
    }

    // Validar fechas
    const fechaInicio = new Date(createEmpresaDto.fecha_inicio);
    const fechaExpiracion = new Date(createEmpresaDto.fecha_expiracion);

    if (fechaInicio >= fechaExpiracion) {
      throw new ConflictException(
        'La fecha de inicio debe ser anterior a la fecha de expiración',
      );
    }

    const empresa = this.empresaRepository.create({
      ...createEmpresaDto,
      estado: createEmpresaDto.estado || 'activa',
    });

    return await this.empresaRepository.save(empresa);
  }

  async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa: id },
      relations: ['usuarios', 'encuestas'],
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return empresa;
  }

  async update(
    id: string,
    updateEmpresaDto: UpdateEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);

    // Si se actualiza NIT, validar unicidad
    if (updateEmpresaDto.nit && updateEmpresaDto.nit !== empresa.nit) {
      const existeNit = await this.empresaRepository.findOne({
        where: { nit: updateEmpresaDto.nit },
      });

      if (existeNit) {
        throw new ConflictException('El NIT ya está registrado');
      }
    }

    // Validar fechas si se actualizan
    if (updateEmpresaDto.fecha_inicio || updateEmpresaDto.fecha_expiracion) {
      const fechaInicio = new Date(
        updateEmpresaDto.fecha_inicio || empresa.fecha_inicio,
      );
      const fechaExpiracion = new Date(
        updateEmpresaDto.fecha_expiracion || empresa.fecha_expiracion,
      );

      if (fechaInicio >= fechaExpiracion) {
        throw new ConflictException(
          'La fecha de inicio debe ser anterior a la fecha de expiración',
        );
      }
    }

    Object.assign(empresa, updateEmpresaDto);
    return await this.empresaRepository.save(empresa);
  }

  async updateEstado(
    id: string,
    updateEstadoDto: UpdateEstadoEmpresaDto,
  ): Promise<Empresa> {
    const empresa = await this.findOne(id);
    empresa.estado = updateEstadoDto.estado;
    return await this.empresaRepository.save(empresa);
  }

  async remove(id: string): Promise<void> {
    const empresa = await this.findOne(id);
    await this.empresaRepository.remove(empresa);
  }
}
