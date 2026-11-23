#!/bin/sh
# Prueba de integración: comprueba que los contenedores se comunican por NOMBRE DE SERVICIO
# dentro de la red de Docker (nunca por localhost ni por IP). Si algo falla, termina con error
# y el build de Jenkins falla.
set -u
NET="${CI_NETWORK:-ci-app-network}"
CURL_IMAGE="curlimages/curl:8.10.1"
FAIL=0

# http METHOD URL [JSON]: devuelve el código HTTP, ejecutando curl DENTRO de la red de Docker.
http() {
  if [ "$1" = "POST" ]; then
    docker run --rm --network "$NET" "$CURL_IMAGE" -s -o /dev/null -w '%{http_code}' \
      -X POST -H 'Content-Type: application/json' -d "$3" "$2"
  else
    docker run --rm --network "$NET" "$CURL_IMAGE" -s -o /dev/null -w '%{http_code}' "$2"
  fi
}

check() { # nombre, patrón esperado, código obtenido
  if echo "$3" | grep -Eq "$2"; then
    echo "  [PASS] $1 -> HTTP $3"
  else
    echo "  [FAIL] $1 -> HTTP $3 (esperado: $2)"
    FAIL=1
  fi
}

echo "== Contenedores conectados a la red $NET =="
docker network inspect -f '{{range .Containers}}  {{.Name}}  {{.IPv4Address}}{{"\n"}}{{end}}' "$NET"

echo "== Esperando al backend (http://backend:3001/api) =="
i=0
until [ "$(http GET http://backend:3001/api)" = "200" ]; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "  [FAIL] el backend no respondió a tiempo"
    docker logs --tail 40 ci-api || true
    exit 1
  fi
  sleep 2
done

echo "== Pruebas de comunicación por nombre de servicio =="
check "PostgreSQL saludable (ci-db)" '^healthy$' "$(docker inspect -f '{{.State.Health.Status}}' ci-db)"
check "backend responde en http://backend:3001/api" '^200$' "$(http GET http://backend:3001/api)"
check "frontend responde en http://frontend/" '^200$' "$(http GET http://frontend/)"
check "frontend -> backend (proxy /api/ de Nginx, sin 5xx)" '^[24][0-9][0-9]$' "$(http GET http://frontend/api/)"
# Ida y vuelta completa: frontend -> backend -> PostgreSQL. El backend consulta la tabla de
# usuarios y responde 401 porque el usuario no existe. Si no alcanzara la base de datos
# respondería 500; si Nginx no alcanzara al backend respondería 502.
check "frontend -> backend -> postgres (login de usuario inexistente)" '^401$' \
  "$(http POST http://frontend/api/auth/login '{"email":"ci-smoke@example.com","password":"no-existe"}')"

if [ "$FAIL" -ne 0 ]; then
  echo "== RESULTADO: FALLÓ la verificación de comunicación =="
  exit 1
fi
echo "== RESULTADO: todos los contenedores se comunican por nombre de servicio =="
