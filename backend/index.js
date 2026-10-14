const express = require('express');
const cors = require('cors');
const Sentry = require("@sentry/node");

const app = express();

// Inicializar Sentry (puedes poner tu DSN real directamente aquí para asegurar que funcione)
Sentry.init({
  dsn: process.env.SENTRY_DSN || "https://735440e96682306b207054e29381972d@o4512251468251136.ingest.us.sentry.io/4512251497283584",
  tracesSampleRate: 1.0,
});

app.use(cors());
app.use(express.json());

// Memoria temporal para la demo (simulando una base de datos)
let tareas = [
  { id: 1, texto: 'Configurar Render' },
  { id: 2, texto: 'Probar Sentry' }
];

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Backend de la demo funcionando correctamente!' });
});

// Obtener tareas
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

// Agregar tarea
app.post('/api/tareas', (req, res) => {
  const nuevaTarea = { id: Date.now(), texto: req.body.texto };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// Ruta para forzar un error y probar Sentry (¡Perfecto para la consigna!)
app.get('/api/error-test', (req, res) => {
  throw new Error("¡Este es un error simulado para probar la observabilidad en Sentry!");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
