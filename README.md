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

### ✅ Épica 3: Enlaces Públicos sin Autenticación
- **HU6**: Acceso Público a Encuestas
  - URL sin autenticación JWT
  - Formato: `/encuestas/public/{empresa_id}/{encuesta_id}`
  - Validación de vigencia y estado

- **HU7**: Envío de Respuestas Públicas
  - Envío sin autenticación
  - Validación de encuesta vigente
  - Almacenamiento con timestamp
  
### ✅ Épica 4: Módulo de Reportes y Análisis
- **HU8**: Tabulación y Estadísticas
  - Tabulación automática de respuestas
  - Cálculo de frecuencias y porcentajes
  - Filtros por empresa, encuesta y fechas
  - Exportación a Excel (.xlsx)
  - Exportación a PDF
  - API JSON para integración
  
### ✅ Gestión de Roles y Permisos
- CRUD completo de roles
- Gestión dinámica de permisos
- Endpoints para agregar/remover permisos
- Validación de usuarios asignados antes de eliminar rol

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

Este servicio (backend) se levanta con Docker Compose junto con PostgreSQL y pgAdmin. Para la guía detallada ver [DOCKER.md](./DOCKER.md).

| Servicio | Imagen | Puerto |
|----------|--------|--------|
| `backend` | Dockerfile propio (`node:20-alpine`, multi-stage) | 3001 |
| `postgres` | `postgres:16-alpine` | 5432 |
| `pgadmin` | `dpage/pgadmin4:8.14` | 5050 |

Todos comparten la red `app-network` y se comunican por **nombre de servicio** (el backend usa `DB_HOST=postgres`).

### Levantar el backend completo

```bash
# 1. Crear el archivo de variables (NO se sube al repositorio) y editar las contraseñas
cp .env.prod.example .env.prod

# 2. Construir las imágenes y levantar los contenedores
docker compose up -d --build

# 3. Verificar
docker compose ps
docker compose logs -f backend
```

- API: http://localhost:3001
- Swagger: http://localhost:3001/api
- pgAdmin: http://localhost:5050 (credenciales en `.env.prod`)

### Levantar el frontend (segundo repositorio)

El compose del frontend se une a la red `app-network`, que crea este compose, por lo que **primero se levanta el backend** y luego el frontend (ver el README de `Encuesthik_Frontend`). La aplicación queda en http://localhost:3000.

### Verificar la comunicación entre contenedores

```bash
docker network inspect app-network
docker exec -it sistema-encuestas-db psql -U postgres -d sistema_encuestas -c '\dt'
```

### Detener

```bash
docker compose down        # conserva los datos
docker compose down -v     # elimina también los volúmenes
```

### Solo base de datos (desarrollo local)

```bash
make db-up        # o: docker compose up -d postgres
pnpm run start:dev
```

Las credenciales se definen en `.env` / `.env.prod`, que están en `.gitignore`. Use `.env.example` y `.env.prod.example` como plantilla.

### Integración continua

El workflow `.github/workflows/docker-build.yml` construye la imagen del backend en cada *push* y *pull request*.

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
make seed        # Poblar base de datos
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

## 🌱 Poblar Base de Datos (Seeds)

El proyecto incluye un seeder con datos de prueba:

```bash
# Ejecutar seeder
pnpm run seed
# O: make seed
```

**Datos creados:**
- 3 Roles (Administrador, Editor, Visualizador)
- 2 Empresas (Tech Solutions, Innovación Digital)
- 3 Usuarios con diferentes permisos
- 2 Encuestas de ejemplo publicadas

