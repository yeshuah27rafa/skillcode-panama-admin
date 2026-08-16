// ============================================================
// routes/courses.js — catálogo público de cursos
// ============================================================

import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category } = req.query;

  let result;
  if (category !== undefined && category !== 'Todas') {
    result = await pool.query('SELECT * FROM courses WHERE category = $1 ORDER BY id', [category]);
  } else {
    result = await pool.query('SELECT * FROM courses ORDER BY id');
  }

  res.json({ courses: result.rows });
});

router.get('/categories', async (req, res) => {
  const result = await pool.query('SELECT DISTINCT category FROM courses ORDER BY category');
  res.json({ categories: result.rows.map((row) => row.category) });
});

router.get('/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM courses WHERE slug = $1', [req.params.slug]);

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'Curso no encontrado.' });
    return;
  }

  res.json({ course: result.rows[0] });
});

router.get('/:slug/materials', async (req, res) => {
  const courseResult = await pool.query('SELECT id FROM courses WHERE slug = $1', [req.params.slug]);

  if (courseResult.rows.length === 0) {
    res.status(404).json({ error: 'Curso no encontrado.' });
    return;
  }

  const materials = await pool.query(
    'SELECT * FROM materials WHERE course_id = $1 ORDER BY position, id',
    [courseResult.rows[0].id]
  );

  res.json({ materials: materials.rows });
});

export default router;
