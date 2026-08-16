// ============================================================
// context/AuthContext.jsx — sesión del usuario en toda la app
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('skillcode_token');

    if (token === null) {
      setIsLoading(false);
      return;
    }

    api.me()
      .then((data) => { setUser(data.user); })
      .catch(() => { localStorage.removeItem('skillcode_token'); })
      .finally(() => { setIsLoading(false); });
  }, []);

  async function login(email, password) {
    const data = await api.login({ email, password });
    localStorage.setItem('skillcode_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await api.register(payload);
    localStorage.setItem('skillcode_token', data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('skillcode_token');
    setUser(null);
  }

  const value = { user, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider.');
  }
  return context;
}
