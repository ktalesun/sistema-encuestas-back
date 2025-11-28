# 🐳 Guía de Configuración Docker - Sistema de Encuestas

## ✅ Estado de la Configuración

**PostgreSQL con Docker está configurado y funcionando correctamente.**

## 📦 Servicios Disponibles

### 1. PostgreSQL (Base de Datos Principal)
- **Imagen**: `postgres:16-alpine`
- **Puerto**: `5432`
- **Usuario**: `postgres`
- **Password**: `postgres123`
- **Base de datos**: `sistema_encuestas`
- **Healthcheck**: Activo
- **Volumen**: `postgres_data` (persistente)

### 2. PgAdmin (Administrador de BD - Opcional)
- **Puerto**: `5050`
- **URL**: http://localhost:5050
- **Email**: `admin@admin.com`
- **Password**: `admin123`

## 🚀 Comandos Rápidos

### Usando Makefile (Recomendado)
```bash
make help        # Ver todos los comandos
make db-up       # Levantar PostgreSQL
make dev         # Levantar DB + iniciar app
make db-down     # Detener PostgreSQL
make db-reset    # Reiniciar DB (elimina datos)
make pgadmin     # Levantar PgAdmin
make logs        # Ver logs de PostgreSQL
```

### Usando Docker Compose Directamente
```bash
# Levantar PostgreSQL
docker-compose up -d postgres

# Levantar PgAdmin
docker-compose up -d pgadmin

# Ver logs
docker-compose logs -f postgres

# Ver estado
docker-compose ps

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ Elimina datos)
docker-compose down -v
```

## 🔧 Verificación de la Configuración

```bash
# Ejecutar script de verificación
./check-setup.sh
```

El script verifica:
- ✅ Docker instalado
- ✅ Docker Compose instalado
- ✅ Archivo `.env` existe
- ✅ PostgreSQL está corriendo
- ✅ PostgreSQL acepta conexiones

## 📊 Conexión a PostgreSQL

### Desde la Aplicación NestJS
La aplicación se conecta automáticamente usando las variables en `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_DATABASE=sistema_encuestas
```

### Desde PgAdmin
1. Abrir http://localhost:5050
2. Login con `admin@admin.com` / `admin123`
3. Agregar nuevo servidor:
   - **Name**: Sistema Encuestas
   - **Host**: `host.docker.internal` (o `postgres` si está en Docker)
   - **Port**: `5432`
   - **Database**: `sistema_encuestas`
   - **Username**: `postgres`
   - **Password**: `postgres123`

### Desde CLI (psql)
```bash
# Conectarse desde el contenedor
docker-compose exec postgres psql -U postgres -d sistema_encuestas

# O desde tu máquina (si tienes psql instalado)
psql -h localhost -p 5432 -U postgres -d sistema_encuestas
```

## 📝 Tablas Creadas Automáticamente

TypeORM sincroniza automáticamente estas entidades:
- ✅ `empresas` - Gestión de licencias
- ✅ `roles` - Roles y permisos
- ✅ `usuarios` - Usuarios del sistema
- ✅ `encuestas` - Encuestas
- ✅ `preguntas` - Preguntas con tipos
- ✅ `respuestas` - Respuestas de encuestas

## 🔄 Flujo de Trabajo Completo

1. **Primera vez:**
   ```bash
   # Clonar/configurar proyecto
   cp .env.example .env
   pnpm install
   
   # Levantar base de datos
   make db-up
   
   # Iniciar aplicación (crea tablas automáticamente)
   make dev
   ```

2. **Desarrollo diario:**
   ```bash
   # Solo iniciar (DB + App)
   make dev
   ```

3. **Detener todo:**
   ```bash
   # Detener app (Ctrl+C)
   # Detener base de datos
   make db-down
   ```

## 🗄️ Persistencia de Datos

Los datos se guardan en volúmenes de Docker:
- `postgres_data`: Datos de PostgreSQL (persistente)
- `pgadmin_data`: Configuración de PgAdmin (persistente)

**Para eliminar todos los datos:**
```bash
docker-compose down -v  # ⚠️ Esto elimina TODO
```

## 🐛 Solución de Problemas

### Puerto 5432 ya en uso
```bash
# Ver qué está usando el puerto
lsof -i :5432

# Detener PostgreSQL local si existe
brew services stop postgresql  # macOS
sudo systemctl stop postgresql  # Linux
```

### Contenedor no inicia
```bash
# Ver logs detallados
docker-compose logs postgres

# Reiniciar contenedor
docker-compose restart postgres
```

### Resetear todo
```bash
# Detener y eliminar todo
docker-compose down -v

# Volver a levantar
docker-compose up -d postgres
```

### Base de datos corrupta
```bash
# Backup de datos (si es necesario)
docker-compose exec postgres pg_dump -U postgres sistema_encuestas > backup.sql

# Resetear
make db-reset

# Restaurar (si hiciste backup)
docker-compose exec -T postgres psql -U postgres sistema_encuestas < backup.sql
```

## 📈 Monitoreo

### Ver estado de salud
```bash
docker-compose ps
```

### Ver uso de recursos
```bash
docker stats sistema-encuestas-db
```

### Ver logs en tiempo real
```bash
docker-compose logs -f postgres
```

## 🔐 Seguridad

**⚠️ IMPORTANTE para Producción:**

1. Cambiar passwords en `.env`:
   ```env
   DB_PASSWORD=un_password_muy_seguro_aqui
   JWT_SECRET=clave_secreta_larga_y_compleja
   ```

2. No usar `synchronize: true` en producción
   - Cambiar en `database.config.ts`
   - Usar migraciones en su lugar

3. Configurar red interna de Docker

4. No exponer PgAdmin en producción

## 📚 Recursos Adicionales

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [TypeORM Docs](https://typeorm.io/)
- [NestJS TypeORM](https://docs.nestjs.com/techniques/database)

---

**✅ Sistema configurado y listo para desarrollo**

**Aplicación corriendo en:**
- API: http://localhost:3000
- Swagger: http://localhost:3000/api
- PgAdmin: http://localhost:5050 (si lo levantaste)
