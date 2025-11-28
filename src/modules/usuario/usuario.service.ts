import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Validar email único
    const existeEmail = await this.usuarioRepository.findOne({
      where: { email: createUsuarioDto.email },
    });

    if (existeEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      estado: 'activo',
    });

    const savedUsuario = await this.usuarioRepository.save(usuario);

    // No retornar password
    const { password: _password, ...usuarioSinPassword } = savedUsuario;
    return usuarioSinPassword as Usuario;
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find({
      relations: ['empresa', 'rol'],
      select: {
        password: false,
      },
      order: { created_at: 'DESC' },
    });

    return usuarios;
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      relations: ['empresa', 'rol'],
      select: {
        password: false,
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
      relations: ['empresa', 'rol'],
    });
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si actualiza email, validar unicidad
    if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
      const existeEmail = await this.usuarioRepository.findOne({
        where: { email: updateUsuarioDto.email },
      });

      if (existeEmail) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    // Si actualiza password, hacer hash
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        10,
      );
    }

    Object.assign(usuario, updateUsuarioDto);
    const updated = await this.usuarioRepository.save(usuario);
    const { password: _password, ...updatedSinPassword } = updated;
    return updatedSinPassword as Usuario;
  }

  async updateEstado(id: string, estado: string): Promise<Usuario> {
    if (!['activo', 'inactivo'].includes(estado)) {
      throw new BadRequestException('Estado inválido');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    usuario.estado = estado;
    const updated = await this.usuarioRepository.save(usuario);
    const { password: _password, ...updatedSinPassword } = updated;
    return updatedSinPassword as Usuario;
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.remove(usuario);
  }
}
