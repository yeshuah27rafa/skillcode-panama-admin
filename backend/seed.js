// ============================================================
// seed.js — carga manual del catálogo (uso local / desarrollo).
// Ejecutar con: npm run seed
// Seguro de correr varias veces (ON CONFLICT DO NOTHING por slug).
// En producción esto mismo corre automáticamente al arrancar el
// servidor si la tabla de cursos está vacía — ver db.js.
// ============================================================

import 'dotenv/config';
import pool from './db.js';
import { insertCourses } from './seedData.js';

const inserted = await insertCourses(pool);
console.log('Seed completado: ' + inserted + ' cursos verificados en la base de datos.');
process.exit(0);
