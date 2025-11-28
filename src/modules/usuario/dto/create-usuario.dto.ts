import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsUUID,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'uuid-de-empresa' })
  @IsUUID()
  @IsNotEmpty()
  empresa_id: string;

  @ApiProperty({ example: 'uuid-de-rol', required: false })
  @IsUUID()
  @IsOptional()
  rol_id?: string;
}
