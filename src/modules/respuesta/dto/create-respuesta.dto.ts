import { IsNotEmpty, IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRespuestaDto {
  @ApiProperty({ example: 'uuid-de-encuesta' })
  @IsUUID()
  @IsNotEmpty()
  encuesta_id: string;

  @ApiProperty({
    example: { nombre: 'Juan Pérez', email: 'juan@email.com' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  datos_tercero?: Record<string, any>;

  @ApiProperty({
    example: {
      pregunta_1: 'Excelente',
      pregunta_2: 'Sí',
      pregunta_3: 9,
      pregunta_4: 5,
    },
  })
  @IsObject()
  @IsNotEmpty()
  respuestas_json: Record<string, any>;

  @ApiProperty({ example: 'uuid-de-usuario', required: false })
  @IsUUID()
  @IsOptional()
  usuario_id?: string;
}
