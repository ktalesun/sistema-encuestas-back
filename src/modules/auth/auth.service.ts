import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Buscar usuario
    const usuario = await this.usuarioService.findByEmail(loginDto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validar estado del usuario (HU1)
    if (usuario.estado === 'inactivo') {
      throw new ForbiddenException('Cuenta inactiva');
    }

    // Validar estado de la empresa/licencia (HU2)
    if (usuario.empresa && usuario.empresa.estado === 'inactiva') {
      throw new ForbiddenException('Licencia inactiva');
    }

    // Validar expiración de licencia (HU2)
    if (usuario.empresa) {
      const hoy = new Date();
      const fechaExpiracion = new Date(usuario.empresa.fecha_expiracion);

      if (hoy > fechaExpiracion) {
        throw new ForbiddenException('Licencia expirada');
      }
    }

    // Validar password
    const passwordValido = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT (HU1)
    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      empresa_id: usuario.empresa_id,
      rol_id: usuario.rol_id,
      rol: usuario.rol?.nombre || null,
      permisos: usuario.rol?.permisos || [],
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        estado: usuario.estado,
        empresa: {
          id: usuario.empresa?.id_empresa,
          nombre: usuario.empresa?.nombre,
          estado: usuario.empresa?.estado,
        },
        rol: {
          id: usuario.rol?.id_rol,
          nombre: usuario.rol?.nombre,
          permisos: usuario.rol?.permisos || [],
        },
      },
    };
  }

  async validateUser(userId: string) {
    return await this.usuarioService.findOne(userId);
  }
}
