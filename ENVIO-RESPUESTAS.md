# Envío de Respuestas - Sistema de Encuestas

Guía completa para enviar respuestas de encuestas desde el frontend.

---

## 📤 Endpoint de Envío

```bash
POST http://localhost:3001/respuestas
```

**✅ Endpoint Público** - No requiere autenticación JWT

Este endpoint está diseñado para que cualquier persona pueda responder encuestas sin necesidad de estar autenticada en el sistema.

---

## 📋 Estructura del Request

### Headers

```http
Content-Type: application/json
```

**No se requiere** `Authorization` header.

### Body (JSON)

```json
{
  "encuesta_id": "uuid-de-la-encuesta",
  "respuestas": [
    {
      "pregunta_id": "uuid-de-pregunta-1",
      "respuesta": "valor-según-tipo-de-pregunta"
    },
    {
      "pregunta_id": "uuid-de-pregunta-2",
      "respuesta": "valor-según-tipo-de-pregunta"
    }
  ],
  "terceros": {
    "nombre": "Nombre del encuestado",
    "email": "email@ejemplo.com"
  }
}
```

---

## 🎯 Tipos de Respuesta por Tipo de Pregunta

| Tipo de Pregunta | Tipo de Dato | Ejemplo de Valor | Validación |
|------------------|--------------|------------------|------------|
| `texto` | `string` | `"Me gustó mucho el servicio"` | Sin restricciones |
| `opcion_unica` | `string` | `"Excelente"` | Debe estar en el array `opciones` |
| `si_no` | `boolean` o `string` | `true` / `false` o `"Si"` / `"No"` | Valores booleanos o strings específicos |
| `numerica` | `number` | `9` | Debe estar dentro del `rango.min` y `rango.max` |
| `estrellas` | `number` | `5` | Debe estar dentro del `rango.min` y `rango.max` |

---

## 📝 Ejemplos Completos

### Ejemplo 1: Encuesta Simple

```json
POST http://localhost:3001/respuestas

{
  "encuesta_id": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
  "respuestas": [
    {
      "pregunta_id": "uuid-pregunta-1",
      "respuesta": "El servicio fue excelente y rápido"
    },
    {
      "pregunta_id": "uuid-pregunta-2",
      "respuesta": "Excelente"
    }
  ],
  "terceros": {
    "nombre": "Juan Pérez",
    "email": "juan@cliente.com"
  }
}
```

### Ejemplo 2: Encuesta con Todos los Tipos

```json
{
  "encuesta_id": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
  "respuestas": [
    {
      "pregunta_id": "uuid-1",
      "respuesta": "El producto superó mis expectativas. La calidad es excelente."
    },
    {
      "pregunta_id": "uuid-2",
      "respuesta": "Excelente"
    },
    {
      "pregunta_id": "uuid-3",
      "respuesta": true
    },
    {
      "pregunta_id": "uuid-4",
      "respuesta": 10
    },
    {
      "pregunta_id": "uuid-5",
      "respuesta": 5
    }
  ],
  "terceros": {
    "nombre": "María García",
    "email": "maria@cliente.com"
  }
}
```

---

## 💻 Implementación en JavaScript

### Con Fetch API

```javascript
const enviarRespuestas = async (encuestaId, respuestasData, datosPersonales) => {
  try {
    const response = await fetch('http://localhost:3001/respuestas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        encuesta_id: encuestaId,
        respuestas: respuestasData,
        terceros: datosPersonales
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    console.log('✅ Respuestas guardadas:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error al enviar respuestas:', error);
    throw error;
  }
};

// Uso
const respuestas = [
  { pregunta_id: "uuid-1", respuesta: "Muy bueno" },
  { pregunta_id: "uuid-2", respuesta: "Excelente" },
  { pregunta_id: "uuid-3", respuesta: true },
  { pregunta_id: "uuid-4", respuesta: 9 },
  { pregunta_id: "uuid-5", respuesta: 5 }
];

const terceros = {
  nombre: "Carlos López",
  email: "carlos@ejemplo.com"
};

await enviarRespuestas("8a7d9e12-...", respuestas, terceros);
```

### Con Axios

