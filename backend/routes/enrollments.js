// ============================================================
// routes/enrollments.js — inscripción de un usuario a un curso
// y consulta de su propio progreso ("Mis cursos")
// ============================================================

import { Router } from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/me', async (req, res) => {
  const result = await pool.query(
    `SELECT enrollments.id AS enrollment_id, enrollments.progress, enrollments.status,
            enrollments.enrolled_at, courses.*
     FROM enrollments
     JOIN courses ON courses.id = enrollments.course_id
     WHERE enrollments.user_id = $1
     ORDER BY enrollments.enrolled_at DESC`,
    [req.user.id]
  );

  const enrollments = result.rows.map((row) => ({
    enrollmentId: row.enrollment_id,
    progress: row.progress,
    status: row.status,
    enrolledAt: row.enrolled_at,
    course: {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      level: row.level,
      summary: row.summary,
      durationHours: row.duration_hours,
      accent: row.accent,
      syllabus: row.syllabus
    }
  }));

  res.json({ enrollments: enrollments });
});

router.post('/', async (req, res) => {
  const { courseId } = req.body;

  if (courseId === undefined) {
    res.status(400).json({ error: 'Falta el identificador del curso.' });
    return;
  }

  const course = await pool.query('SELECT id FROM courses WHERE id = $1', [courseId]);
  if (course.rows.length === 0) {
    res.status(404).json({ error: 'Curso no encontrado.' });
    return;
  }

  const already = await pool.query(
    'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
    [req.user.id, courseId]
  );
  if (already.rows.length > 0) {
    res.status(409).json({ error: 'Ya estás inscrito en este curso.' });
    return;
  }

  const inserted = await pool.query(
    'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING id',
    [req.user.id, courseId]
  );

  res.status(201).json({ enrollmentId: inserted.rows[0].id, message: 'Inscripción realizada con éxito.' });
});

router.patch('/:id/progress', async (req, res) => {
  const { progress } = req.body;

  if (progress === undefined || progress < 0 || progress > 100) {
    res.status(400).json({ error: 'El progreso debe ser un número entre 0 y 100.' });
    return;
  }

  const enrollment = await pool.query(
    'SELECT * FROM enrollments WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.id]
  );
  if (enrollment.rows.length === 0) {
    res.status(404).json({ error: 'Inscripción no encontrada.' });
    return;
  }

  const status = progress >= 100 ? 'completado' : 'activo';
  await pool.query('UPDATE enrollments SET progress = $1, status = $2 WHERE id = $3', [progress, status, req.params.id]);

  res.json({ message: 'Progreso actualizado.' });
});

export default router;
