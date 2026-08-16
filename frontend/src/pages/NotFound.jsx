// ============================================================
// pages/NotFound.jsx
// ============================================================

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page-section" style={{ textAlign: 'center' }}>
      <div className="empty-state">
        <div className="empty-state__title">Página no encontrada</div>
        <p style={{ marginBottom: 'var(--sp-3)' }}>El apunte que buscas no está en este cuaderno.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
