// ============================================================
// pages/Login.jsx
// ============================================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form.email, form.password);
      const redirectTo = location.state?.from || '/dashboard';
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-card__title">Bienvenido de vuelta</h1>
        <p className="auth-card__desc">Ingresa para continuar donde lo dejaste.</p>

        {error !== '' && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-card__footer">
          ¿Aún no tienes cuenta? <Link to="/registro">Crea una aquí</Link>
        </div>
      </div>
    </div>
  );
}
