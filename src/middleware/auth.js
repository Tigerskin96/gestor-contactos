// ─────────────────────────────────────────────────────────────
//  Autenticación de la vista de administración.
//  AHORA MISMO NO PROTEGE NADA: es tu trabajo implementarla.
// ─────────────────────────────────────────────────────────────

import { timingSafeEqual } from 'node:crypto';

function credentialsMatch(actual, expected) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return actualBuffer.length === expectedBuffer.length
    && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (authorization?.startsWith('Basic ') && expectedUser && expectedPassword) {
    try {
      const [user, password] = Buffer.from(authorization.slice(6), 'base64')
        .toString('utf8')
        .split(':');

      if (credentialsMatch(user ?? '', expectedUser) && credentialsMatch(password ?? '', expectedPassword)) {
        return next();
      }
    } catch {
      // Tratar las credenciales mal formadas exactamente como credenciales no válidas.
    }
  }

  // Las solicitudes fetch del navegador gestionan este error en el formulario en lugar de abrir un aviso nativo.
  if (req.get('x-requested-with') !== 'XMLHttpRequest') {
    res.set('WWW-Authenticate', 'Basic realm="Administracion de contactos"');
  }
  return res.status(401).json({
    code: 'UNAUTHORIZED',
    message: 'El usuario o la contrasena no son validos.',
  });
}
