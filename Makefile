.PHONY: help install dev build start stop restart logs clean db-up db-down db-reset

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instalar dependencias
	pnpm install

dev: db-up ## Iniciar en modo desarrollo
	pnpm run start:dev

build: ## Compilar proyecto
	pnpm run build

start: ## Iniciar en producción
	pnpm run start:prod

lint: ## Ejecutar linter
	pnpm run lint

seed: ## Poblar base de datos con datos de prueba
	pnpm run seed

db-up: ## Levantar base de datos PostgreSQL
	docker-compose up -d postgres
	@echo "Esperando a que PostgreSQL esté listo..."
	@sleep 3
	@echo "PostgreSQL está corriendo en localhost:5432"

db-down: ## Detener base de datos
	docker-compose down

db-reset: ## Reiniciar base de datos (elimina datos)
	docker-compose down -v
	docker-compose up -d postgres
	@echo "Base de datos reiniciada"

pgadmin: ## Levantar PgAdmin
	docker-compose up -d pgadmin
	@echo "PgAdmin disponible en http://localhost:5050"
	@echo "Email: admin@admin.com | Password: admin123"

stop: ## Detener todos los contenedores
	docker-compose down

restart: ## Reiniciar contenedores
	docker-compose restart

logs: ## Ver logs de PostgreSQL
	docker-compose logs -f postgres

clean: ## Limpiar node_modules y dist
	rm -rf node_modules dist
	pnpm install
