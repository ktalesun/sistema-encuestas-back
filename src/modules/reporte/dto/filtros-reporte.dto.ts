import { IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltrosReporteDto {
  @ApiPropertyOptional({
    description: 'ID de la empresa para filtrar',
    example: '8a7d9e12-4f8c-4b3a-9c21-1234567890ab',
  })
  @IsOptional()
  @IsUUID()
  empresa_id?: string;

  @ApiPropertyOptional({
    description: 'ID de la encuesta para filtrar',
    example: '9b8e0f23-5g9d-5c4b-0d32-2345678901bc',
  })
  @IsOptional()
  @IsUUID()
  encuesta_id?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del rango',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin del rango',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;
}
