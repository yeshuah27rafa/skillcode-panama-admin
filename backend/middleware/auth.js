// ============================================================
// middleware/auth.js — valida el token JWT enviado en el header
// Authorization: Bearer <token> y adjunta el usuario a req.user
// ============================================================

import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'skillcode-dev-secret-cambiar-en-produccion';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (header === undefined || header.startsWith('Bearer ') === false) {
    res.status(401).json({ error: 'Token no proporcionado.' });
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

export async function requireAdmin(req, res, next) {
  if (req.user === undefined) {
    res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    return;
  }

  const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);

  if (rows.length === 0 || rows[0].role !== 'admin') {
    res.status(403).json({ error: 'No tienes permisos para esta acción.' });
    return;
  }

  next();
}

export { JWT_SECRET };
