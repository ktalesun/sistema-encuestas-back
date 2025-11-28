# Sistema de Gestión de Encuestas

API REST para gestión de encuestas y análisis de resultados, desarrollada con NestJS y TypeScript.

## 🚀 Características Implementadas

### ✅ Épica 1: Gestión de Empresas y Usuarios
- **HU1**: Autenticación con JWT
  - Login con validación de estado (activo/inactivo)
  - Validación de licencia expirada
  - Token JWT con información de rol y empresa

- **HU2**: Gestión de Licencias, Usuarios y Roles
  - Control de licencias con fechas de expiración
  - Sistema de roles y permisos
  - Validación de acceso según licencia

- **HU3**: CRUD de Empresas/Licencias
  - Crear, editar, actualizar estado
  - Validación de NIT único
  - Control de fechas de vigencia

### ✅ Épica 2: Administración de Encuestas
- **HU4**: Crear Encuesta
  - Validación de fechas inicio/fin
  - Estados: borrador, publicada, inactiva, archivada
  
- **HU5, HU9, HU10**: Tipos de Pregunta
  - Texto libre
  - Opción única
  - Sí/No
  - Numérica (0-10)
  - Estrellas (0-5)

- **HU11**: Duplicar Encuesta
  - Copia estructura completa
  - Estado inicial: borrador
  - No copia respuestas

- **HU12**: Enlaces Públicos
  - Generación automática de URL pública
  - Formato: `/encuestas/public/{empresa_id}/{encuesta_id}`

### ✅ Épica 3: Respuestas
- **HU7**: Almacenamiento de Respuestas
  - Validación de vigencia
  - Almacenamiento en JSON
  - Timestamp automático
  - Datos de terceros opcionales

## 📋 Requisitos Previos

- Node.js >= 18
- pnpm >= 9
- Docker y Docker Compose

## 🛠️ Instalación

```bash
# Instalar dependencias
pnpm install

# O usar el Makefile
make install
```

## 🐳 Docker (Configuración Completa)

**Ver [DOCKER.md](./DOCKER.md) para guía completa de Docker.**

El proyecto incluye Docker Compose para PostgreSQL y PgAdmin:

```bash
# Levantar PostgreSQL
docker-compose up -d postgres

# O usar el Makefile
make db-up

# Ver logs
docker-compose logs -f postgres

# Detener
docker-compose down
```

**Acceso a PostgreSQL:**
- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Password: `postgres123`
- Database: `sistema_encuestas`

**PgAdmin (opcional):**
```bash
# Levantar PgAdmin
docker-compose up -d pgadmin
# O: make pgadmin

# Acceder a http://localhost:5050
# Email: admin@admin.com
# Password: admin123
```

## 🚀 Ejecución

```bash
# Desarrollo (levanta DB automáticamente)
make dev

# O manualmente:
docker-compose up -d postgres
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod
```

## 🔧 Comandos Útiles (Makefile)

```bash
make help        # Ver todos los comandos
make install     # Instalar dependencias
make dev         # Desarrollo con DB
make db-up       # Levantar PostgreSQL
make db-down     # Detener PostgreSQL
make db-reset    # Reiniciar DB (elimina datos)
make pgadmin     # Levantar PgAdmin
make logs        # Ver logs de PostgreSQL
make lint        # Ejecutar linter
```

La aplicación estará disponible en:
- API: http://localhost:3000
- Swagger: http://localhost:3000/api

**Verificar configuración:**
```bash
./check-setup.sh
```

## 📊 Base de Datos - Tablas Creadas

TypeORM sincroniza automáticamente estas entidades:
- ✅ `empresas` - Gestión de licencias y empresas
- ✅ `roles` - Roles y permisos del sistema
- ✅ `usuarios` - Usuarios con autenticación
- ✅ `encuestas` - Encuestas con estados
- ✅ `preguntas` - Preguntas con 5 tipos
- ✅ `respuestas` - Respuestas de encuestas públicas

## 📚 Documentación API

### Autenticación

#### Login
```bash
POST /auth/login
{
  "email": "usuario@empresa.com",
  "password": "Password123!"
}
```

### Empresas/Licencias

#### Crear Empresa
```bash
POST /empresas
{
  "nombre": "Tech Solutions S.A.S.",
  "nit": "900123456-1",
  "fecha_inicio": "2025-01-01",
  "fecha_expiracion": "2026-01-01",
  "estado": "activa"
}
```

#### Listar Empresas
```bash
GET /empresas
```

#### Actualizar Estado
```bash
PATCH /empresas/{id}/estado
{
  "estado": "inactiva"
}
```

### Usuarios

#### Crear Usuario
```bash
POST /usuarios
{
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "password": "Password123!",
  "empresa_id": "uuid-de-empresa",
  "rol_id": "uuid-de-rol"
}
```

### Encuestas

#### Crear Encuesta
```bash
POST /encuestas
{
  "titulo": "Encuesta de Satisfacción 2025",
  "descripcion": "Medir satisfacción de clientes",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "empresa_id": "uuid-de-empresa",
  "preguntas": [
    {
      "texto": "¿Cómo califica nuestro servicio?",
      "tipo": "opcion_unica",
      "opciones": ["Excelente", "Bueno", "Regular", "Malo"]
    },
    {
      "texto": "Del 0 al 10, ¿qué tan satisfecho está?",
      "tipo": "numerica",
      "rango": { "min": 0, "max": 10 }
    },
    {
      "texto": "Califique con estrellas",
      "tipo": "estrellas",
      "rango": { "min": 0, "max": 5 }
    }
  ]
}
```

#### Duplicar Encuesta
```bash
POST /encuestas/{id}/duplicar
```

#### Acceder a Encuesta Pública
```bash
GET /encuestas/public/{empresa_id}/{encuesta_id}
```

### Respuestas

#### Enviar Respuesta
```bash
POST /respuestas
{
  "encuesta_id": "uuid-de-encuesta",
  "datos_tercero": {
    "nombre": "Juan Pérez",
    "email": "juan@email.com"
  },
  "respuestas_json": {
    "pregunta_1": "Excelente",
    "pregunta_2": 9,
    "pregunta_3": 5
  }
}
```

#### Consultar Respuestas
```bash
GET /respuestas?encuesta_id=uuid-de-encuesta
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/               # Configuraciones (DB, JWT)
├── common/              # Elementos compartidos
│   ├── decorators/
│   ├── guards/          # JwtAuthGuard
│   ├── interceptors/
│   └── filters/
└── modules/
    ├── empresa/         # Gestión de licencias
    ├── usuario/         # Gestión de usuarios
    ├── auth/            # Autenticación JWT
    ├── encuesta/        # CRUD de encuestas
    ├── pregunta/        # Tipos de preguntas
    └── respuesta/       # Almacenamiento de respuestas
```

## 🔐 Autenticación

Todas las rutas protegidas requieren token JWT en el header:
```bash
Authorization: Bearer <token>
```

## 📝 Notas de Desarrollo

- **Sincronización automática**: En desarrollo, TypeORM sincroniza automáticamente las entidades
- **Validación**: Todas las DTOs usan class-validator
- **Swagger**: Documentación automática en `/api`
- **Estados de Encuesta**: borrador → publicada → inactiva/archivada

## 🎯 Próximas Implementaciones

- [ ] Módulo de Reportes (HU8)
- [ ] Exportación Excel/PDF
- [ ] Gráficos estadísticos
- [ ] Filtros avanzados
- [ ] Integración WhatsApp
- [ ] Acortador de URLs

## 👥 Autores

Sistema desarrollado para gestión de encuestas empresariales.

## 📄 Licencia

ISC
