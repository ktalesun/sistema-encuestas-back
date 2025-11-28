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
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateEstadoEmpresaDto } from './dto/update-estado-empresa.dto';

@ApiTags('Empresas/Licencias')
@Controller('empresas')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva empresa/licencia' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 409, description: 'NIT ya registrado' })
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.empresaService.create(createEmpresaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  findAll() {
    return this.empresaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  findOne(@Param('id') id: string) {
    return this.empresaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  update(@Param('id') id: string, @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresaService.update(id, updateEmpresaDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de empresa (activa/inactiva)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  updateEstado(
    @Param('id') id: string,
    @Body() updateEstadoDto: UpdateEstadoEmpresaDto,
  ) {
    return this.empresaService.updateEstado(id, updateEstadoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar empresa' })
  @ApiResponse({ status: 204, description: 'Empresa eliminada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  remove(@Param('id') id: string) {
    return this.empresaService.remove(id);
  }
}
