// Pipeline de integración continua (Entrega 2).
// Jenkins gestiona los contenedores de la Entrega 1 (backend + PostgreSQL + frontend).
// Flujo: commit -> GitHub -> Jenkins (Poll SCM) -> Build -> Test -> post
//
// Credenciales (todas guardadas en Jenkins, ninguna en el código):
//   github-credentials : Username with password (usuario de GitHub + token) para clonar el frontend
//   env-backend-prod   : Secret file con el contenido de .env.prod del backend
//   env-frontend-prod  : Secret file con el contenido de .env.prod del frontend
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    // Poll SCM: Jenkins consulta GitHub cada ~2 minutos y construye si hay un push nuevo.
    // Consulta tanto este repositorio (backend) como el del frontend (se clona con "checkout").
    triggers {
        pollSCM('H/2 * * * *')
    }

    parameters {
        string(name: 'FRONTEND_REPO', defaultValue: 'https://github.com/ktalesun/Encuesthik_Frontend.git', description: 'Repositorio del frontend')
        string(name: 'FRONTEND_BRANCH', defaultValue: 'main', description: 'Rama del frontend')
    }

    environment {
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        CI_NETWORK = 'ci-app-network'
        // Los archivos ci/*.yml cambian nombres, puertos y red para no chocar con el stack local.
        BE_COMPOSE = 'docker compose -p encuestas-ci-be --project-directory backend -f backend/docker-compose.yml -f backend/ci/docker-compose.ci.yml'
        FE_COMPOSE = 'docker compose -p encuestas-ci-fe --project-directory frontend -f frontend/docker-compose.yml -f backend/ci/docker-compose.frontend.ci.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                dir('backend') {
                    checkout scm
                }
                dir('frontend') {
                    git url: params.FRONTEND_REPO, branch: params.FRONTEND_BRANCH, credentialsId: 'github-credentials'
                }
                // Los .env.prod viven en Jenkins como "Secret file"; se copian solo durante el build.
                withCredentials([
                    file(credentialsId: 'env-backend-prod', variable: 'ENV_BACKEND'),
                    file(credentialsId: 'env-frontend-prod', variable: 'ENV_FRONTEND')
                ]) {
                    sh 'cp "$ENV_BACKEND" backend/.env.prod && cp "$ENV_FRONTEND" frontend/.env.prod'
                }
            }
        }

        stage('Build') {
            steps {
                // Construye las imágenes de los dos servicios, etiquetadas con el número de build.
                sh '$BE_COMPOSE build backend'
                sh '$FE_COMPOSE build frontend'
                sh 'docker image ls --filter "reference=sistema-encuestas-api" --filter "reference=encuesthik-web"'
            }
        }

        stage('Test - Unitarias') {
            steps {
                sh 'sh backend/ci/unit-tests.sh'
            }
        }

        stage('Test - Comunicación') {
            steps {
                // Levanta PostgreSQL + backend (red ci-app-network) y luego el frontend, que se une a esa red.
                sh '$BE_COMPOSE up -d --wait postgres backend'
                sh '$FE_COMPOSE up -d --wait frontend'
                // Verifica la comunicación por NOMBRE DE SERVICIO; si algo falla, el build falla.
                sh 'sh backend/ci/smoke-test.sh'
            }
        }
    }

    post {
        always {
            sh '''
                $BE_COMPOSE logs --no-color > ci-logs-backend.txt 2>&1 || true
                $FE_COMPOSE logs --no-color > ci-logs-frontend.txt 2>&1 || true
                $FE_COMPOSE down -v --remove-orphans || true
                $BE_COMPOSE down -v --remove-orphans || true
                rm -f backend/.env.prod frontend/.env.prod
            '''
            archiveArtifacts artifacts: 'ci-logs-*.txt', allowEmptyArchive: true
        }
        success {
            echo "Build #${env.BUILD_NUMBER} OK: imágenes construidas y contenedores comunicándose por nombre de servicio."
        }
        failure {
            echo "Build #${env.BUILD_NUMBER} FALLÓ: revisa la salida de consola y los logs archivados (ci-logs-*.txt)."
        }
    }
}
