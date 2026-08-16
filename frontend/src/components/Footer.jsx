// ============================================================
// components/Footer.jsx
// ============================================================

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">SkillCode Panamá</div>
            <p className="footer__brand-desc">
              Del aprendizaje a tu primer proyecto. Una plataforma para aprender programación,
              matemáticas y las habilidades que no se enseñan en un salón de clases.
            </p>
          </div>

          <div className="footer__col">
            <span className="footer__col-title">Plataforma</span>
            <Link to="/cursos">Catálogo de cursos</Link>
            <Link to="/como-funciona">Cómo funciona</Link>
            <Link to="/sobre-mi">Sobre mí</Link>
          </div>

          <div className="footer__col">
            <span className="footer__col-title">Contacto</span>
            <a href="mailto:yeshuah27rafa@gmail.com">yeshuah27rafa@gmail.com</a>
            <a href="https://wa.me/50766157132" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="https://linkedin.com/in/yeshuah-navarro-120020394" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 SkillCode Panamá — un proyecto de Yeshuah Navarro.</span>
          <span>Ciudad de Panamá, Panamá</span>
        </div>
      </div>
    </footer>
  );
}
