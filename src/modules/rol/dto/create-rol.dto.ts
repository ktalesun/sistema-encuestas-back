import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, MaxLength } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Lista de permisos del rol',
    example: ['usuarios.crear', 'usuarios.editar', 'encuestas.ver'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permisos?: string[];
}