**Credenciales de prueba:**
```
Administrador:
  Email: admin@techsolutions.com
  Password: Admin123!

Editor:
  Email: juan@techsolutions.com
  Password: Editor123!

Visualizador:
  Email: maria@innovacion.com
  Password: Viewer123!
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

La API está documentada con Swagger en: **http://localhost:3000/api**

### 🔓 Endpoints Públicos (Sin Autenticación)

Los siguientes endpoints **NO requieren** token JWT:

#### 1. Login
```bash
POST /auth/login
{
  "email": "admin@techsolutions.com",
  "password": "Admin123!"
}
```

#### 2. Ver Encuesta Pública (HU6)
```bash
GET /encuestas/public/{empresa_id}/{encuesta_id}
```

**Respuesta:**
```json
{
  "id": "uuid",
  "titulo": "Encuesta de Satisfacción 2025",
  "descripcion": "Medir satisfacción del cliente",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "estado": "publicada",
  "url_publica": "/encuestas/public/{empresa_id}/{encuesta_id}",
  "preguntas": [...]
}
```

#### 3. Enviar Respuesta Pública (HU7)
```bash
POST /respuestas
{
  "encuesta_id": "uuid-de-encuesta",
  "respuestas": [...],
  "terceros": {
    "nombre": "Juan Pérez",
    "email": "juan@cliente.com"
  }
}
```

---

### 🔐 Endpoints Protegidos (Requieren JWT)

Todos los demás endpoints requieren el header:
```bash
Authorization: Bearer {token}
```

### Autenticación

#### Login (Público - No requiere JWT)
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

### Roles

#### Crear Rol
```bash
POST /roles
{
  "nombre": "Administrador",
  "permisos": ["usuarios.crear", "usuarios.editar", "encuestas.ver"]
}
```

#### Agregar Permiso a Rol
```bash
PATCH /roles/{id}/permisos/add
{
  "permiso": "encuestas.crear"
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

#### Acceder a Encuesta Pública (Sin JWT - HU6)
```bash
GET /encuestas/public/{empresa_id}/{encuesta_id}
```

### Respuestas

#### Enviar Respuesta (Sin JWT - HU7)
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

### Reportes

#### Obtener Estadísticas y Tabulación (HU8)
```bash
GET /reportes/estadisticas
GET /reportes/estadisticas?encuesta_id=uuid
GET /reportes/estadisticas?empresa_id=uuid&fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

**Respuesta:**
```json
[
  {
    "encuesta_id": "uuid",
    "titulo": "Encuesta de Satisfacción 2025",
    "total_respuestas": 150,
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31",
    "preguntas": [
      {
        "pregunta_id": "uuid",
        "pregunta_texto": "¿Cómo califica el servicio?",
        "tipo": "opcion_unica",
        "total_respuestas": 150,
        "respuestas": [
          {
            "valor": "Excelente",
            "frecuencia": 80,
            "porcentaje": 53.33
          },
          {
            "valor": "Bueno",
            "frecuencia": 50,
            "porcentaje": 33.33
          },
          {
            "valor": "Regular",
            "frecuencia": 20,
            "porcentaje": 13.33
          }
        ]
      }
    ]
  }
]
```

#### Exportar a Excel (HU8)
```bash
GET /reportes/exportar/excel
GET /reportes/exportar/excel?encuesta_id=uuid
GET /reportes/exportar/excel?empresa_id=uuid&fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```
Descarga: `reporte_encuestas_2025-11-28.xlsx`

#### Exportar a PDF (HU8)
```bash
GET /reportes/exportar/pdf
GET /reportes/exportar/pdf?encuesta_id=uuid
GET /reportes/exportar/pdf?empresa_id=uuid&fecha_inicio=2025-01-01
```
Descarga: `reporte_encuestas_2025-11-28.pdf`

## 🏗️ Estructura del Proyecto

```
src/
├── config/               # Configuraciones (DB, JWT)
├── common/              # Elementos compartidos
│   ├── decorators/
│   ├── guards/          # JwtAuthGuard
│   ├── interceptors/
│   └── filters/
├── database/
│   └── seeds/          # Seeders de datos de prueba
└── modules/
    ├── empresa/         # Gestión de licencias
    ├── usuario/         # Gestión de usuarios
    ├── rol/             # Gestión de roles y permisos
    ├── auth/            # Autenticación JWT
    ├── encuesta/        # CRUD de encuestas
    ├── pregunta/        # Tipos de preguntas
    ├── respuesta/       # Almacenamiento de respuestas
    └── reporte/         # Estadísticas y exportación
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

## 🎯 Características Completadas

✅ **Épica 1**: Gestión completa de empresas, usuarios y autenticación JWT  
✅ **Épica 2**: Administración de encuestas con 5 tipos de preguntas  
✅ **Épica 3**: Enlaces públicos sin autenticación para respuestas  
✅ **Épica 4**: Módulo de reportes con tabulación y exportación Excel/PDF  
✅ **Extra**: Sistema completo de roles y permisos dinámicos  
✅ **Extra**: Docker Compose con PostgreSQL y PgAdmin  
✅ **Extra**: Seeder de datos de prueba  

## 🚀 Posibles Mejoras Futuras

- Integración con WhatsApp para envío de encuestas
- Acortador de URLs personalizado
- Gráficos estadísticos interactivos en el frontend
- Sistema de notificaciones por email
- Exportación de reportes con gráficos embebidos
- API de webhooks para integraciones externas

## 👥 Autores

Sistema desarrollado para gestión de encuestas empresariales.

## 📄 Licencia

ISC
