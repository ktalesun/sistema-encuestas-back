import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsOptional()
  password?: string;
}
