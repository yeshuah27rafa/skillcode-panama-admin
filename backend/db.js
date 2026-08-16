// ============================================================
// db.js — conexión a Postgres (Supabase) y definición de esquema.
// ============================================================

import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost')
    ? false
    : { rejectUnauthorized: false }
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    goal TEXT,
    role TEXT NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_hours INTEGER NOT NULL,
    syllabus JSONB NOT NULL,
    accent TEXT NOT NULL DEFAULT 'teal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'activo',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    file_path TEXT,
    file_name TEXT,
    file_object_path TEXT,
    url TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );

  ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
  ALTER TABLE materials ADD COLUMN IF NOT EXISTS file_object_path TEXT;
`);

const adminEmail = process.env.ADMIN_EMAIL;
if (adminEmail !== undefined) {
  await pool.query(
    "UPDATE users SET role = 'admin' WHERE email = $1 AND role != 'admin'",
    [adminEmail.toLowerCase().trim()]
  );
}

const { rows } = await pool.query('SELECT COUNT(*)::int AS total FROM courses');
if (rows[0].total === 0) {
  const { insertCourses } = await import('./seedData.js');
  const inserted = await insertCourses(pool);
  console.log('Auto-seed: ' + inserted + ' cursos cargados al arrancar.');
}

export default pool;
