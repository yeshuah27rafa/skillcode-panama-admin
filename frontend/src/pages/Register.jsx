// ============================================================
// pages/Register.jsx
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', goal: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-card__title">Crea tu cuenta</h1>
        <p className="auth-card__desc">Un solo paso para empezar a aprender.</p>

        {error !== '' && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nombre completo</label>
            <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Tu nombre" />
          </div>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
          </div>
          <div className="field">
            <label htmlFor="goal">¿Qué quieres aprender? (opcional)</label>
            <input id="goal" name="goal" type="text" value={form.goal} onChange={handleChange} placeholder="Ej. programación desde cero" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-card__footer">
          ¿Ya tienes cuenta? <Link to="/ingresar">Ingresa aquí</Link>
        </div>
      </div>
    </div>
  );
}
