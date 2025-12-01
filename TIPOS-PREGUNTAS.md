# Tipos de Preguntas - Sistema de Encuestas

Documentación de los tipos de preguntas soportados por el backend.

---

## 📋 Tipos de Preguntas Disponibles

El backend soporta **5 tipos de preguntas** diferentes:

### 1️⃣ **`texto`** - Texto Libre

Permite respuestas de texto abierto sin restricciones.

**Estructura:**
```json
{
  "id_pregunta": "uuid",
  "texto": "¿Qué opinas del producto?",
  "tipo": "texto",
  "requerida": false,
  "orden": 1
}
```

**Características:**
- Sin validaciones de formato
- Ideal para comentarios y opiniones abiertas
- Respuesta esperada: `string`

**Ejemplo de respuesta:**
```json
{
  "pregunta_id": "uuid",
  "respuesta": "Me gustó mucho el producto, excelente calidad"
}
```

---

### 2️⃣ **`opcion_unica`** - Selección Única

Permite seleccionar una opción de una lista predefinida.

**Estructura:**
```json
{
  "id_pregunta": "uuid",
  "texto": "¿Cómo califica nuestro servicio?",
  "tipo": "opcion_unica",
  "opciones": ["Excelente", "Bueno", "Regular", "Malo"],
  "requerida": true,
  "orden": 2
}
```

**Características:**
- Requiere campo adicional: `opciones` (array de strings)
- El usuario debe seleccionar exactamente una opción
- Respuesta esperada: `string` (debe ser uno de los valores en `opciones`)

**Ejemplo de respuesta:**
```json
{
  "pregunta_id": "uuid",
  "respuesta": "Excelente"
}
```

---

### 3️⃣ **`si_no`** - Pregunta Booleana

Pregunta de tipo Sí/No.

**Estructura:**
```json
{
  "id_pregunta": "uuid",
  "texto": "¿Recomendaría nuestro servicio?",
  "tipo": "si_no",
  "requerida": true,
  "orden": 3
}
```

**Características:**
- No requiere campos adicionales
- Respuesta binaria
- Respuesta esperada: `boolean` (`true`/`false`) o `string` (`"Si"`/`"No"`)

**Ejemplo de respuesta:**
```json
{
  "pregunta_id": "uuid",
  "respuesta": true
}
```

---

### 4️⃣ **`numerica`** - Valor Numérico en Rango

Permite ingresar un número dentro de un rango específico.

**Estructura:**
```json
{
  "id_pregunta": "uuid",
  "texto": "Del 0 al 10, ¿qué tan satisfecho está?",
  "tipo": "numerica",
  "rango": { "min": 0, "max": 10 },
  "requerida": true,
  "orden": 4
}
```

**Características:**
- Requiere campo adicional: `rango` con propiedades `min` y `max`
- Ideal para escalas NPS, calificaciones numéricas
- Respuesta esperada: `number` (dentro del rango especificado)

**Ejemplo de respuesta:**
```json
{
  "pregunta_id": "uuid",
  "respuesta": 9
}
```

**Casos de uso comunes:**
- NPS (Net Promoter Score): 0-10
- Escalas de satisfacción: 1-5
- Calificaciones personalizadas: cualquier rango

---

### 5️⃣ **`estrellas`** - Calificación con Estrellas

Sistema de calificación tipo rating con estrellas.

**Estructura:**
```json
{
  "id_pregunta": "uuid",
  "texto": "Califique su experiencia",
  "tipo": "estrellas",
  "rango": { "min": 0, "max": 5 },
  "requerida": true,
  "orden": 5
}
```

**Características:**
- Requiere campo adicional: `rango` con propiedades `min` y `max`
- Típicamente se usa rango 0-5 o 1-5
- Respuesta esperada: `number` (dentro del rango)

**Ejemplo de respuesta:**
```json
{
  "pregunta_id": "uuid",
  "respuesta": 5
}
```

---

## 🎯 Ejemplo Completo de Encuesta

```json
{
  "id_encuesta": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
  "titulo": "Encuesta de Satisfacción 2025",
  "descripcion": "Ayúdanos a mejorar nuestro servicio",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-12-31",
  "estado": "publicada",
  "preguntas": [
    {
      "id_pregunta": "uuid-1",
      "texto": "Comentarios adicionales",
      "tipo": "texto",
      "requerida": false,
      "orden": 1
    },
    {
      "id_pregunta": "uuid-2",
      "texto": "¿Cómo califica el servicio recibido?",
      "tipo": "opcion_unica",
      "opciones": ["Excelente", "Bueno", "Regular", "Malo"],
      "requerida": true,
      "orden": 2
    },
    {
      "id_pregunta": "uuid-3",
      "texto": "¿Recomendaría este servicio a un amigo?",
      "tipo": "si_no",
      "requerida": true,
      "orden": 3
    },
    {
      "id_pregunta": "uuid-4",
      "texto": "Del 0 al 10, ¿qué tan probable es que nos recomiende?",
      "tipo": "numerica",
      "rango": { "min": 0, "max": 10 },
      "requerida": true,
      "orden": 4
    },
    {
      "id_pregunta": "uuid-5",
      "texto": "Califique su experiencia general",
      "tipo": "estrellas",
      "rango": { "min": 0, "max": 5 },
      "requerida": true,
      "orden": 5
    }
  ]
}
```

