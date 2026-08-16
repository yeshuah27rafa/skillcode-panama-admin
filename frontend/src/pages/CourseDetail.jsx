// ============================================================
// pages/CourseDetail.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    setCourse(null);
    api.getCourse(slug).then((data) => setCourse(data.course)).catch(() => setCourse(false));
    api.getCourseMaterials(slug).then((data) => setMaterials(data.materials)).catch(() => setMaterials([]));
  }, [slug]);

  async function handleEnroll() {
    if (user === null) {
      navigate('/ingresar', { state: { from: '/cursos/' + slug } });
      return;
    }

    setIsEnrolling(true);
    setStatus({ type: null, message: '' });

    try {
      await api.enroll(course.id);
      setStatus({ type: 'success', message: 'Inscripción realizada. Ya puedes verlo en tu panel "Mis cursos".' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsEnrolling(false);
    }
  }

  if (course === null) {
    return <div className="container page-section"><p className="loading-dots">cargando curso...</p></div>;
  }

  if (course === false) {
    return (
      <div className="container page-section">
        <div className="empty-state">
          <div className="empty-state__title">Curso no encontrado</div>
          <Link to="/cursos" className="btn btn-outline" style={{ marginTop: 'var(--sp-3)' }}>Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="course-detail__head">
          <div>
            <span className="eyebrow">{course.category}</span>
            <h1 className="course-detail__title">{course.title}</h1>
            <div className="course-detail__meta">
              <span className="tag">{course.level}</span>
              <span className="tag">{course.duration_hours} horas</span>
              <span className="tag">{course.syllabus.length} módulos</span>
            </div>
          </div>
        </div>

        <div className="course-detail__grid">
          <div>
            <p className="section-desc" style={{ maxWidth: 'none', marginBottom: 'var(--sp-4)' }}>{course.description}</p>

            <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Contenido del curso</h2>
            <div className="syllabus-list">
              {course.syllabus.map((topic, index) => (
                <div className="syllabus-item" key={index}>
                  <span className="syllabus-item__index">{String(index + 1).padStart(2, '0')}</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>

            {materials.length > 0 && (
              <>
                <h2 className="section-title" style={{ fontSize: '1.4rem', marginTop: 'var(--sp-5)' }}>Materiales</h2>
                <div className="materials-list">
                  {materials.map((material) => (
                    <div className="material-item" key={material.id}>
                      <span className={'tag tag--' + (material.type === 'file' ? 'amber' : 'brand')}>
                        {material.type === 'file' ? 'PDF / imagen' : material.type === 'link' ? 'Enlace' : 'Lectura'}
                      </span>
                      <div className="material-item__body">
                        <h4>{material.title}</h4>
                        {material.type === 'text' && <p>{material.body}</p>}
                        {material.type === 'file' && (
                          <a href={material.file_path} target="_blank" rel="noopener noreferrer">Descargar {material.file_name}</a>
                        )}
                        {material.type === 'link' && (
                          <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="enroll-card">
            <div className="enroll-card__row">
              <span className="enroll-card__label">Nivel</span>
              <span className="enroll-card__value">{course.level}</span>
            </div>
            <div className="enroll-card__row">
              <span className="enroll-card__label">Duración</span>
              <span className="enroll-card__value">{course.duration_hours} horas</span>
            </div>
            <div className="enroll-card__row">
              <span className="enroll-card__label">Categoría</span>
              <span className="enroll-card__value">{course.category}</span>
            </div>

            {status.type === 'success' && <p className="form-success" style={{ marginTop: 'var(--sp-3)' }}>{status.message}</p>}
            {status.type === 'error' && <p className="form-error" style={{ marginTop: 'var(--sp-3)' }}>{status.message}</p>}

            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ marginTop: 'var(--sp-3)' }}
              onClick={handleEnroll}
              disabled={isEnrolling || status.type === 'success'}
            >
              {user === null ? 'Inicia sesión para inscribirte' : isEnrolling ? 'Inscribiendo...' : 'Inscribirme'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
