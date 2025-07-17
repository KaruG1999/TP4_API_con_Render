const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(
  cors({
    origin: [
      'https://karug1999.github.io', // Sin la barra final
      'https://karug1999.github.io/TP4_API_con_Render', // Sin la barra final
      'https://karug1999.github.io/TP4_API_con_Render/', // Con la barra final
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:8080',
      'https://tp4-api-con-render.onrender.com',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Middleware adicional para debugging CORS
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para validar emails - Proxy para evitar CORS
app.post('/api/validate-email', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('Servidor recibió petición para validar:', email);
    console.log('Origin de la petición:', req.headers.origin);

    if (!email) {
      console.error('Email no proporcionado');
      return res.status(400).json({
        esValido: null,
        informacion: null,
        razon: 'Email es requerido',
      });
    }

    const API_KEY = process.env.API_KEY; // Usar variable de entorno

    if (!API_KEY) {
      console.error('API_KEY no configurada');
      return res.status(500).json({
        esValido: null,
        informacion: null,
        razon: 'API_KEY no configurada en el servidor',
      });
    }

    const API_URL = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(
      email
    )}`;

    console.log('Haciendo petición a:', API_URL);

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      timeout: 15000,
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en respuesta de API:', errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Respuesta completa de la API:', JSON.stringify(data, null, 2));

    if (data.error) {
      console.error('Error en data de API:', data.error);
      throw new Error(data.error.message || 'Error en la API');
    }

    // Procesar la respuesta
    const formatoValido =
      data.is_valid_format?.value === true || data.is_valid_format === true;
    const esEntregable = data.deliverability === 'DELIVERABLE';
    const esDesconocido = data.deliverability === 'UNKNOWN';
    const esValido = formatoValido && (esEntregable || esDesconocido);

    const resultado = {
      esValido: esValido,
      informacion: data,
      razon: getValidationReason(data),
    };

    console.log('Resultado final enviado:', resultado);
    res.json(resultado);
  } catch (error) {
    console.error('Error completo validando email:', error);
    const errorResponse = {
      esValido: null,
      informacion: null,
      razon: error.message || 'Error de conexión con API',
    };
    console.log('Enviando error response:', errorResponse);
    res.status(500).json(errorResponse);
  }
});

// Función para obtener razón de validación
function getValidationReason(data) {
  const formatoValido =
    data.is_valid_format?.value === true || data.is_valid_format === true;

  if (!formatoValido) {
    return 'Formato de email inválido';
  }

  switch (data.deliverability) {
    case 'DELIVERABLE':
      return 'Email válido y entregable';
    case 'UNDELIVERABLE':
      return 'Email no se puede entregar';
    case 'UNKNOWN':
      return 'Email con formato válido (entregabilidad desconocida)';
    default:
      return 'Estado de email desconocido';
  }
}

// Ruta de prueba para verificar CORS
app.get('/api/test', (req, res) => {
  res.json({
    message: 'CORS funcionando correctamente',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
  });
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para manejar errores 404
app.use((req, res) => {
  console.log('Ruta no encontrada:', req.method, req.path);
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Orígenes permitidos:', [
    'https://karug1999.github.io',
    'https://karug1999.github.io/TP4_API_con_Render',
    'https://karug1999.github.io/TP4_API_con_Render/',
    'http://localhost:3000',
    'https://tp4-api-con-render.onrender.com',
  ]);
});
