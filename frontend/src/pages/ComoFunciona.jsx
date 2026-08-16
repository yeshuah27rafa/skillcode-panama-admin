// ============================================================
// pages/ComoFunciona.jsx
// ============================================================

import { Link } from 'react-router-dom';

export default function ComoFunciona() {
  return (
    <>
      <section className="page-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Proceso</span>
            <h1 className="section-title">Cómo funciona SkillCode</h1>
            <p className="section-desc">Tres pasos, sin letra pequeña. Así se ve tu formación de principio a fin.</p>
          </div>

          <div className="steps">
            <div>
              <div className="step__num">01</div>
              <h3 className="step__title">Eliges tu curso</h3>
              <p className="step__desc">Filtra por área —programación, matemáticas, blandas o profesionales— y elige el nivel que corresponde a tu punto de partida.</p>
            </div>
            <div>
              <div className="step__num">02</div>
              <h3 className="step__title">Aprendes a tu ritmo</h3>
              <p className="step__desc">Cada curso está pensado como una progresión clara de módulos, con ejemplos aplicados en lugar de teoría suelta.</p>
            </div>
            <div>
              <div className="step__num">03</div>
              <h3 className="step__title">Recibes seguimiento</h3>
              <p className="step__desc">Hoy, ese seguimiento lo doy yo directamente. Es el punto de partida de las mentorías personalizadas que vienen después.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section page-section--alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Hoy vs. después</span>
            <h2 className="section-title">Un recurso que crece contigo</h2>
          </div>

          <div className="pillars">
            <div className="pillar">
              <span className="pillar__mark">ahora</span>
              <h3 className="pillar__title">Recurso unitario</h3>
              <p className="pillar__desc">Cursos abiertos, catálogo en crecimiento y seguimiento directo, uno a uno, mientras la plataforma da sus primeros pasos.</p>
            </div>
            <div className="pillar">
              <span className="pillar__mark">próximo</span>
              <h3 className="pillar__title">Tutorías y mentorías</h3>
              <p className="pillar__desc">Acompañamiento personalizado, ajustado a las metas de cada estudiante, no solo al contenido del curso.</p>
            </div>
            <div className="pillar">
              <span className="pillar__mark">a futuro</span>
              <h3 className="pillar__title">Nuevas herramientas</h3>
              <p className="pillar__desc">Más metodologías, más recursos y —con el tiempo— un equipo detrás, sin perder el trato personal que lo originó.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ margin: '0 auto var(--sp-3)' }}>¿List@ para empezar?</h2>
          <Link to="/cursos" className="btn btn-primary">Explorar el catálogo</Link>
        </div>
      </section>
    </>
  );
}
