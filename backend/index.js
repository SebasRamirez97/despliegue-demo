const express = require('express');
const cors = require('cors');
const Sentry = require("@sentry/node");

const app = express();

// 1. Inicializar Sentry obligatoriamente antes de las rutas
Sentry.init({
  dsn: "https://735440e96682306b207054e29381972d@o4512251468251136.ingest.us.sentry.io/4512251497283584",
  tracesSampleRate: 1.0,
});

app.use(cors());
app.use(express.json());

// Memoria temporal para la demo
let tareas = [
  { id: 1, texto: 'Configurar Render' },
  { id: 2, texto: 'Probar Sentry' }
];

// Rutas de la API
app.get('/', (req, res) => {
  res.json({ mensaje: '¡Backend de la demo funcionando correctamente!' });
});

app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

app.post('/api/tareas', (req, res) => {
  const nuevaTarea = { id: Date.now(), texto: req.body.texto };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// Ruta de prueba requerida por Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// 2. ¡MUY IMPORTANTE! Agregar el manejador de errores de Sentry ANTES de exportar o escuchar
Sentry.setupExpressErrorHandler(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});