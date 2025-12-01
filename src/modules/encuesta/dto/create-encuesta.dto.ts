import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum EstadoEncuesta {
  BORRADOR = 'borrador',
  PUBLICADA = 'publicada',
  INACTIVA = 'inactiva',
  ARCHIVADA = 'archivada',
}

class CreatePreguntaDto {
  @ApiProperty({ example: '¿Cómo calificaría nuestro servicio?' })
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({
    example: 'opcion_unica',
    enum: ['texto', 'opcion_unica', 'si_no', 'numerica', 'estrellas'],
  })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({
    example: ['Excelente', 'Bueno', 'Regular', 'Malo'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  opciones?: string[];

  @ApiProperty({ example: { min: 0, max: 10 }, required: false })
  @IsOptional()
  rango?: { min: number; max: number };

  @ApiProperty({ example: 1 })
  @IsOptional()
  orden?: number;
}

export class CreateEncuestaDto {
  @ApiProperty({ example: 'Encuesta de Satisfacción 2025' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({
    example: 'Encuesta para medir la satisfacción de nuestros clientes',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  @IsNotEmpty()
  fecha_fin: string;

  @ApiProperty({ example: 'uuid-de-empresa' })
  @IsUUID()
  @IsNotEmpty()
  empresa_id: string;

  @ApiProperty({
    example: 'borrador',
    enum: ['borrador', 'publicada', 'inactiva', 'archivada'],
    required: false,
    description: 'Estado de la encuesta. Por defecto: borrador',
  })
  @IsEnum(EstadoEncuesta)
  @IsOptional()
  estado?: string;

  @ApiProperty({ type: [CreatePreguntaDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  preguntas?: CreatePreguntaDto[];
}