```javascript
import axios from 'axios';

const enviarRespuestas = async (datos) => {
  try {
    const response = await axios.post(
      'http://localhost:3001/respuestas',
      datos
    );
    
    console.log('✅ Respuestas guardadas:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
};

// Uso
await enviarRespuestas({
  encuesta_id: "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
  respuestas: [
    { pregunta_id: "uuid-1", respuesta: "Excelente servicio" },
    { pregunta_id: "uuid-2", respuesta: 10 }
  ],
  terceros: {
    nombre: "Ana Martínez",
    email: "ana@ejemplo.com"
  }
});
```

---

## ⚛️ Implementación en React

### Hook Personalizado

```typescript
import { useState } from 'react';

interface Respuesta {
  pregunta_id: string;
  respuesta: string | number | boolean;
}

interface Terceros {
  nombre: string;
  email: string;
}

export const useEnviarEncuesta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviarRespuestas = async (
    encuestaId: string,
    respuestas: Respuesta[],
    terceros: Terceros
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/respuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          encuesta_id: encuestaId,
          respuestas,
          terceros
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar respuestas');
      }

      const data = await response.json();
      return data;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { enviarRespuestas, loading, error };
};
```

### Componente de Formulario Completo

```tsx
import React, { useState } from 'react';
import { useEnviarEncuesta } from './hooks/useEnviarEncuesta';

interface EncuestaFormProps {
  encuesta: {
    id_encuesta: string;
    titulo: string;
    preguntas: Pregunta[];
  };
  onSuccess?: () => void;
}

const EncuestaForm: React.FC<EncuestaFormProps> = ({ encuesta, onSuccess }) => {
  const [respuestas, setRespuestas] = useState<Record<string, any>>({});
  const [terceros, setTerceros] = useState({ nombre: '', email: '' });
  const { enviarRespuestas, loading, error } = useEnviarEncuesta();

  const handleRespuestaChange = (preguntaId: string, valor: any) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todas las preguntas requeridas estén respondidas
    const preguntasRequeridas = encuesta.preguntas.filter(p => p.requerida);
    const faltantes = preguntasRequeridas.filter(
      p => !respuestas[p.id_pregunta] && respuestas[p.id_pregunta] !== 0
    );

    if (faltantes.length > 0) {
      alert('Por favor responde todas las preguntas obligatorias');
      return;
    }

    // Convertir objeto a array
    const respuestasArray = Object.entries(respuestas).map(
      ([pregunta_id, respuesta]) => ({ pregunta_id, respuesta })
    );

    try {
      await enviarRespuestas(encuesta.id_encuesta, respuestasArray, terceros);
      alert('¡Gracias por responder la encuesta!');
      onSuccess?.();
    } catch (err) {
      alert('Error al enviar la encuesta. Por favor intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="encuesta-form">
      <h2>{encuesta.titulo}</h2>

      {/* Renderizar preguntas */}
      {encuesta.preguntas
        .sort((a, b) => a.orden - b.orden)
        .map(pregunta => (
          <div key={pregunta.id_pregunta} className="pregunta">
            <label>
              {pregunta.texto}
              {pregunta.requerida && <span className="required">*</span>}
            </label>
            
            {/* Renderizar según tipo */}
            <RenderPregunta
              pregunta={pregunta}
              value={respuestas[pregunta.id_pregunta]}
              onChange={(valor) => 
                handleRespuestaChange(pregunta.id_pregunta, valor)
              }
            />
          </div>
        ))}

      {/* Datos personales */}
      <div className="datos-personales">
        <h3>Tus datos</h3>
        
        <input
          type="text"
          placeholder="Tu nombre"
          value={terceros.nombre}
          onChange={(e) => setTerceros({...terceros, nombre: e.target.value})}
          required
        />
        
        <input
          type="email"
          placeholder="Tu email"
          value={terceros.email}
          onChange={(e) => setTerceros({...terceros, email: e.target.value})}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar Respuestas'}
      </button>
    </form>
  );
};

export default EncuestaForm;
```

### Componente para Renderizar Preguntas

