#!/bin/bash

echo "🔍 Verificando configuración del proyecto..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi
echo "✅ Docker instalado"

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi
echo "✅ Docker Compose instalado"

# Verificar archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado, creándolo desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env existe"
fi

# Verificar contenedor de PostgreSQL
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL está corriendo"
    
    # Esperar a que PostgreSQL esté listo
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    sleep 3
    
    # Probar conexión
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        echo "✅ PostgreSQL está aceptando conexiones"
    else
        echo "⚠️  PostgreSQL no está respondiendo aún"
    fi
else
    echo "⚠️  PostgreSQL no está corriendo"
    echo "   Ejecuta: docker-compose up -d postgres"
fi

echo ""
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "📝 Información de conexión:"
echo "   Host: localhost"
echo "   Puerto: 5432"
echo "   Usuario: postgres"
echo "   Password: postgres123"
echo "   Database: sistema_encuestas"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo "   make dev"
echo "   o: pnpm run start:dev"
