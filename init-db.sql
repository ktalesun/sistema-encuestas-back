-- Script de inicialización de la base de datos
-- Se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear schema público si no existe
CREATE SCHEMA IF NOT EXISTS public;

-- Grant permisos
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Base de datos sistema_encuestas inicializada correctamente';
END $$;