---

## 📤 Ejemplo de Envío de Respuestas

```json
POST /respuestas

{
  "encuesta_id": "8a7d9e12-4f8c-4b3a-9c21-1234567890ab",
  "respuestas": [
    {
      "pregunta_id": "uuid-1",
      "respuesta": "El servicio fue rápido y eficiente"
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
      "respuesta": 9
    },
    {
      "pregunta_id": "uuid-5",
      "respuesta": 5
    }
  ],
  "terceros": {
    "nombre": "Juan Pérez",
    "email": "juan@cliente.com"
  }
}
```

---

## 💻 Implementación en React

### Componente para Renderizar Preguntas

```typescript
interface Pregunta {
  id_pregunta: string;
  texto: string;
  tipo: 'texto' | 'opcion_unica' | 'si_no' | 'numerica' | 'estrellas';
  opciones?: string[];
  rango?: { min: number; max: number };
  requerida: boolean;
  orden: number;
}

const RenderPregunta = ({ pregunta, value, onChange }) => {
  switch (pregunta.tipo) {
    case 'texto':
      return (
        <textarea
          placeholder="Escribe tu respuesta..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={pregunta.requerida}
        />
      );

    case 'opcion_unica':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required={pregunta.requerida}
        >
          <option value="">Seleccione una opción</option>
          {pregunta.opciones?.map(opcion => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
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
            type="number"
            min={pregunta.rango?.min}
            max={pregunta.rango?.max}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            required={pregunta.requerida}
          />
          <span className="range-label">
            ({pregunta.rango?.min} - {pregunta.rango?.max})
          </span>
        </div>
      );

    case 'estrellas':
      return (
        <StarRating
          max={pregunta.rango?.max || 5}
          value={value || 0}
          onChange={onChange}
          required={pregunta.requerida}
        />
      );

    default:
      return null;
  }
};
```

### Componente de Estrellas

```typescript
const StarRating = ({ max, value, onChange }) => {
  return (
    <div className="star-rating">
      {Array.from({ length: max }, (_, i) => i + 1).map(star => (
        <button
          key={star}
          type="button"
          className={star <= value ? 'star filled' : 'star'}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};
```

---

## 📊 Validaciones

### Validaciones por Tipo

| Tipo | Validación |
|------|------------|
| `texto` | Sin validaciones específicas |
| `opcion_unica` | Debe ser uno de los valores en `opciones` |
| `si_no` | Debe ser `true`, `false`, `"Si"` o `"No"` |
| `numerica` | Debe estar dentro del rango `min-max` |
| `estrellas` | Debe estar dentro del rango `min-max` |

### Campo `requerida`

Si `requerida: true`, la pregunta debe tener una respuesta válida para poder enviar la encuesta.

---

## 🎨 Recomendaciones de UI/UX

### Texto Libre
- Usar `<textarea>` con placeholder descriptivo
- Considerar límite de caracteres si es necesario
- Mostrar contador de caracteres

### Opción Única
- Usar radio buttons para 2-4 opciones
- Usar dropdown/select para 5+ opciones
- Considerar botones grandes para móvil

### Sí/No
- Botones toggle grandes y claros
- Colores diferenciados (verde/rojo o azul/gris)
- Iconos opcionales (✓ / ✗)

### Numérica
- Input numérico con controles (+/-)
- Slider para rangos visuales (0-10)
- Mostrar el rango permitido

### Estrellas
- Estrellas interactivas con hover effect
- Permitir cambiar selección
- Mostrar número seleccionado
- Tamaño táctil apropiado para móvil

---

## 🔍 Enum de Tipos (TypeScript)

```typescript
export enum TipoPregunta {
  TEXTO = 'texto',
  OPCION_UNICA = 'opcion_unica',
  SI_NO = 'si_no',
  NUMERICA = 'numerica',
  ESTRELLAS = 'estrellas',
}
```

---

## 📝 Notas Adicionales

1. **Orden de Preguntas:** Usa el campo `orden` para mostrar las preguntas en la secuencia correcta
2. **Campos Opcionales:** Las preguntas con `requerida: false` pueden omitirse en la respuesta
3. **Validación Frontend:** Implementa validación en el cliente antes de enviar para mejor UX
4. **Accesibilidad:** Asegúrate de usar labels, aria-labels y navegación por teclado
5. **Responsive:** Todos los tipos deben funcionar bien en móvil y desktop

---

**Documentación de Tipos de Preguntas** | Sistema de Encuestas v1.0
