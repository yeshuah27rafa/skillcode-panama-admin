// ============================================================
// routes/admin.js — panel de administración: cursos y materiales.
// Todas las rutas requieren sesión + rol admin.
// Los archivos (PDF/imagen) se suben a Supabase Storage, nunca
// al disco del servidor.
// ============================================================

import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import pool from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadMaterialFile, deleteMaterialFile, isStorageConfigured } from '../storage.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.has(file.mimetype) === false) {
      cb(new Error('Formato no permitido. Usa PDF, PNG, JPG, WEBP o GIF.'));
      return;
    }
    cb(null, true);
  }
});

/* ------------------------------------------------------------
   CURSOS
------------------------------------------------------------ */

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

router.get('/courses', async (req, res) => {
  const result = await pool.query('SELECT * FROM courses ORDER BY id DESC');
  res.json({ courses: result.rows });
});

router.post('/courses', async (req, res) => {
  const { title, category, level, summary, description, durationHours, syllabus, accent } = req.body;

  if (!title || !category || !level || !summary || !description || !durationHours || !Array.isArray(syllabus)) {
    res.status(400).json({ error: 'Faltan campos obligatorios del curso.' });
    return;
  }

  let slug = slugify(title);
  const exists = await pool.query('SELECT id FROM courses WHERE slug = $1', [slug]);
  if (exists.rows.length > 0) {
    slug = slug + '-' + crypto.randomBytes(2).toString('hex');
  }

  const inserted = await pool.query(
    `INSERT INTO courses (slug, title, category, level, summary, description, duration_hours, syllabus, accent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [slug, title, category, level, summary, description, durationHours, JSON.stringify(syllabus), accent || 'teal']
  );

  res.status(201).json({ course: inserted.rows[0] });
});

router.put('/courses/:id', async (req, res) => {
  const existingResult = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
  const existing = existingResult.rows[0];

  if (existing === undefined) {
    res.status(404).json({ error: 'Curso no encontrado.' });
    return;
  }

  const { title, category, level, summary, description, durationHours, syllabus, accent } = req.body;

  const updated = await pool.query(
    `UPDATE courses SET
       title = $1, category = $2, level = $3, summary = $4, description = $5,
       duration_hours = $6, syllabus = $7, accent = $8
     WHERE id = $9
     RETURNING *`,
    [
      title ?? existing.title,
      category ?? existing.category,
      level ?? existing.level,
      summary ?? existing.summary,
      description ?? existing.description,
      durationHours ?? existing.duration_hours,
      Array.isArray(syllabus) ? JSON.stringify(syllabus) : JSON.stringify(existing.syllabus),
      accent ?? existing.accent,
      req.params.id
    ]
  );

  res.json({ course: updated.rows[0] });
});

router.delete('/courses/:id', async (req, res) => {
  const existing = await pool.query('SELECT id FROM courses WHERE id = $1', [req.params.id]);
  if (existing.rows.length === 0) {
    res.status(404).json({ error: 'Curso no encontrado.' });
    return;
  }

  const materials = await pool.query(
    'SELECT file_object_path FROM materials WHERE course_id = $1 AND type = $2',
    [req.params.id, 'file']
  );

  await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);

  for (const material of materials.rows) {
    deleteMaterialFile(material.file_object_path).catch(() => {});
  }

  res.json({ message: 'Curso eliminado.' });
});

/* ------------------------------------------------------------
   MATERIALES
------------------------------------------------------------ */

router.get('/materials/:courseId', async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM materials WHERE course_id = $1 ORDER BY position, id',
    [req.params.courseId]
  );
  res.json({ materials: result.rows });
});

router.post('/materials', upload.single('file'), async (req, res) => {
  const { courseId, type, title, body, url } = req.body;

  if (!courseId || !type || !title) {
    res.status(400).json({ error: 'Faltan campos obligatorios del material.' });
    return;
  }

  if (['text', 'file', 'link'].includes(type) === false) {
    res.status(400).json({ error: 'Tipo de material inválido.' });
    return;
  }

  if (type === 'file' && req.file === undefined) {
    res.status(400).json({ error: 'Debes adjuntar un archivo para este tipo de material.' });
    return;
  }

  if (type === 'file' && isStorageConfigured() === false) {
    res.status(503).json({ error: 'El almacenamiento de archivos no está configurado en el servidor todavía.' });
    return;
  }

  if (type === 'link' && (!url || url.trim().length === 0)) {
    res.status(400).json({ error: 'Debes indicar un enlace para este tipo de material.' });
    return;
  }

  let filePath = null;
  let fileName = null;
  let fileObjectPath = null;

  if (type === 'file') {
    try {
      const uploadResult = await uploadMaterialFile(req.file);
      filePath = uploadResult.publicUrl;
      fileObjectPath = uploadResult.objectPath;
      fileName = req.file.originalname;
    } catch (err) {
      res.status(502).json({ error: err.message });
      return;
    }
  }

  const maxPositionResult = await pool.query(
    'SELECT MAX(position) AS "maxPos" FROM materials WHERE course_id = $1',
    [courseId]
  );
  const nextPosition = (maxPositionResult.rows[0].maxPos ?? -1) + 1;

  const inserted = await pool.query(
    `INSERT INTO materials (course_id, type, title, body, file_path, file_name, file_object_path, url, position)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [courseId, type, title, body || null, filePath, fileName, fileObjectPath, url || null, nextPosition]
  );

  res.status(201).json({ material: inserted.rows[0] });
});

router.delete('/materials/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM materials WHERE id = $1', [req.params.id]);
  const material = result.rows[0];

  if (material === undefined) {
    res.status(404).json({ error: 'Material no encontrado.' });
    return;
  }

  await pool.query('DELETE FROM materials WHERE id = $1', [req.params.id]);

  if (material.type === 'file' && material.file_object_path !== null) {
    deleteMaterialFile(material.file_object_path).catch(() => {});
  }

  res.json({ message: 'Material eliminado.' });
});

export default router;
