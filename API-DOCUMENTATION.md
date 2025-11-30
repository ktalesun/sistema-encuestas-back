# API Documentation - Sistema de Encuestas

Documentación completa de endpoints para el frontend React.

**Base URL:** `http://localhost:3001`  
**Swagger UI:** `http://localhost:3001/api`

---

## 📑 Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Empresas/Licencias](#empresaslicencias)
3. [Usuarios](#usuarios)
4. [Roles](#roles)
5. [Encuestas](#encuestas)
6. [Respuestas](#respuestas)
7. [Reportes](#reportes)
8. [Modelos de Datos](#modelos-de-datos)

---

## 🔐 Autenticación

### Login

Endpoint público para obtener token JWT.

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@techsolutions.com",
  "password": "Admin123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": "uuid",
    "nombre": "Administrador",
    "email": "admin@techsolutions.com",
    "rol": {
      "id_rol": "uuid",
      "nombre": "Administrador",
      "permisos": ["usuarios.crear", "encuestas.crear", ...]
    },
    "empresa": {
      "id_empresa": "uuid",
      "nombre": "Tech Solutions",
      "estado": "activa"
    }
  }
}
```

**Errores:**
- `401`: Credenciales inválidas
- `403`: Cuenta inactiva o licencia expirada

**Uso en React:**
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const data = await response.json();
  localStorage.setItem('token', data.access_token);
  return data;
};
```

---

## 🏢 Empresas/Licencias

Todos los endpoints requieren autenticación JWT.

### Listar Empresas

```http
GET /empresas
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_empresa": "uuid",
    "nombre": "Tech Solutions S.A.S.",
    "nit": "900123456-1",
    "fecha_inicio": "2025-01-01",
    "fecha_expiracion": "2026-01-01",
    "estado": "activa",
    "created_at": "2025-11-01T10:00:00Z",
    "updated_at": "2025-11-01T10:00:00Z"
  }
]
```

### Obtener Empresa por ID

```http
GET /empresas/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id_empresa": "uuid",
  "nombre": "Tech Solutions S.A.S.",
  "nit": "900123456-1",
  "fecha_inicio": "2025-01-01",
  "fecha_expiracion": "2026-01-01",
  "estado": "activa",
  "created_at": "2025-11-01T10:00:00Z",
  "updated_at": "2025-11-01T10:00:00Z"
}
```

### Crear Empresa

```http
POST /empresas
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "Nueva Empresa S.A.S.",
  "nit": "900999888-7",
  "fecha_inicio": "2025-12-01",
  "fecha_expiracion": "2026-12-01",
  "estado": "activa"
}
```

**Response (201):**
```json
{
  "id_empresa": "new-uuid",
  "nombre": "Nueva Empresa S.A.S.",
  "nit": "900999888-7",
  "fecha_inicio": "2025-12-01",
  "fecha_expiracion": "2026-12-01",
  "estado": "activa"
}
```

**Validaciones:**
- `nombre`: string, requerido
- `nit`: string, requerido, único
- `fecha_inicio`: date, requerido
- `fecha_expiracion`: date, requerido
- `estado`: "activa" | "inactiva"

### Actualizar Empresa

```http
PUT /empresas/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "Empresa Actualizada",
  "fecha_expiracion": "2027-01-01"
}
```

### Actualizar Estado de Empresa

```http
PATCH /empresas/:id/estado
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "estado": "inactiva"
}
```

### Eliminar Empresa

```http
DELETE /empresas/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Empresa eliminada exitosamente"
}
```

---

## 👥 Usuarios

### Listar Usuarios

```http
GET /usuarios
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_usuario": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@empresa.com",
    "estado": "activo",
    "empresa": {
      "id_empresa": "uuid",
      "nombre": "Tech Solutions"
    },
    "rol": {
      "id_rol": "uuid",
      "nombre": "Editor"
    },
    "created_at": "2025-11-01T10:00:00Z"
  }
]
```

### Obtener Usuario por ID

```http
GET /usuarios/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id_usuario": "uuid",
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "estado": "activo",
  "empresa": {
    "id_empresa": "uuid",
    "nombre": "Tech Solutions",
    "nit": "900123456-1"
  },
  "rol": {
    "id_rol": "uuid",
    "nombre": "Editor",
    "permisos": ["encuestas.crear", "encuestas.editar"]
  }
}
```

### Crear Usuario

```http
POST /usuarios
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "María García",
  "email": "maria@empresa.com",
  "password": "Password123!",
  "empresa_id": "uuid-de-empresa",
  "rol_id": "uuid-de-rol"
}
```

**Response (201):**
```json
{
  "id_usuario": "new-uuid",
  "nombre": "María García",
  "email": "maria@empresa.com",
  "estado": "activo",
  "empresa_id": "uuid-de-empresa",
  "rol_id": "uuid-de-rol"
}
```

**Validaciones:**
- `nombre`: string, requerido
- `email`: email válido, requerido, único
- `password`: string, mínimo 6 caracteres, requerido
- `empresa_id`: UUID válido, requerido
- `rol_id`: UUID válido, requerido

### Actualizar Usuario

```http
PUT /usuarios/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "María García López",
  "email": "maria.garcia@empresa.com",
  "rol_id": "otro-uuid-de-rol"
}
```

### Actualizar Estado de Usuario

```http
PATCH /usuarios/:id/estado
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "estado": "inactivo"
}
```

### Eliminar Usuario

```http
DELETE /usuarios/:id
Authorization: Bearer {token}
```

---

## 🔑 Roles

### Listar Roles

```http
GET /roles
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_rol": "uuid",
    "nombre": "Administrador",
    "permisos": [
      "usuarios.crear",
      "usuarios.editar",
      "usuarios.eliminar",
      "encuestas.crear",
      "encuestas.editar",
      "encuestas.eliminar",
      "reportes.ver"
    ],
    "created_at": "2025-11-01T10:00:00Z"
  },
  {
    "id_rol": "uuid",
    "nombre": "Editor",
    "permisos": [
      "encuestas.crear",
      "encuestas.editar"
    ]
  }
]
```

### Obtener Rol por ID

```http
GET /roles/:id
Authorization: Bearer {token}
```

### Crear Rol

```http
POST /roles
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "Moderador",
  "permisos": [
    "encuestas.ver",
    "respuestas.ver",
    "reportes.ver"
  ]
}
```

**Response (201):**
```json
{
  "id_rol": "new-uuid",
  "nombre": "Moderador",
  "permisos": [
    "encuestas.ver",
    "respuestas.ver",
    "reportes.ver"
  ]
}
```

### Actualizar Rol

```http
PUT /roles/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "nombre": "Moderador Senior",
  "permisos": [
    "encuestas.ver",
    "encuestas.editar",
    "respuestas.ver",
    "reportes.ver"
  ]
}
```

### Agregar Permiso a Rol

```http
PATCH /roles/:id/permisos/add
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "permiso": "encuestas.eliminar"
}
```

### Remover Permiso de Rol

```http
PATCH /roles/:id/permisos/remove
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "permiso": "encuestas.eliminar"
}
```

### Eliminar Rol

```http
DELETE /roles/:id
Authorization: Bearer {token}
```

**Nota:** No se puede eliminar un rol que tenga usuarios asignados.

---

## 📋 Encuestas

### Listar Encuestas

```http
GET /encuestas
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_encuesta": "uuid",
    "titulo": "Encuesta de Satisfacción 2025",
    "descripcion": "Medir satisfacción del cliente",
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31",
    "estado": "publicada",
    "url_publica": "/encuestas/public/empresa-uuid/encuesta-uuid",
    "empresa": {
      "id_empresa": "uuid",
      "nombre": "Tech Solutions"
    },
    "preguntas": [
      {
        "id_pregunta": "uuid",
        "texto": "¿Cómo califica nuestro servicio?",
        "tipo": "opcion_unica",
        "opciones": ["Excelente", "Bueno", "Regular", "Malo"],
        "requerida": true,
        "orden": 1
      }
    ],
    "created_at": "2025-11-01T10:00:00Z"
  }
]
```

### Obtener Encuesta por ID

```http
GET /encuestas/:id
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id_encuesta": "uuid",
  "titulo": "Encuesta de Satisfacción 2025",
  "descripcion": "Medir satisfacción del cliente",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "estado": "publicada",
  "url_publica": "/encuestas/public/empresa-uuid/encuesta-uuid",
  "empresa": {
    "id_empresa": "uuid",
    "nombre": "Tech Solutions"
  },
  "preguntas": [
    {
      "id_pregunta": "uuid",
      "texto": "¿Cómo califica nuestro servicio?",
      "tipo": "opcion_unica",
      "opciones": ["Excelente", "Bueno", "Regular", "Malo"],
      "requerida": true,
      "orden": 1
    },
    {
      "id_pregunta": "uuid",
      "texto": "Del 0 al 10, ¿qué tan satisfecho está?",
      "tipo": "numerica",
      "rango": { "min": 0, "max": 10 },
      "requerida": true,
      "orden": 2
    }
  ]
}
```

### Crear Encuesta

```http
POST /encuestas
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "titulo": "Encuesta de Producto",
  "descripcion": "Evaluación de nuevo producto",
  "fecha_inicio": "2025-12-01",
  "fecha_fin": "2025-12-31",
  "empresa_id": "uuid-de-empresa",
  "preguntas": [
    {
      "texto": "¿Compraría este producto?",
      "tipo": "si_no",
      "requerida": true,
      "orden": 1
    },
    {
      "texto": "¿Cómo calificaría la calidad?",
      "tipo": "estrellas",
      "rango": { "min": 0, "max": 5 },
      "requerida": true,
      "orden": 2
    },
    {
      "texto": "Seleccione su rango de edad",
      "tipo": "opcion_unica",
      "opciones": ["18-25", "26-35", "36-45", "46+"],
      "requerida": false,
      "orden": 3
    },
    {
      "texto": "Comentarios adicionales",
      "tipo": "texto",
      "requerida": false,
      "orden": 4
    }
  ]
}
```

**Response (201):**
```json
{
  "id_encuesta": "new-uuid",
  "titulo": "Encuesta de Producto",
  "descripcion": "Evaluación de nuevo producto",
  "fecha_inicio": "2025-12-01",
  "fecha_fin": "2025-12-31",
  "estado": "borrador",
  "url_publica": "/encuestas/public/empresa-uuid/new-uuid",
  "empresa_id": "uuid-de-empresa",
  "preguntas": [...]
}
```

**Tipos de Pregunta:**
- `texto`: Respuesta de texto libre
- `opcion_unica`: Selección única (requiere `opciones: string[]`)
- `si_no`: Respuesta booleana
- `numerica`: Número en rango (requiere `rango: {min, max}`)
- `estrellas`: Calificación con estrellas (requiere `rango: {min, max}`)

### Actualizar Encuesta

```http
PUT /encuestas/:id
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "titulo": "Encuesta Actualizada",
  "descripcion": "Nueva descripción",
  "estado": "publicada"
}
```

### Actualizar Estado de Encuesta

```http
PATCH /encuestas/:id/estado
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "estado": "publicada"
}
```

**Estados permitidos:**
- `borrador`: En edición
- `publicada`: Activa para respuestas
- `inactiva`: Desactivada temporalmente
- `archivada`: Finalizada permanentemente

### Duplicar Encuesta

```http
POST /encuestas/:id/duplicar
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "id_encuesta": "new-uuid",
  "titulo": "Encuesta de Satisfacción 2025 (Copia)",
  "estado": "borrador",
  "preguntas": [...] // Mismas preguntas de la original
}
```

### Obtener Encuesta Pública (SIN AUTENTICACIÓN)

```http
GET /encuestas/public/:empresaId/:encuestaId
```

**Response (200):**
```json
{
  "id_encuesta": "uuid",
  "titulo": "Encuesta de Satisfacción 2025",
  "descripcion": "Medir satisfacción del cliente",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "estado": "publicada",
  "preguntas": [
    {
      "id_pregunta": "uuid",
      "texto": "¿Cómo califica nuestro servicio?",
      "tipo": "opcion_unica",
      "opciones": ["Excelente", "Bueno", "Regular", "Malo"],
      "requerida": true,
      "orden": 1
    }
  ]
}
```

**Errores:**
- `400`: Encuesta cerrada o no disponible
- `404`: Encuesta no encontrada

**Uso en React:**
```typescript
// No requiere token
const obtenerEncuestaPublica = async (empresaId: string, encuestaId: string) => {
  const response = await fetch(
    `http://localhost:3001/encuestas/public/${empresaId}/${encuestaId}`
  );
  return response.json();
};
```

### Eliminar Encuesta

```http
DELETE /encuestas/:id
Authorization: Bearer {token}
```

---

## 📝 Respuestas

### Enviar Respuesta (SIN AUTENTICACIÓN)

Endpoint público para que usuarios externos respondan encuestas.

```http
POST /respuestas
```

**Request Body:**
```json
{
  "encuesta_id": "uuid-de-encuesta",
  "respuestas": [
    {
      "pregunta_id": "uuid-pregunta-1",
      "respuesta": "Excelente"
    },
    {
      "pregunta_id": "uuid-pregunta-2",
      "respuesta": 9
    },
    {
      "pregunta_id": "uuid-pregunta-3",
      "respuesta": true
    },
    {
      "pregunta_id": "uuid-pregunta-4",
      "respuesta": "Me gustó mucho el servicio"
    }
  ],
  "terceros": {
    "nombre": "Juan Cliente",
    "email": "juan@cliente.com",
    "telefono": "+57 300 1234567"
  }
}
```

**Response (201):**
```json
{
  "id_respuesta": "new-uuid",
  "encuesta_id": "uuid-de-encuesta",
  "respuestas_json": [...],
  "datos_tercero": {...},
  "created_at": "2025-11-30T15:30:00Z"
}
```

**Validaciones:**
- La encuesta debe estar en estado `publicada`
- `fecha_fin` debe ser mayor a hoy
- Preguntas requeridas deben tener respuesta

**Uso en React:**
```typescript
const enviarRespuesta = async (encuestaId: string, respuestas: any[], terceros?: any) => {
  const response = await fetch('http://localhost:3001/respuestas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      encuesta_id: encuestaId,
      respuestas,
      terceros
    })
  });
  
  if (!response.ok) throw new Error('Error al enviar respuesta');
  return response.json();
};
```

### Listar Respuestas de una Encuesta

```http
GET /respuestas?encuesta_id=uuid
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id_respuesta": "uuid",
    "encuesta_id": "uuid",
    "respuestas_json": [
      {
        "pregunta_id": "uuid",
        "respuesta": "Excelente"
      }
    ],
    "datos_tercero": {
      "nombre": "Juan Cliente",
      "email": "juan@cliente.com"
    },
    "created_at": "2025-11-30T15:30:00Z"
  }
]
```

### Obtener Respuesta por ID

```http
GET /respuestas/:id
Authorization: Bearer {token}
```

---

## 📊 Reportes

### Obtener Estadísticas y Tabulación

```http
GET /reportes/estadisticas
Authorization: Bearer {token}
```

**Query Parameters:**
- `empresa_id` (opcional): UUID de empresa
- `encuesta_id` (opcional): UUID de encuesta
- `fecha_inicio` (opcional): Formato YYYY-MM-DD
- `fecha_fin` (opcional): Formato YYYY-MM-DD

**Ejemplos:**
```
GET /reportes/estadisticas
GET /reportes/estadisticas?encuesta_id=uuid
GET /reportes/estadisticas?empresa_id=uuid&fecha_inicio=2025-01-01&fecha_fin=2025-12-31
```

**Response (200):**
```json
[
  {
    "encuesta_id": "uuid",
    "titulo": "Encuesta de Satisfacción 2025",
    "total_respuestas": 150,
    "fecha_inicio": "2025-01-01T00:00:00.000Z",
    "fecha_fin": "2025-12-31T00:00:00.000Z",
    "preguntas": [
      {
        "pregunta_id": "uuid",
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
        "pregunta_id": "uuid",
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
          },
          {
            "valor": 7,
            "frecuencia": 15,
            "porcentaje": 10.0
          }
        ]
      }
    ]
  }
]
```

**Uso en React:**
```typescript
const obtenerEstadisticas = async (filtros?: {
  empresa_id?: string;
  encuesta_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}) => {
  const params = new URLSearchParams(filtros as any);
  const response = await fetch(
    `http://localhost:3001/reportes/estadisticas?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return response.json();
};
```

### Exportar a Excel

```http
GET /reportes/exportar/excel
Authorization: Bearer {token}
```

**Query Parameters:** (Mismos que estadísticas)
- `empresa_id` (opcional)
- `encuesta_id` (opcional)
- `fecha_inicio` (opcional)
- `fecha_fin` (opcional)

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Archivo: `reporte_encuestas_YYYY-MM-DD.xlsx`

**Uso en React:**
```typescript
const descargarExcel = async (filtros?: any) => {
  const params = new URLSearchParams(filtros);
  const response = await fetch(
    `http://localhost:3001/reportes/exportar/excel?${params}`,
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
  a.download = `reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
};
```

### Exportar a PDF

```http
GET /reportes/exportar/pdf
Authorization: Bearer {token}
```

**Query Parameters:** (Mismos que estadísticas)

**Response:**
- Content-Type: `application/pdf`
- Archivo: `reporte_encuestas_YYYY-MM-DD.pdf`

**Uso en React:**
```typescript
const descargarPDF = async (filtros?: any) => {
  const params = new URLSearchParams(filtros);
  const response = await fetch(
    `http://localhost:3001/reportes/exportar/pdf?${params}`,
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
  a.download = `reporte_${new Date().toISOString().split('T')[0]}.pdf`;
  a.click();
};
```

---

## 📦 Modelos de Datos

### Empresa

```typescript
interface Empresa {
  id_empresa: string;
  nombre: string;
  nit: string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_expiracion: string; // YYYY-MM-DD
  estado: 'activa' | 'inactiva';
  created_at: string;
  updated_at: string;
}
```

### Usuario

```typescript
interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'inactivo';
  empresa_id: string;
  rol_id: string;
  empresa?: Empresa;
  rol?: Rol;
  created_at: string;
  updated_at: string;
}
```

### Rol

```typescript
interface Rol {
  id_rol: string;
  nombre: string;
  permisos: string[];
  created_at: string;
  updated_at: string;
}
```

### Encuesta

```typescript
interface Encuesta {
  id_encuesta: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string; // YYYY-MM-DD
  estado: 'borrador' | 'publicada' | 'inactiva' | 'archivada';
  url_publica: string;
  empresa_id: string;
  empresa?: Empresa;
  preguntas?: Pregunta[];
  created_at: string;
  updated_at: string;
}
```

### Pregunta

```typescript
type TipoPregunta = 'texto' | 'opcion_unica' | 'si_no' | 'numerica' | 'estrellas';

