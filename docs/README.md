# 👩‍💻 Proyecto: Gestión de Usuarios - 4ta Entrega

## 👥 Integrantes

- **Karen Giannetto** - karengiannetto99@gmail.com
- **Cintia Alfaro** - alfarocintiamarina@gmail.com
- **Jessica Baeza** - baezajessicajohana@gmail.com

## 🎯 Objetivo General

Desarrollar una aplicación web utilizando **HTML, CSS y JavaScript** que capture, valide y almacene datos de usuarios de forma persistente, integrando servicios externos mediante API.

## ✅ Requisitos Obligatorios Cumplidos

### 1️⃣ Guardar en Storage la base de datos completa
- [x] Array completo guardado en localStorage con `JSON.stringify()`
- [x] Carga automática desde Storage al iniciar con `JSON.parse()`
- [x] Persistencia total de datos entre sesiones

### 2️⃣ Mostrar los datos desde Storage
- [x] Recuperación automática de usuarios guardados
- [x] Renderizado dinámico con manipulación del DOM
- [x] Manejo de estado vacío con mensaje informativo

### 3️⃣ Estructura de datos tipo JSON
- [x] Base de datos simulada con array de objetos usuarios
- [x] Estructura: ID, nombre, edad, email y validación de API
- [x] Generación automática de IDs únicos

### 4️⃣ Agregar nuevos elementos desde formulario
- [x] Validación completa del formulario (nombre, email, edad)
- [x] Agregado dinámico al array y localStorage
- [x] Re-renderizado automático de la lista

## 🔧 Correcciones del Feedback Anterior

### ✅ Validaciones de datos
- **Implementado**: Función `validarDatosFormulario()` que previene envío con datos inválidos
- **Verificaciones**: Nombre no vacío, email con "@", edad numérica mayor a 0

### ✅ Color favorito aplicado visualmente
- **Implementado**: El color se aplica dinámicamente al mensaje de bienvenida
- **Funciones**: `cargarMensajeBienvenida()` y `actualizarMensajeBienvenida()`

### ✅ Persistencia en localStorage
- **Implementado**: `guardarUsuariosEnStorage()` y `cargarUsuariosDeStorage()`
- **Automático**: Guardado tras cada operación (agregar, eliminar, validar)

## 🔌 Integración con API Externa

### AbstractAPI con AllOrigins
- **API utilizada**: AbstractAPI para validación de emails
- **Proxy**: AllOrigins para resolver problemas de CORS
- **URL**: `https://emailvalidation.abstractapi.com/v1/`

### ⚠️ Problema Identificado con la API
**La API AbstractAPI no responde correctamente:**
- La API responde pero no valida emails de manera consistente
- Muchos emails válidos son marcados como inválidos
- Tiempos de respuesta muy lentos (hasta 15 segundos)

### 🛠️ Solución Implementada
- **Validación local de respaldo**: Regex y lista de dominios conocidos
- **Timeout de 15 segundos**: Para evitar esperas indefinidas
- **Manejo de errores**: Fallback a validación local cuando la API falla
- **Estados de carga**: Feedback visual durante validación

## 🧪 Funcionalidades Principales

- **Agregar usuarios**: Formulario con validación completa
- **Eliminar usuarios**: Con confirmación y reordenamiento de IDs
- **Validar emails**: Individual por usuario (botón en cada card)
- **Persistencia**: Guardado automático en localStorage
- **Saludo personalizado**: Con color favorito aplicado visualmente

## 🚀 Tecnologías Utilizadas

- **HTML5, CSS3, JavaScript ES6+**
- **Abstract API + AllOrigins** (con limitaciones)
- **localStorage** para persistencia
- **Responsive Design** Mobile First

## 📁 Estructura del Proyecto

```
/proyecto
├── index.html          # Estructura HTML
├── style.css           # Estilos responsive
├── app.js              # Lógica JavaScript completa
└── README.md           # Documentación
```

### Recomendaciones Futuras
- Cambiar a API más confiable
- Implementar cache local para validaciones
- Considerar modo offline completo

---

🍄 _Proyecto con persistencia completa, validación robusta y todas las correcciones del feedback implementadas._