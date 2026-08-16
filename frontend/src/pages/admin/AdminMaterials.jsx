// ============================================================
// pages/admin/AdminMaterials.jsx — materiales de un curso:
// texto, archivo adjunto (PDF/imagen) o enlace externo
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api.js';

const TYPE_LABELS = { text: 'Texto', file: 'Archivo', link: 'Enlace' };

export default function AdminMaterials() {
  const { id } = useParams();

  const [materials, setMaterials] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [type, setType] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadMaterials() {
    api.adminGetMaterials(id).then((data) => setMaterials(data.materials)).catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadMaterials();
    api.adminGetCourses().then((data) => {
      const course = data.courses.find((item) => String(item.id) === id);
      if (course !== undefined) setCourseTitle(course.title);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function resetForm() {
    setType('text');
    setTitle('');
    setBody('');
    setUrl('');
    setFile(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('courseId', id);
    formData.append('type', type);
    formData.append('title', title);
    if (type === 'text') formData.append('body', body);
    if (type === 'link') formData.append('url', url);
    if (type === 'file' && file !== null) formData.append('file', file);

    try {
      await api.adminCreateMaterial(formData);
      resetForm();
      loadMaterials();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(materialId) {
    const confirmed = window.confirm('¿Eliminar este material?');
    if (confirmed === false) return;

    try {
      await api.adminDeleteMaterial(materialId);
      loadMaterials();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <span className="eyebrow">Panel admin</span>
        <h1 className="section-title" style={{ marginBottom: '0.3rem' }}>Materiales{courseTitle !== '' ? ' — ' + courseTitle : ''}</h1>
        <Link to="/admin" style={{ color: 'var(--brand)', fontSize: '0.85rem', fontWeight: 600 }}>← Volver a cursos</Link>

        {error !== '' && <p className="form-error" style={{ marginTop: 'var(--sp-3)' }}>{error}</p>}

        <div className="admin-materials__grid">
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="field">
              <label htmlFor="mat-type">Tipo de material</label>
              <select id="mat-type" value={type} onChange={(event) => setType(event.target.value)}>
                <option value="text">Texto (lección corta)</option>
                <option value="file">Archivo (PDF, imagen)</option>
                <option value="link">Enlace externo</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="mat-title">Título</label>
              <input id="mat-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Guía de ejercicios — Módulo 1" />
            </div>

            {type === 'text' && (
              <div className="field">
                <label htmlFor="mat-body">Contenido</label>
                <textarea id="mat-body" required rows={5} value={body} onChange={(event) => setBody(event.target.value)}></textarea>
              </div>
            )}

            {type === 'link' && (
              <div className="field">
                <label htmlFor="mat-url">URL</label>
                <input id="mat-url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
              </div>
            )}

            {type === 'file' && (
              <div className="field">
                <label htmlFor="mat-file">Archivo (PDF, PNG, JPG, WEBP, GIF — máx. 15 MB)</label>
                <input id="mat-file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.gif" onChange={(event) => setFile(event.target.files[0])} />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              {isSubmitting ? 'Subiendo...' : 'Agregar material'}
            </button>
          </form>

          <div>
            {materials === null ? (
              <p className="loading-dots">cargando materiales...</p>
            ) : materials.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__title">Sin materiales aún</div>
                <p>Agrega el primero desde el formulario.</p>
              </div>
            ) : (
              <div className="admin-table">
                {materials.map((material) => (
                  <div className="admin-row" key={material.id}>
                    <div className="admin-row__main">
                      <span className="tag">{TYPE_LABELS[material.type]}</span>
                      <h3 className="admin-row__title">{material.title}</h3>
                      {material.type === 'file' && (
                        <a href={material.file_path} target="_blank" rel="noopener noreferrer" className="admin-row__meta">
                          {material.file_name}
                        </a>
                      )}
                      {material.type === 'link' && (
                        <a href={material.url} target="_blank" rel="noopener noreferrer" className="admin-row__meta">{material.url}</a>
                      )}
                      {material.type === 'text' && (
                        <span className="admin-row__meta">{material.body.slice(0, 80)}{material.body.length > 80 ? '…' : ''}</span>
                      )}
                    </div>
                    <div className="admin-row__actions">
                      <button type="button" className="btn btn-outline btn-sm-like btn-danger" onClick={() => handleDelete(material.id)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