interface Pregunta {
  id_pregunta: string;
  texto: string;
  tipo: TipoPregunta;
  opciones?: string[]; // Para opcion_unica
  rango?: { min: number; max: number }; // Para numerica y estrellas
  requerida: boolean;
  orden: number;
  encuesta_id: string;
  created_at: string;
  updated_at: string;
}
```

### Respuesta

```typescript
interface RespuestaItem {
  pregunta_id: string;
  respuesta: string | number | boolean;
}

interface Respuesta {
  id_respuesta: string;
  encuesta_id: string;
  respuestas_json: RespuestaItem[];
  datos_tercero?: {
    nombre?: string;
    email?: string;
    telefono?: string;
    [key: string]: any;
  };
  created_at: string;
}
```

### Estadísticas

```typescript
interface EstadisticaRespuesta {
  valor: string | number;
  frecuencia: number;
  porcentaje: number;
}

interface EstadisticaPregunta {
  pregunta_id: string;
  pregunta_texto: string;
  tipo: TipoPregunta;
  total_respuestas: number;
  respuestas: EstadisticaRespuesta[];
}

interface EstadisticasEncuesta {
  encuesta_id: string;
  titulo: string;
  total_respuestas: number;
  fecha_inicio: string;
  fecha_fin: string;
  preguntas: EstadisticaPregunta[];
}
```

---

## 🔧 Utilidades para React

### Axios Config

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Custom Hook para Autenticación

```typescript
import { useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  usuario: any | null;
  loading: boolean;
}

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('token'),
    usuario: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validar token o cargar datos del usuario
      setAuth({ token, usuario: null, loading: false });
    } else {
      setAuth({ token: null, usuario: null, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    setAuth({ token: data.access_token, usuario: data.usuario, loading: false });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, usuario: null, loading: false });
  };

  return { ...auth, login, logout };
};
```

### Service Example: EncuestasService

```typescript
import api from './axios-config';

