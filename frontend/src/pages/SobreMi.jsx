// ============================================================
// pages/SobreMi.jsx
// ============================================================

export default function SobreMi() {
  return (
    <section className="page-section">
      <div className="container" style={{ maxWidth: '760px' }}>
        <span className="eyebrow">Sobre mí</span>
        <h1 className="section-title">Por qué existe SkillCode Panamá</h1>

        <p style={{ color: 'var(--ink-soft)', marginBottom: 'var(--sp-3)', fontSize: '1.05rem' }}>
          Soy Yeshuah Navarro, estudiante de Ingeniería de Software en la Universidad Tecnológica de
          Panamá y de Técnico Auxiliar en Desarrollo Web en USMA-ITUM. SkillCode nació como mi propio
          cuaderno de aprendizaje: un lugar para ordenar lo que voy entendiendo de programación,
          matemáticas y del trabajo en equipo, en lugar de dejarlo disperso entre apuntes sueltos.
        </p>

        <p style={{ color: 'var(--ink-soft)', marginBottom: 'var(--sp-3)', fontSize: '1.05rem' }}>
          Después de mi práctica profesional en SERTV, entendí que lo que más me faltaba al entrar al
          mundo laboral no era solo técnica: era estructura, seguimiento y alguien que ajustara el
          camino a mis necesidades reales. SkillCode busca ser eso mismo, primero para mí y luego para
          quien lo necesite.
        </p>

        <p style={{ color: 'var(--ink-soft)', marginBottom: 'var(--sp-5)', fontSize: '1.05rem' }}>
          Hoy es un recurso que manejo yo mismo: cada curso, cada seguimiento y cada mensaje pasa por
          mí. La idea es que crezca sin perder eso —el trato personal— incluso cuando llegue el momento
          de sumar mentorías, nuevas herramientas y, más adelante, un equipo.
        </p>

        <div className="mentoring-note">
          <strong>Hacia dónde va esto:</strong> tutorías y mentorías personalizadas, ajustadas a las
          metas de cada estudiante — no solo al temario de un curso.
        </div>
      </div>
    </section>
  );
}
