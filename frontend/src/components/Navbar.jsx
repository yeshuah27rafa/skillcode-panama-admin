// ============================================================
// components/Navbar.jsx
// ============================================================

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate('/');
  }

  function linkClass({ isActive }) {
    return isActive ? 'is-active' : '';
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">
          SkillCode<span>Panamá</span>
        </NavLink>

        <nav className={'navbar__links' + (isOpen ? ' is-open' : '')}>
          <NavLink to="/cursos" className={linkClass} onClick={() => setIsOpen(false)}>Cursos</NavLink>
          <NavLink to="/como-funciona" className={linkClass} onClick={() => setIsOpen(false)}>Cómo funciona</NavLink>
          <NavLink to="/sobre-mi" className={linkClass} onClick={() => setIsOpen(false)}>Sobre mí</NavLink>

          {user !== null && (
            <NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>Mis cursos</NavLink>
          )}

          {user !== null && user.role === 'admin' && (
            <NavLink to="/admin" className={linkClass} onClick={() => setIsOpen(false)}>Panel admin</NavLink>
          )}

          <div className="navbar__auth">
            {user === null ? (
              <>
                <NavLink to="/ingresar" className="btn btn-outline" onClick={() => setIsOpen(false)}>Ingresar</NavLink>
                <NavLink to="/registro" className="btn btn-primary" onClick={() => setIsOpen(false)}>Crear cuenta</NavLink>
              </>
            ) : (
              <>
                <div className="navbar__user">
                  <span className="navbar__avatar">{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(' ')[0]}
                </div>
                <button type="button" className="btn btn-outline" onClick={handleLogout}>Salir</button>
              </>
            )}
          </div>
        </nav>

        <button type="button" className="navbar__toggle" aria-label="Abrir menú" onClick={() => setIsOpen(!isOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