```tsx
const RenderPregunta = ({ pregunta, value, onChange }) => {
  switch (pregunta.tipo) {
    case 'texto':
      return (
        <textarea
          placeholder="Escribe tu respuesta..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={pregunta.requerida}
          rows={4}
        />
      );

    case 'opcion_unica':
      return (
        <div className="opciones">
          {pregunta.opciones?.map(opcion => (
            <label key={opcion} className="opcion">
              <input
                type="radio"
                name={pregunta.id_pregunta}
                value={opcion}
                checked={value === opcion}
                onChange={(e) => onChange(e.target.value)}
                required={pregunta.requerida}
              />
              <span>{opcion}</span>
            </label>
          ))}
        </div>
      );

    case 'si_no':
      return (
        <div className="si-no-buttons">
          <button
            type="button"
            className={value === true ? 'active' : ''}
            onClick={() => onChange(true)}
          >
            Sí
          </button>
          <button
            type="button"
            className={value === false ? 'active' : ''}
            onClick={() => onChange(false)}
          >
            No
          </button>
        </div>
      );

    case 'numerica':
      return (
        <div className="numeric-input">
          <input
            type="range"
            min={pregunta.rango?.min || 0}
            max={pregunta.rango?.max || 10}
            value={value || pregunta.rango?.min || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            required={pregunta.requerida}
          />
          <div className="range-labels">
            <span>{pregunta.rango?.min}</span>
            <strong>{value || pregunta.rango?.min}</strong>
            <span>{pregunta.rango?.max}</span>
          </div>
        </div>
      );

    case 'estrellas':
      return (
        <div className="star-rating">
          {Array.from(
            { length: pregunta.rango?.max || 5 }, 
            (_, i) => i + 1
          ).map(star => (
            <button
              key={star}
              type="button"
              className={star <= (value || 0) ? 'star filled' : 'star'}
              onClick={() => onChange(star)}
            >
              ★
            </button>
          ))}
        </div>
      );

    default:
      return null;
  }
};
```

---

## ✅ Validaciones del Backend

### Campos Obligatorios

```typescript
{
  "encuesta_id": "string (UUID)", // ✅ Requerido
  "respuestas": [                  // ✅ Requerido (array no vacío)
    {
      "pregunta_id": "string (UUID)", // ✅ Requerido
      "respuesta": "any"               // ✅ Requerido
    }
  ],
  "terceros": {                    // ✅ Requerido
    "nombre": "string",            // ✅ Requerido
    "email": "string (email)"      // ✅ Requerido (formato email)
  }
}
```

### Validaciones Específicas por Tipo

#### Texto
- Sin validaciones específicas
- Acepta cualquier string

#### Opción Única
- El valor debe existir en el array `opciones` de la pregunta
- Ejemplo: Si opciones = `["A", "B", "C"]`, la respuesta debe ser uno de esos valores

#### Sí/No
- Acepta: `true`, `false`, `"Si"`, `"No"`
- Se convierte automáticamente a booleano

#### Numérica
- Debe ser un número
- Debe estar entre `rango.min` y `rango.max`
- Ejemplo: Si rango = `{min: 0, max: 10}`, acepta valores de 0 a 10

#### Estrellas
- Debe ser un número entero
- Debe estar entre `rango.min` y `rango.max`
- Ejemplo: Si rango = `{min: 0, max: 5}`, acepta valores de 0 a 5

### Preguntas Requeridas

- Si una pregunta tiene `requerida: true`, debe incluirse en el array de respuestas
- Si `requerida: false`, puede omitirse

---

## 📊 Respuesta del Servidor

### Respuesta Exitosa (201 Created)

```json
{
  "message": "Respuestas guardadas correctamente",
  "id_respuesta": "uuid-de-la-respuesta-creada",
  "encuesta_id": "uuid-de-la-encuesta",
  "total_respuestas": 5
}
```

### Errores Comunes

#### 400 Bad Request - Validación

```json
{
  "statusCode": 400,
  "message": [
    "encuesta_id must be a UUID",
    "respuestas should not be empty",
    "terceros.email must be an email"
  ],
  "error": "Bad Request"
}
```

#### 404 Not Found - Encuesta no existe

