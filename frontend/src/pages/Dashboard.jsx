// ============================================================
// pages/Dashboard.jsx — "Mis cursos", protegido por sesión
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState(null);

  useEffect(() => {
    api.getMyEnrollments().then((data) => setEnrollments(data.enrollments)).catch(() => setEnrollments([]));
  }, []);

  async function handleProgress(enrollmentId, nextProgress) {
    await api.updateProgress(enrollmentId, nextProgress).catch(() => {});
    setEnrollments((current) =>
      current.map((item) => item.enrollmentId === enrollmentId ? { ...item, progress: nextProgress } : item)
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="dash-header">
          <div>
            <span className="eyebrow">Mi panel</span>
            <h1 className="section-title" style={{ marginBottom: '0.2rem' }}>Hola, {user.name.split(' ')[0]}</h1>
            <p className="dash-greeting">Este es el estado de tus cursos.</p>
          </div>
          <Link to="/cursos" className="btn btn-outline">Explorar más cursos</Link>
        </div>

        {enrollments === null ? (
          <p className="loading-dots">cargando tus cursos...</p>
        ) : enrollments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">Aún no te has inscrito a ningún curso</div>
            <p style={{ marginBottom: 'var(--sp-3)' }}>Elige uno del catálogo para empezar a avanzar.</p>
            <Link to="/cursos" className="btn btn-primary">Ver catálogo</Link>
          </div>
        ) : (
          <div className="dash-grid">
            {enrollments.map((item) => (
              <div className="enrollment-card" key={item.enrollmentId}>
                <span className="tag tag--brand">{item.course.category}</span>
                <h3 className="enrollment-card__title">{item.course.title}</h3>
                <div className="enrollment-card__meta">{item.course.durationHours} h · {item.course.level}</div>

                <div className="progress-label">
                  <span>Progreso</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: item.progress + '%' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'var(--sp-2)' }}>
                  <button type="button" className="btn btn-outline btn-sm-like" onClick={() => handleProgress(item.enrollmentId, Math.min(item.progress + 25, 100))}>
                    + Avanzar módulo
                  </button>
                  <Link to={'/cursos/' + item.course.slug} className="btn btn-outline">Ver curso</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mentoring-note">
          <strong>Tutorías y mentorías personalizadas:</strong> próximamente. Por ahora, cualquier duda
          sobre tu progreso puedes escribirla directamente a <a href="mailto:yeshuah27rafa@gmail.com">yeshuah27rafa@gmail.com</a>.
        </div>
      </div>
    </section>
  );
}