class EncuestasService {
  async listar() {
    const response = await api.get('/encuestas');
    return response.data;
  }

  async obtenerPorId(id: string) {
    const response = await api.get(`/encuestas/${id}`);
    return response.data;
  }

  async crear(data: any) {
    const response = await api.post('/encuestas', data);
    return response.data;
  }

  async actualizar(id: string, data: any) {
    const response = await api.put(`/encuestas/${id}`, data);
    return response.data;
  }

  async eliminar(id: string) {
    const response = await api.delete(`/encuestas/${id}`);
    return response.data;
  }

  async duplicar(id: string) {
    const response = await api.post(`/encuestas/${id}/duplicar`);
    return response.data;
  }

  async obtenerPublica(empresaId: string, encuestaId: string) {
    // No requiere token
    const response = await fetch(
      `http://localhost:3001/encuestas/public/${empresaId}/${encuestaId}`
    );
    return response.json();
  }
}

export default new EncuestasService();
```

---

## 🚨 Manejo de Errores

Todos los endpoints pueden retornar los siguientes códigos de estado:

### Errores Comunes

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": ["email debe ser un correo válido", "nombre no debe estar vacío"],
  "error": "Bad Request"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Cuenta inactiva o licencia expirada"
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Encuesta no encontrada"
}
```

