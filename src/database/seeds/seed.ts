import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { RolService } from '../../modules/rol/rol.service';
import { EmpresaService } from '../../modules/empresa/empresa.service';
import { UsuarioService } from '../../modules/usuario/usuario.service';
import { EncuestaService } from '../../modules/encuesta/encuesta.service';

function fechaEnAnios(anios: number): string {
  const fecha = new Date();
  fecha.setFullYear(fecha.getFullYear() + anios);
  return fecha.toISOString().slice(0, 10);
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const rolService = app.get(RolService);
  const empresaService = app.get(EmpresaService);
  const usuarioService = app.get(UsuarioService);
  const encuestaService = app.get(EncuestaService);

  try {
    console.log('🌱 Iniciando seeder...\n');

    // 1. Crear roles
    console.log('📝 Creando roles...');
    const rolAdmin = await rolService.create({
      nombre: 'Administrador',
      permisos: [
        'empresas.*',
        'usuarios.*',
        'roles.*',
        'encuestas.*',
        'respuestas.*',
        'reportes.*',
      ],
    });
    console.log(`✅ Rol creado: ${rolAdmin.nombre}`);

    const rolEditor = await rolService.create({
      nombre: 'Editor',
      permisos: [
        'encuestas.crear',
        'encuestas.editar',
        'encuestas.ver',
        'encuestas.duplicar',
        'respuestas.ver',
        'reportes.ver',
      ],
    });
    console.log(`✅ Rol creado: ${rolEditor.nombre}`);

    const rolViewer = await rolService.create({
      nombre: 'Visualizador',
      permisos: ['encuestas.ver', 'respuestas.ver', 'reportes.ver'],
    });
    console.log(`✅ Rol creado: ${rolViewer.nombre}\n`);

    // 2. Crear empresas
    console.log('🏢 Creando empresas...');
    const empresa1 = await empresaService.create({
      nombre: 'Tech Solutions S.A.S.',
      nit: '900123456-1',
      fecha_inicio: '2025-01-01',
      fecha_expiracion: fechaEnAnios(2),
      estado: 'activa',
    });
    console.log(`✅ Empresa creada: ${empresa1.nombre}`);

    const empresa2 = await empresaService.create({
      nombre: 'Innovación Digital Ltda.',
      nit: '900987654-2',
      fecha_inicio: '2025-01-01',
      fecha_expiracion: fechaEnAnios(1),
      estado: 'activa',
    });
    console.log(`✅ Empresa creada: ${empresa2.nombre}\n`);

    // 3. Crear usuarios
    console.log('👥 Creando usuarios...');
    const admin = await usuarioService.create({
      nombre: 'Administrador Sistema',
      email: 'admin@techsolutions.com',
      password: 'Admin123!',
      empresa_id: empresa1.id_empresa,
      rol_id: rolAdmin.id_rol,
    });
    console.log(`✅ Usuario creado: ${admin.email}`);

    const editor = await usuarioService.create({
      nombre: 'Juan Editor',
      email: 'juan@techsolutions.com',
      password: 'Editor123!',
      empresa_id: empresa1.id_empresa,
      rol_id: rolEditor.id_rol,
    });
    console.log(`✅ Usuario creado: ${editor.email}`);

    const viewer = await usuarioService.create({
      nombre: 'María Viewer',
      email: 'maria@innovacion.com',
      password: 'Viewer123!',
      empresa_id: empresa2.id_empresa,
      rol_id: rolViewer.id_rol,
    });
    console.log(`✅ Usuario creado: ${viewer.email}\n`);

    // 4. Crear encuestas
    console.log('📊 Creando encuestas...');
    const encuesta1 = await encuestaService.create({
      titulo: 'Encuesta de Satisfacción del Cliente 2025',
      descripcion:
        'Encuesta para medir el nivel de satisfacción de nuestros clientes',
      fecha_inicio: '2025-01-01',
      fecha_fin: fechaEnAnios(1),
      empresa_id: empresa1.id_empresa,
      preguntas: [
        {
          texto: '¿Cómo califica nuestro servicio?',
          tipo: 'opcion_unica',
          opciones: ['Excelente', 'Bueno', 'Regular', 'Malo'],
          orden: 1,
        },
        {
          texto: '¿Recomendaría nuestros servicios?',
          tipo: 'si_no',
          orden: 2,
        },
        {
          texto: 'Del 0 al 10, ¿qué tan satisfecho está?',
          tipo: 'numerica',
          rango: { min: 0, max: 10 },
          orden: 3,
        },
        {
          texto: 'Califique nuestra atención con estrellas',
          tipo: 'estrellas',
          rango: { min: 0, max: 5 },
          orden: 4,
        },
        {
          texto: 'Comentarios adicionales',
          tipo: 'texto',
          orden: 5,
        },
      ],
    });
    console.log(`✅ Encuesta creada: ${encuesta1.titulo}`);

    const encuesta2 = await encuestaService.create({
      titulo: 'Evaluación de Producto',
      descripcion: 'Evaluación de nuestros productos y servicios',
      fecha_inicio: '2025-06-01',
      fecha_fin: fechaEnAnios(1),
      empresa_id: empresa2.id_empresa,
      preguntas: [
        {
          texto: '¿Qué producto utiliza?',
          tipo: 'opcion_unica',
          opciones: ['Producto A', 'Producto B', 'Producto C', 'Otro'],
          orden: 1,
        },
        {
          texto: 'Califique la calidad del producto',
          tipo: 'estrellas',
          rango: { min: 0, max: 5 },
          orden: 2,
        },
        {
          texto: 'Sugerencias de mejora',
          tipo: 'texto',
          orden: 3,
        },
      ],
    });
    console.log(`✅ Encuesta creada: ${encuesta2.titulo}\n`);

    // Publicar encuestas
    await encuestaService.updateEstado(encuesta1.id_encuesta, 'publicada');
    await encuestaService.updateEstado(encuesta2.id_encuesta, 'publicada');
    console.log('✅ Encuestas publicadas\n');

    console.log('🎉 Seeder completado exitosamente!\n');
    console.log('📋 Datos de acceso:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Administrador:');
    console.log('   Email: admin@techsolutions.com');
    console.log('   Password: Admin123!');
    console.log('');
    console.log('👤 Editor:');
    console.log('   Email: juan@techsolutions.com');
    console.log('   Password: Editor123!');
    console.log('');
    console.log('👤 Visualizador:');
    console.log('   Email: maria@innovacion.com');
    console.log('   Password: Viewer123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error en el seeder:', error);
    if (error instanceof Error && error.message) {
      console.error('Mensaje:', error.message);
    }
  } finally {
    await app.close();
  }
}

seed().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
