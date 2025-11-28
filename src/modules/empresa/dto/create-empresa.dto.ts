import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ example: 'Tech Solutions S.A.S.' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '900123456-1' })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  @IsNotEmpty()
  fecha_expiracion: string;

  @ApiProperty({ example: 'activa', required: false })
  @IsString()
  @IsOptional()
  @IsEnum(['activa', 'inactiva'])
  estado?: string;
}
