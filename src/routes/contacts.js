// ─────────────────────────────────────────────────────────────
//  Rutas de contactos. Los stubs responden 501 a propósito:
//  son los que tienes que construir.
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';

import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSearchTerm(query) {
  const search = typeof query.q === 'string' ? query.q.trim() : '';

  if (search.length > 100) {
    return { error: 'La busqueda no puede superar los 100 caracteres.' };
  }

  // SQLite no dispone de ILIKE; LIKE con NOCASE proporciona una coincidencia equivalente que no distingue entre mayúsculas y minúsculas.
  return { search: `%${search.replace(/[\\%_]/g, '\\$&')}%` };
}

function validateContact(body) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return { error: 'Nombre, correo y mensaje son obligatorios.' };
  }

  if (name.length > 100 || email.length > 254 || message.length > 2000) {
    return { error: 'Uno o mas campos superan la longitud permitida.' };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'El correo no tiene un formato valido.' };
  }

  return { contact: { name, email, message } };
}

// POST /api/contacts  —  PÚBLICO
// Recibe el formulario de contacto y lo guarda en la base de datos.
// TODO: valida en el servidor (no confíes solo en el front) y guarda.
router.post('/', (req, res) => {
  const result = validateContact(req.body ?? {});

  if (result.error) {
    return res.status(400).json({
      code: 'INVALID_CONTACT',
      message: result.error,
    });
  }

  try {
    const insert = db.prepare(`
      INSERT INTO contacts (name, email, message)
      VALUES (@name, @email, @message)
    `).run(result.contact);
    const contact = db.prepare(`
      SELECT id, name, email, message, created_at AS createdAt
      FROM contacts
      WHERE id = ?
    `).get(insert.lastInsertRowid);

    return res.status(201).json({
      code: 'CONTACT_CREATED',
      message: 'El contacto se guardo correctamente.',
      contact,
    });
  } catch (error) {
    console.error('No se pudo guardar el contacto:', error);
    return res.status(500).json({
      code: 'CONTACT_CREATION_FAILED',
      message: 'No fue posible guardar el contacto. Intentalo de nuevo.',
    });
  }
});

// GET /api/contacts  —  PROTEGIDO (vista de administración)
// Devuelve los contactos guardados, del más reciente al más antiguo.
// TODO: léelos de la base de datos y devuélvelos.
router.get('/', requireAuth, (req, res) => {
  const searchResult = getSearchTerm(req.query);

  if (searchResult.error) {
    return res.status(400).json({
      code: 'INVALID_SEARCH',
      message: searchResult.error,
    });
  }

  try {
    const contacts = db.prepare(`
      SELECT id, name, email, message, created_at AS createdAt
      FROM contacts
      WHERE name LIKE @search ESCAPE '\\' COLLATE NOCASE
        OR email LIKE @search ESCAPE '\\' COLLATE NOCASE
        OR message LIKE @search ESCAPE '\\' COLLATE NOCASE
      ORDER BY created_at DESC, id DESC
    `).all(searchResult);

    return res.json({
      code: 'CONTACTS_RETRIEVED',
      message: 'Contactos recuperados correctamente.',
      contacts,
    });
  } catch (error) {
    console.error('No se pudieron recuperar los contactos:', error);
    return res.status(500).json({
      code: 'CONTACTS_RETRIEVAL_FAILED',
      message: 'No fue posible recuperar los contactos. Intentalo de nuevo.',
    });
  }
});

export default router;
