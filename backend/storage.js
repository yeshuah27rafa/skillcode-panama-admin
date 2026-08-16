// ============================================================
// storage.js — subida y borrado de archivos en Supabase Storage.
// Los materiales tipo "file" (PDF/imagen) viven aquí, nunca en
// el disco del servidor (se pierden en cada redeploy/reinicio).
// ============================================================

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'materials';

let client = null;
if (SUPABASE_URL !== undefined && SUPABASE_SERVICE_ROLE_KEY !== undefined) {
  client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

export function isStorageConfigured() {
  return client !== null;
}

export async function uploadMaterialFile(file) {
  if (client === null) {
    throw new Error('El almacenamiento de archivos no está configurado (faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).');
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueName = Date.now() + '-' + crypto.randomBytes(8).toString('hex') + ext;
  const objectPath = 'materials/' + uniqueName;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(objectPath, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) {
    throw new Error('No se pudo subir el archivo: ' + error.message);
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(objectPath);

  return { publicUrl: data.publicUrl, objectPath: objectPath };
}

export async function deleteMaterialFile(objectPath) {
  if (client === null || objectPath === null || objectPath === undefined) {
    return;
  }
  await client.storage.from(BUCKET).remove([objectPath]);
}