```json
{
  "statusCode": 404,
  "message": "Encuesta no encontrada",
  "error": "Not Found"
}
```

#### 400 Bad Request - Pregunta inválida

```json
{
  "statusCode": 400,
  "message": "La pregunta con id xxx no pertenece a esta encuesta",
  "error": "Bad Request"
}
```

#### 400 Bad Request - Valor fuera de rango

```json
{
  "statusCode": 400,
  "message": "El valor 15 está fuera del rango permitido (0-10)",
  "error": "Bad Request"
}
```

---

## 🔍 Ejemplo de Flujo Completo

### 1. Obtener Encuesta (Público)

```javascript
const encuesta = await fetch(
  'http://localhost:3001/encuestas/publico/8a7d9e12-...'
).then(r => r.json());
```

### 2. Renderizar Formulario

```javascript
// Mostrar título, descripción y preguntas
```

### 3. Recopilar Respuestas

```javascript
const respuestas = [];
encuesta.preguntas.forEach(pregunta => {
  respuestas.push({
    pregunta_id: pregunta.id_pregunta,
    respuesta: obtenerValorDelFormulario(pregunta.id_pregunta)
  });
});
```

### 4. Enviar al Backend

```javascript
const resultado = await fetch('http://localhost:3001/respuestas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    encuesta_id: encuesta.id_encuesta,
    respuestas,
    terceros: { nombre: "...", email: "..." }
  })
});
```

### 5. Mostrar Confirmación

```javascript
if (resultado.ok) {
  alert('¡Gracias por responder!');
} else {
  alert('Error al enviar');
}
```

---

## 🎨 Estilos CSS de Ejemplo

```css
.encuesta-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.pregunta {
  margin-bottom: 30px;
}

.pregunta label {
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
}

.required {
  color: red;
  margin-left: 4px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.opcion:hover {
  background-color: #f5f5f5;
}

.opcion input[type="radio"] {
  margin-right: 10px;
}

.si-no-buttons {
  display: flex;
  gap: 10px;
}

.si-no-buttons button {
  flex: 1;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.si-no-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.numeric-input input[type="range"] {
  width: 100%;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 14px;
}

.range-labels strong {
  font-size: 20px;
  color: #007bff;
}

.star-rating {
  display: flex;
  gap: 5px;
}

.star {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #ffc107;
}

.star:hover {
  color: #ffeb3b;
}

.datos-personales {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #ddd;
}

.datos-personales input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button[type="submit"] {
  width: 100%;
  padding: 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
}

button[type="submit"]:hover {
  background-color: #218838;
}

button[type="submit"]:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error {
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 10px;
}
```

---

## 🧪 Pruebas con cURL

### Envío básico

```bash
curl -X POST http://localhost:3001/respuestas \
  -H "Content-Type: application/json" \
  -d '{
    "encuesta_id": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
    "respuestas": [
      {
        "pregunta_id": "uuid-1",
        "respuesta": "Excelente servicio"
      }
    ],
    "terceros": {
      "nombre": "Test Usuario",
      "email": "test@ejemplo.com"
    }
  }'
```

### Con todos los tipos de preguntas

```bash
curl -X POST http://localhost:3001/respuestas \
  -H "Content-Type: application/json" \
  -d '{
    "encuesta_id": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
    "respuestas": [
      {"pregunta_id": "uuid-1", "respuesta": "Comentario de prueba"},
      {"pregunta_id": "uuid-2", "respuesta": "Excelente"},
      {"pregunta_id": "uuid-3", "respuesta": true},
      {"pregunta_id": "uuid-4", "respuesta": 9},
      {"pregunta_id": "uuid-5", "respuesta": 5}
    ],
    "terceros": {
      "nombre": "Test Usuario",
      "email": "test@ejemplo.com"
    }
  }'
```

---

## 📚 Documentación Relacionada

- **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)** - Documentación completa de la API
- **[TIPOS-PREGUNTAS.md](./TIPOS-PREGUNTAS.md)** - Detalle de tipos de preguntas
- **[REPORTES.md](./REPORTES.md)** - Cómo ver resultados de encuestas

---

**Guía de Envío de Respuestas** | Sistema de Encuestas v1.0
