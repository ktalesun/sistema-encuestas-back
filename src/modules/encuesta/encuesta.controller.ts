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
import { EncuestaService } from './encuesta.service';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { UpdateEncuestaDto } from './dto/update-encuesta.dto';

@ApiTags('Encuestas')
@Controller('encuestas')
export class EncuestaController {
  constructor(private readonly encuestaService: EncuestaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva encuesta' })
  @ApiResponse({ status: 201, description: 'Encuesta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Fechas inválidas' })
  create(@Body() createEncuestaDto: CreateEncuestaDto) {
    return this.encuestaService.create(createEncuestaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las encuestas' })
  @ApiResponse({ status: 200, description: 'Lista de encuestas' })
  findAll() {
    return this.encuestaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener encuesta por ID' })
  @ApiResponse({ status: 200, description: 'Encuesta encontrada' })
  @ApiResponse({ status: 404, description: 'Encuesta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.encuestaService.findOne(id);
  }

  @Get('public/:empresaId/:encuestaId')
  @ApiOperation({ summary: 'Acceder a encuesta pública (HU6)' })
  @ApiResponse({ status: 200, description: 'Encuesta disponible' })
  @ApiResponse({ status: 400, description: 'Encuesta cerrada o no disponible' })
  findByUrlPublica(
    @Param('empresaId') empresaId: string,
    @Param('encuestaId') encuestaId: string,
  ) {
    return this.encuestaService.findByUrlPublica(empresaId, encuestaId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar encuesta' })
  @ApiResponse({ status: 200, description: 'Encuesta actualizada' })
  @ApiResponse({ status: 404, description: 'Encuesta no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateEncuestaDto: UpdateEncuestaDto,
  ) {
    return this.encuestaService.update(id, updateEncuestaDto);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado de encuesta' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  updateEstado(@Param('id') id: string, @Body() body: { estado: string }) {
    return this.encuestaService.updateEstado(id, body.estado);
  }

  @Post(':id/duplicar')
  @ApiOperation({ summary: 'Duplicar encuesta (HU11)' })
  @ApiResponse({ status: 201, description: 'Encuesta duplicada exitosamente' })
  @ApiResponse({ status: 404, description: 'Encuesta no encontrada' })
  duplicar(@Param('id') id: string) {
    return this.encuestaService.duplicar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar encuesta' })
  @ApiResponse({ status: 204, description: 'Encuesta eliminada' })
  @ApiResponse({ status: 404, description: 'Encuesta no encontrada' })
  remove(@Param('id') id: string) {
    return this.encuestaService.remove(id);
  }
}
