import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoEmpresaDto {
  @ApiProperty({ example: 'activa', enum: ['activa', 'inactiva'] })
  @IsEnum(['activa', 'inactiva'])
  @IsNotEmpty()
  estado: string;
}
