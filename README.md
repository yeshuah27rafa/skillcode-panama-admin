# SkillCode Panamá

Plataforma-academia para aprender programación, matemáticas y habilidades
técnicas, blandas y profesionales. Registro/login real, catálogo de cursos,
inscripciones, panel de administración y materiales (texto, PDF/imagen, enlaces).

```
skillcode-panama/
├── backend/     -> API REST (Node.js + Express + Postgres)
└── frontend/    -> Interfaz (React + Vite)
```

## Infraestructura

| Pieza | Dónde vive | Por qué |
|---|---|---|
| Código | GitHub | Control de versiones, nunca datos de usuarios |
| Base de datos | Postgres (Supabase) | Persistente de verdad, plan gratis suficiente |
| Archivos (PDF/imágenes) | Supabase Storage | Nunca en disco del servidor — se pierde en cada redeploy |
| Backend | Railway / Render | Corre la API Node de forma continua |
| Frontend | Vercel | Deploy automático del build de React |

## 1. Crear el proyecto en Supabase

1. Ve a **supabase.com** → **New project**.
2. En **Project Settings → Database → Connection string → URI**, copia la cadena
   (reemplaza `[YOUR-PASSWORD]` por la que definiste al crear el proyecto).
3. En **Project Settings → API**, copia `Project URL` y la `service_role key`
   (¡no la `anon` key! — el backend necesita permisos de escritura).
4. En **Storage**, crea un bucket llamado `materials` y márcalo como **público**
   (para que los PDF/imágenes sean descargables directamente por URL).

## 2. Backend

```
cd backend
npm install
cp .env.example .env
```

Edita `.env` con los valores reales de Supabase:

```
DATABASE_URL=postgresql://postgres:TU_PASSWORD@db.xxxxxxxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
SUPABASE_BUCKET=materials
ADMIN_EMAIL=tu-correo@ejemplo.com
JWT_SECRET=una-cadena-larga-y-secreta
```

```
npm run dev    # http://localhost:4000
```

Las tablas y el catálogo inicial se crean solos al arrancar (no hace falta
correr un seed manual, aunque `npm run seed` sigue disponible). La cuenta que
registres con el correo de `ADMIN_EMAIL` se vuelve administradora automáticamente.

### Endpoints principales

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Crear cuenta | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET  | `/api/auth/me` | Perfil del usuario actual | Sí |
| GET  | `/api/courses` | Catálogo (filtro `?category=`) | No |
| GET  | `/api/courses/:slug` | Detalle de un curso | No |
| GET  | `/api/courses/:slug/materials` | Materiales de un curso | No |
| GET  | `/api/enrollments/me` | Mis cursos inscritos | Sí |
| POST | `/api/enrollments` | Inscribirse a un curso (`courseId`) | Sí |
| PATCH | `/api/enrollments/:id/progress` | Actualizar progreso | Sí |
| GET/POST/PUT/DELETE | `/api/admin/courses` | CRUD de cursos | Admin |
| GET/POST/DELETE | `/api/admin/materials` | CRUD de materiales (texto/archivo/enlace) | Admin |

## 3. Frontend

```
cd frontend
npm install
cp .env.example .env   # apunta a http://localhost:4000/api
npm run dev             # http://localhost:5173
```

## 4. Despliegue

**Backend (Railway o Render):**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Variables de entorno: las mismas que en tu `.env` local

**Frontend (Vercel):**
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Variable de entorno: `VITE_API_URL` = URL pública de tu backend + `/api`
- Agrega `frontend/public/_redirects` si despliegas en Netlify en vez de Vercel
  (Vercel maneja las rutas de React Router sin configuración extra).

## Qué falta para producción

1. Recuperación de contraseña y verificación de correo.
2. Contenido de lecciones más allá del temario y los materiales adjuntos
   (hoy ya soporta texto, PDF/imagen y enlaces por curso).
3. Tutorías y mentorías personalizadas — el dashboard ya tiene el espacio
   reservado para introducirlas más adelante.

## Diseño

Paleta cálida y educativa (papel `#F6F1E2`, jade `#0E6E5A`, ámbar `#E8A23A`),
tipografía Fraunces + Manrope + JetBrains Mono. El elemento distintivo es la
tarjeta "cuaderno vivo" del Hero, que alterna apuntes reales de matemática,
código y QA.
