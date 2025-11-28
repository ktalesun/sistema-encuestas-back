import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RespuestaService } from './respuesta.service';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';

@ApiTags('Respuestas')
@Controller('respuestas')
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Post()
  @ApiOperation({ summary: 'Enviar respuesta a encuesta (HU7)' })
  @ApiResponse({ status: 201, description: 'Respuesta almacenada' })
  @ApiResponse({ status: 400, description: 'Encuesta cerrada' })
  create(@Body() createRespuestaDto: CreateRespuestaDto) {
    return this.respuestaService.create(createRespuestaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las respuestas' })
  @ApiQuery({ name: 'encuesta_id', required: false })
  @ApiResponse({ status: 200, description: 'Lista de respuestas' })
  findAll(@Query('encuesta_id') encuestaId?: string) {
    if (encuestaId) {
      return this.respuestaService.findByEncuesta(encuestaId);
    }
    return this.respuestaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener respuesta por ID' })
  @ApiResponse({ status: 200, description: 'Respuesta encontrada' })
  @ApiResponse({ status: 404, description: 'Respuesta no encontrada' })
  findOne(@Param('id') id: string) {
    return this.respuestaService.findOne(id);
  }
}
