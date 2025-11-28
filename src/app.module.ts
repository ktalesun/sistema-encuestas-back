import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

// Módulos de la aplicación
import { EmpresaModule } from './modules/empresa/empresa.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { AuthModule } from './modules/auth/auth.module';
import { EncuestaModule } from './modules/encuesta/encuesta.module';
import { RespuestaModule } from './modules/respuesta/respuesta.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
        configService.get<TypeOrmModuleOptions>('database')!,
      inject: [ConfigService],
    }),

    // Módulos de negocio
    EmpresaModule,
    UsuarioModule,
    AuthModule,
    EncuestaModule,
    RespuestaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
