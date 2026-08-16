// ============================================================
// pages/Home.jsx
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import NotebookCard from '../components/NotebookCard.jsx';
import CourseCard from '../components/CourseCard.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getCourses().then((data) => setFeatured(data.courses.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="hero__eyebrow">
              <span className="hero__eyebrow-dot"></span>
              <span className="eyebrow" style={{ marginBottom: 0 }}>Academia independiente — Panamá</span>
            </span>

            <h1 className="hero__title">
              Del aprendizaje a tu <em>primer proyecto</em>
            </h1>

            <p className="hero__text">
              SkillCode Panamá reúne lo que voy aprendiendo en Ingeniería de Software —programación,
              matemáticas y las habilidades que no enseñan en un salón de clases— en cursos claros,
              pensados para llevarte de la teoría a algo que realmente construiste.
            </p>

            <div className="hero__actions">
              <Link to="/cursos" className="btn btn-primary">Explorar cursos</Link>
              <Link to="/como-funciona" className="btn btn-outline">Cómo funciona</Link>
            </div>

            <div className="hero__meta">
              <div>
                <div className="hero__meta-value">{featured.length > 0 ? '8+' : '—'}</div>
                <div className="hero__meta-label">CURSOS ACTIVOS</div>
              </div>
              <div>
                <div className="hero__meta-value">4</div>
                <div className="hero__meta-label">ÁREAS DE ESTUDIO</div>
              </div>
              <div>
                <div className="hero__meta-value">1:1</div>
                <div className="hero__meta-label">MENTORÍAS (PRÓXIMAMENTE)</div>
              </div>
            </div>
          </div>

          <NotebookCard />
        </div>
      </section>

      <section className="page-section page-section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Qué vas a encontrar</span>
            <h2 className="section-title">Tres pilares, una sola formación</h2>
            <p className="section-desc">No basta con saber programar. Cada curso encaja en uno de estos tres frentes.</p>
          </div>

          <div className="pillars">
            <div className="pillar">
              <span className="pillar__mark">01 · técnico</span>
              <h3 className="pillar__title">Programación y matemáticas</h3>
              <p className="pillar__desc">Lógica, lenguajes, sistemas embebidos y la matemática que realmente vas a usar programando.</p>
            </div>
            <div className="pillar">
              <span className="pillar__mark">02 · blando</span>
              <h3 className="pillar__title">Habilidades blandas</h3>
              <p className="pillar__desc">Comunicación, trabajo en equipo y manejo del feedback dentro de entornos técnicos reales.</p>
            </div>
            <div className="pillar">
              <span className="pillar__mark">03 · profesional</span>
              <h3 className="pillar__title">Empleabilidad</h3>
              <p className="pillar__desc">Portafolio, entrevistas y todo lo necesario para llegar a tu primera oportunidad formal.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Catálogo</span>
            <h2 className="section-title">Cursos destacados</h2>
          </div>

          {featured.length === 0 ? (
            <p className="loading-dots">cargando cursos...</p>
          ) : (
            <div className="course-grid">
              {featured.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          )}

          <div style={{ marginTop: 'var(--sp-4)' }}>
            <Link to="/cursos" className="btn btn-outline">Ver catálogo completo</Link>
          </div>
        </div>
      </section>

      <section className="page-section page-section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">El plan a futuro</span>
            <h2 className="section-title">Esto recién empieza</h2>
            <p className="section-desc">
              Hoy soy yo dando seguimiento directo a cada estudiante. Conforme crezca, se sumarán
              nuevos recursos, metodologías y —eventualmente— un equipo de mentores.
            </p>
          </div>
          <Link to="/sobre-mi" className="btn btn-primary">Conoce la historia detrás</Link>
        </div>
      </section>
    </>
  );
}
