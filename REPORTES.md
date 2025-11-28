# Módulo de Reportes - Documentación Completa

## 📊 Descripción

El módulo de reportes proporciona capacidades avanzadas de análisis y exportación de datos de encuestas, implementando la **HU8: Tabulación y Estadísticas**.

## 🎯 Características

### 1. Tabulación Automática
- Agrupa respuestas por pregunta
- Calcula frecuencias absolutas
- Calcula porcentajes con 2 decimales
- Ordena resultados por frecuencia descendente

### 2. Filtros Dinámicos
- **Por Empresa**: Filtra todas las encuestas de una empresa específica
- **Por Encuesta**: Estadísticas de una encuesta en particular
- **Por Rango de Fechas**: Respuestas entre fecha_inicio y fecha_fin
- **Combinaciones**: Puedes combinar múltiples filtros

### 3. Formatos de Exportación
- **JSON**: Para integración con aplicaciones
- **Excel (.xlsx)**: Con formato, colores y múltiples hojas
- **PDF**: Documento listo para imprimir o compartir

## 📡 Endpoints Disponibles

### 1. Obtener Estadísticas (JSON)

```http
GET /reportes/estadisticas
```

**Query Parameters:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `empresa_id` | UUID | No | Filtrar por empresa |
| `encuesta_id` | UUID | No | Filtrar por encuesta específica |
| `fecha_inicio` | Date | No | Inicio del rango de fechas |
| `fecha_fin` | Date | No | Fin del rango de fechas |

**Ejemplos:**

```bash
# Todas las estadísticas
GET /reportes/estadisticas

# Una encuesta específica
GET /reportes/estadisticas?encuesta_id=9b8e0f23-5g9d-5c4b-0d32-2345678901bc

# Por empresa y rango de fechas
GET /reportes/estadisticas?empresa_id=8a7d9e12-4f8c-4b3a-9c21-1234567890ab&fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

**Respuesta Ejemplo:**

```json
[
  {
    "encuesta_id": "9b8e0f23-5g9d-5c4b-0d32-2345678901bc",
    "titulo": "Encuesta de Satisfacción 2025",
    "total_respuestas": 150,
    "fecha_inicio": "2025-01-01T00:00:00.000Z",
    "fecha_fin": "2025-12-31T00:00:00.000Z",
    "preguntas": [
      {
        "pregunta_id": "abc-123-def",
        "pregunta_texto": "¿Cómo califica nuestro servicio?",
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
            "frecuencia": 15,
            "porcentaje": 10.0
          },
          {
            "valor": "Malo",
            "frecuencia": 5,
            "porcentaje": 3.33
          }
        ]
      },
      {
        "pregunta_id": "def-456-ghi",
        "pregunta_texto": "Del 0 al 10, ¿qué tan satisfecho está?",
        "tipo": "numerica",
        "total_respuestas": 150,
        "respuestas": [
          {
            "valor": 10,
            "frecuencia": 60,
            "porcentaje": 40.0
          },
          {
            "valor": 9,
            "frecuencia": 45,
            "porcentaje": 30.0
          },
          {
            "valor": 8,
            "frecuencia": 30,
            "porcentaje": 20.0
          }
        ]
      }
    ]
  }
]
```

### 2. Exportar a Excel

```http
GET /reportes/exportar/excel
```

**Query Parameters:** Mismos que estadísticas (empresa_id, encuesta_id, fecha_inicio, fecha_fin)

**Respuesta:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="reporte_encuestas_2025-11-28.xlsx"`

**Características del Excel:**
- Una hoja por cada encuesta
- Formato con negritas y colores
- Anchos de columna automáticos
- Metadata de la encuesta en la parte superior
- Tabla por cada pregunta con:
  - Respuesta | Frecuencia | Porcentaje
  - Totales calculados

**Ejemplo de uso:**

```bash
# Con curl
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/reportes/exportar/excel?encuesta_id=uuid" \
  --output reporte.xlsx

# Con navegador
http://localhost:3000/reportes/exportar/excel?empresa_id=uuid&fecha_inicio=2025-01-01
```

