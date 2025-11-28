import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del usuario (activo/inactivo)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  updateEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.usuarioService.updateEstado(id, body.estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 204, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