**500 Internal Server Error**
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## 🧪 Testing con Usuarios de Prueba

Después de ejecutar el seeder (`pnpm run seed`), puedes usar estas credenciales:

### Administrador
```json
{
  "email": "admin@techsolutions.com",
  "password": "Admin123!"
}
```
**Permisos:** Todos

### Editor
```json
{
  "email": "juan@techsolutions.com",
  "password": "Editor123!"
}
```
**Permisos:** Crear/Editar encuestas

### Visualizador
```json
{
  "email": "maria@innovacion.com",
  "password": "Viewer123!"
}
```
**Permisos:** Solo lectura

---

## 📚 Recursos Adicionales

- **Swagger UI:** `http://localhost:3001/api` - Interfaz interactiva para probar endpoints
- **Repositorio:** [GitHub - ktalesun/sistema-encuestas-back](https://github.com/ktalesun/sistema-encuestas-back)
- **Documentación de Reportes:** Ver archivo `REPORTES.md` para detalles técnicos

---

## 💡 Tips para el Frontend

1. **Autenticación:** Almacena el token en `localStorage` y agrégalo en el header `Authorization: Bearer {token}`

2. **Manejo de Fechas:** El backend espera fechas en formato `YYYY-MM-DD`

3. **UUIDs:** Todos los IDs son UUIDs v4

4. **Validación:** El backend valida con `class-validator`, revisa los mensajes de error para saber qué campos son inválidos

5. **CORS:** Está habilitado, puedes hacer peticiones desde cualquier origen en desarrollo

6. **Encuestas Públicas:** Las URLs públicas NO requieren autenticación, son ideales para compartir con clientes

7. **Reportes:** Los endpoints de exportación (Excel/PDF) retornan archivos binarios, usa `blob()` en el response

8. **Estados:** Respeta los estados de las entidades (empresas, usuarios, encuestas) para mostrar/ocultar funcionalidades

---

**Documentación generada para:** Sistema de Gestión de Encuestas  
**Versión Backend:** 1.0  
**Puerto:** 3001  
**Última actualización:** 30 de noviembre de 2025