### 3. Exportar a PDF

```http
GET /reportes/exportar/pdf
```

**Query Parameters:** Mismos que estadísticas

**Respuesta:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="reporte_encuestas_2025-11-28.pdf"`

**Características del PDF:**
- Título y fecha de generación
- Una página por encuesta (si es necesario)
- Metadata de cada encuesta
- Listado de respuestas con bullets
- Frecuencias y porcentajes formateados
- Totales por pregunta

**Ejemplo de uso:**

```bash
# Con curl
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/reportes/exportar/pdf" \
  --output reporte.pdf
```

## 🔐 Autenticación

Todos los endpoints del módulo de reportes requieren autenticación JWT:

```bash
Authorization: Bearer {token}
```

## 💻 Uso desde Frontend

### JavaScript/TypeScript

```typescript
// Obtener estadísticas
const response = await fetch('/reportes/estadisticas?encuesta_id=uuid', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const stats = await response.json();

// Descargar Excel
const blob = await fetch('/reportes/exportar/excel?encuesta_id=uuid', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.blob());

const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'reporte.xlsx';
a.click();
```

### React Example

```tsx
import { useState } from 'react';

function ReporteComponent() {
  const [loading, setLoading] = useState(false);

  const descargarExcel = async (encuestaId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/reportes/exportar/excel?encuesta_id=${encuestaId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${encuestaId}.xlsx`;
      a.click();
    } catch (error) {
      console.error('Error descargando reporte:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={() => descargarExcel('uuid')} disabled={loading}>
      {loading ? 'Generando...' : 'Descargar Excel'}
    </button>
  );
}
```

## 📈 Casos de Uso

### 1. Dashboard de Administración
```typescript
// Obtener estadísticas de todas las encuestas activas
const stats = await fetch('/reportes/estadisticas');
// Mostrar en gráficos: total_respuestas, porcentajes por opción
```

### 2. Reporte Mensual por Empresa
```bash
GET /reportes/exportar/pdf?empresa_id=uuid&fecha_inicio=2025-11-01&fecha_fin=2025-11-30
```

### 3. Análisis de Encuesta Específica
```bash
GET /reportes/estadisticas?encuesta_id=uuid
# Procesar respuestas para gráficos de pastel, barras, etc.
```

### 4. Exportación Masiva
```typescript
// Exportar todas las encuestas de un periodo
const empresas = await getEmpresas();
for (const empresa of empresas) {
  await descargarExcel({
    empresa_id: empresa.id,
    fecha_inicio: '2025-01-01',
    fecha_fin: '2025-12-31'
  });
}
```

## 🎨 Formato de Excel

El archivo Excel generado incluye:

```
Hoja 1: "Encuesta de Satisfacción"
┌────────────────────────────────────────────────┐
│     Encuesta de Satisfacción 2025              │  ← Título centrado
├────────────────────────────────────────────────┤
│ Total de respuestas: 150                       │
│ Fecha inicio: 2025-01-01                       │
│ Fecha fin: 2025-12-31                          │
├────────────────────────────────────────────────┤
│                                                │
│ ¿Cómo califica nuestro servicio?              │  ← Pregunta
│ Tipo: opcion_unica                             │
├────────────────────┬───────────┬──────────────┤
│ Respuesta          │ Frecuencia│ Porcentaje   │  ← Headers con fondo gris
├────────────────────┼───────────┼──────────────┤
│ Excelente          │    80     │  53.33%      │
│ Bueno              │    50     │  33.33%      │
│ Regular            │    15     │  10.0%       │
│ Malo               │     5     │  3.33%       │
├────────────────────┼───────────┼──────────────┤
│ Total              │   150     │              │  ← Total en negrita
└────────────────────┴───────────┴──────────────┘
```

## 🎨 Formato de PDF

El PDF incluye:

```
╔════════════════════════════════════════════════╗
║          Reporte de Encuestas                  ║
╠════════════════════════════════════════════════╣
║                                                ║
║ Encuesta de Satisfacción 2025                 ║
║ ──────────────────────────────                 ║
║                                                ║
║ Total de respuestas: 150                       ║
║ Fecha inicio: 01/01/2025                       ║
║ Fecha fin: 31/12/2025                          ║
║                                                ║
║ ¿Cómo califica nuestro servicio?              ║
║ Tipo: opcion_unica                             ║
║                                                ║
║   • Excelente: 80 (53.33%)                    ║
║   • Bueno: 50 (33.33%)                        ║
║   • Regular: 15 (10.0%)                       ║
║   • Malo: 5 (3.33%)                           ║
║                                                ║
║ Total de respuestas: 150                       ║
╚════════════════════════════════════════════════╝
```

## 🔧 Implementación Técnica

### Dependencias
```json
{
  "exceljs": "^4.4.0",
  "pdfkit": "^0.17.2",
  "@types/pdfkit": "^0.17.4"
}
```

### Arquitectura

```
ReporteModule
├── reporte.controller.ts    # 3 endpoints GET
├── reporte.service.ts        # Lógica de negocio
├── reporte.module.ts         # Configuración
└── dto/
    └── filtros-reporte.dto.ts  # Validación de filtros
```

### Flujo de Datos

```
1. Request → Controller
2. Validación de FiltrosReporteDto
3. Service.obtenerEstadisticas()
   ├─ Query a Respuestas con filtros
   ├─ Agrupar por Encuesta
   └─ Tabular por Pregunta
4. Para Excel/PDF:
   ├─ obtenerEstadisticas()
   ├─ Generar documento
   └─ Return Buffer
5. Response con archivo
```

## 🐛 Manejo de Errores

```typescript
// Sin datos
404 Not Found
{
  "statusCode": 404,
  "message": "No hay datos para exportar"
}

// Filtros inválidos
400 Bad Request
{
  "statusCode": 400,
  "message": ["encuesta_id must be a UUID"],
  "error": "Bad Request"
}

// Sin autenticación
401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 📊 Análisis de Datos

El servicio calcula automáticamente:

- **Frecuencia**: Cantidad de veces que apareció cada respuesta
- **Porcentaje**: (Frecuencia / Total) × 100, redondeado a 2 decimales
- **Ordenamiento**: Por frecuencia descendente (más común primero)

### Ejemplo de Cálculo

```typescript
Respuestas a "¿Cómo califica el servicio?":
["Excelente", "Bueno", "Excelente", "Regular", "Excelente"]

Frecuencias:
- Excelente: 3
- Bueno: 1
- Regular: 1

Porcentajes:
- Excelente: (3/5) × 100 = 60.0%
- Bueno: (1/5) × 100 = 20.0%
- Regular: (1/5) × 100 = 20.0%

Resultado (ordenado):
[
  { valor: "Excelente", frecuencia: 3, porcentaje: 60.0 },
  { valor: "Bueno", frecuencia: 1, porcentaje: 20.0 },
  { valor: "Regular", frecuencia: 1, porcentaje: 20.0 }
]
```

## ✅ Testing

Puedes probar los endpoints con:

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techsolutions.com","password":"Admin123!"}' \
  | jq -r '.access_token')

# 2. Obtener estadísticas
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/reportes/estadisticas | jq

# 3. Descargar Excel
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/reportes/exportar/excel \
  --output reporte.xlsx

# 4. Descargar PDF
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/reportes/exportar/pdf \
  --output reporte.pdf
```

## 🎓 Mejores Prácticas

1. **Paginación**: Para grandes volúmenes, considera implementar paginación
2. **Caché**: Cachear estadísticas que no cambian frecuentemente
3. **Límites**: Establecer límites de tiempo para exportaciones grandes
4. **Validación**: Siempre validar fechas y UUIDs antes de consultar
5. **Monitoreo**: Log de exportaciones para auditoría

---

**Documentación del Sistema de Encuestas** | Módulo de Reportes v1.0
