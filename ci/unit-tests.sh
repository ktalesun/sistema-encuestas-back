#!/bin/sh
# Pruebas unitarias del backend (Jest) dentro de un contenedor desechable node:20-alpine.
# Se usa "docker cp" en lugar de un volumen porque Jenkins corre en un contenedor y la ruta
# de su workspace no existe en el host de Docker.
set -eu
cd "$(dirname "$0")/.."
NAME="ci-unit-tests-$$"
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT

docker create --name "$NAME" -w /tmp/app node:20-alpine sh -c \
  'apk add --no-cache python3 make g++ >/dev/null && corepack enable && pnpm install --frozen-lockfile && pnpm test' >/dev/null
docker cp . "$NAME":/tmp/app
docker start -a "$NAME"
