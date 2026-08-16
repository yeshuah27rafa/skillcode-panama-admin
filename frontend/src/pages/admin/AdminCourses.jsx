// ============================================================
// pages/admin/AdminCourses.jsx — listado y acciones de cursos
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';

export default function AdminCourses() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState('');

  function loadCourses() {
    api.adminGetCourses().then((data) => setCourses(data.courses)).catch((err) => setError(err.message));
  }

  useEffect(() => { loadCourses(); }, []);

  async function handleDelete(course) {
    const confirmed = window.confirm('¿Eliminar "' + course.title + '"? Esto también borra sus materiales.');
    if (confirmed === false) return;

    try {
      await api.adminDeleteCourse(course.id);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="dash-header">
          <div>
            <span className="eyebrow">Panel admin</span>
            <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>Cursos</h1>
            <p className="dash-greeting">Crea, edita y gestiona el material de cada curso.</p>
          </div>
          <Link to="/admin/cursos/nuevo" className="btn btn-primary">+ Nuevo curso</Link>
        </div>

        {error !== '' && <p className="form-error">{error}</p>}

        {courses === null ? (
          <p className="loading-dots">cargando cursos...</p>
        ) : (
          <div className="admin-table">
            {courses.map((course) => (
              <div className="admin-row" key={course.id}>
                <div className="admin-row__main">
                  <span className="tag tag--brand">{course.category}</span>
                  <h3 className="admin-row__title">{course.title}</h3>
                  <span className="admin-row__meta">{course.level} · {course.duration_hours} h · /{course.slug}</span>
                </div>
                <div className="admin-row__actions">
                  <Link to={'/admin/cursos/' + course.id + '/materiales'} className="btn btn-outline btn-sm-like">Materiales</Link>
                  <Link to={'/admin/cursos/' + course.id + '/editar'} className="btn btn-outline btn-sm-like">Editar</Link>
                  <button type="button" className="btn btn-outline btn-sm-like btn-danger" onClick={() => handleDelete(course)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
