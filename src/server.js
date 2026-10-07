// ─────────────────────────────────────────────────────────────
//  Servidor base — YA FUNCIONA. No necesitas tocar casi nada aquí.
//  Arranca con:  npm run dev   →   http://localhost:3000
// ─────────────────────────────────────────────────────────────
import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import db from './db.js';
import contactsRouter from './routes/contacts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Lectura del body en JSON y en formularios.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve el front-end estático desde src/public (opción "vanilla").
// Si prefieres Astro / Next / Svelte, puedes ignorar esta carpeta
// y montar tu front como quieras: solo debe consumir tu propia API.
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck — úsalo para confirmar que todo arranca bien.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db.open });
});

// Rutas de la API.
app.use('/api/contacts', contactsRouter);
app.use('/api', (req, res) => {
  res.status(404).json({
    code: 'API_ROUTE_NOT_FOUND',
    message: 'La ruta de la API no existe.',
  });
});

// Mantener las cargas útiles de API mal formadas dentro del mismo contrato de respuesta.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      code: 'INVALID_JSON',
      message: 'El cuerpo de la solicitud debe ser JSON valido.',
    });
  }

  return next(error);
});

app.listen(PORT, () => {
  console.log(`▶  Servidor en http://localhost:${PORT}`);
  console.log(`   Healthcheck:  http://localhost:${PORT}/health`);
});
