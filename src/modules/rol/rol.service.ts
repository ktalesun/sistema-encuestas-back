import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    // Validar nombre único
    const existeNombre = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (existeNombre) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const rol = this.rolRepository.create(createRolDto);
    return await this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return await this.rolRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: id },
      relations: ['usuarios'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto): Promise<Rol> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: id },
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Si actualiza nombre, validar unicidad
    if (updateRolDto.nombre && updateRolDto.nombre !== rol.nombre) {
      const existeNombre = await this.rolRepository.findOne({
        where: { nombre: updateRolDto.nombre },
      });

      if (existeNombre) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }
    }

    Object.assign(rol, updateRolDto);
    return await this.rolRepository.save(rol);
  }

  async remove(id: string): Promise<void> {
    const rol = await this.rolRepository.findOne({
      where: { id_rol: id },
      relations: ['usuarios'],
    });

    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Validar que no tenga usuarios asociados
    if (rol.usuarios && rol.usuarios.length > 0) {
      throw new ConflictException(
        'No se puede eliminar un rol que tiene usuarios asociados',
      );
    }

    await this.rolRepository.remove(rol);
  }

  async addPermiso(id: string, permiso: string): Promise<Rol> {
    const rol = await this.findOne(id);

    if (!rol.permisos) {
      rol.permisos = [];
    }

    if (rol.permisos.includes(permiso)) {
      throw new ConflictException('El permiso ya existe en este rol');
    }

    rol.permisos.push(permiso);
    return await this.rolRepository.save(rol);
  }

  async removePermiso(id: string, permiso: string): Promise<Rol> {
    const rol = await this.findOne(id);

    if (!rol.permisos?.includes(permiso)) {
      throw new NotFoundException('El permiso no existe en este rol');
    }

    rol.permisos = rol.permisos.filter((p) => p !== permiso);
    return await this.rolRepository.save(rol);
  }
}
