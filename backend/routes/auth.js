// ============================================================
// routes/auth.js — registro, login y perfil del usuario actual
// ============================================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, goal: user.goal, role: user.role };
}

router.post('/register', async (req, res) => {
  const { name, email, password, goal } = req.body;

  if (name === undefined || email === undefined || password === undefined) {
    res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    return;
  }

  if (String(password).length < 6) {
    res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const adminEmail = process.env.ADMIN_EMAIL;
  const role = (adminEmail !== undefined && normalizedEmail === adminEmail.toLowerCase().trim()) ? 'admin' : 'student';

  const inserted = await pool.query(
    `INSERT INTO users (name, email, password_hash, goal, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name.trim(), normalizedEmail, passwordHash, goal || null, role]
  );

  const user = inserted.rows[0];
  const token = signToken(user);

  res.status(201).json({ token: token, user: publicUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === undefined || password === undefined) {
    res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
    return;
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
  const user = result.rows[0];

  if (user === undefined) {
    res.status(401).json({ error: 'Credenciales inválidas.' });
    return;
  }

  const passwordMatches = bcrypt.compareSync(password, user.password_hash);
  if (passwordMatches === false) {
    res.status(401).json({ error: 'Credenciales inválidas.' });
    return;
  }

  const token = signToken(user);
  res.json({ token: token, user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
  const user = result.rows[0];

  if (user === undefined) {
    res.status(404).json({ error: 'Usuario no encontrado.' });
    return;
  }

  res.json({ user: publicUser(user) });
});

export default router;
