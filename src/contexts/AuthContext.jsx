import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import storage from '../services/storage';
import { subscribeLogout } from '../services/sessionBus';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = storage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [token, setToken] = useState(() => storage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    storage.removeItem('token');
    storage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }, []);

  const login = useCallback((datos) => {
    const { accessToken, usuario, esNuevo } = datos || {};

    if (accessToken) {
      storage.setItem('token', accessToken);
      setToken(accessToken);
    }
    if (usuario) {
      storage.setItem('usuario', JSON.stringify(usuario));
      if (!esNuevo) {
        setUsuario(usuario);
      }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeLogout(() => logout());
    return unsubscribe;
  }, [logout]);

  useEffect(() => {
    const restaurarSesion = async () => {
      const tokenGuardado = storage.getItem('token');
      if (!tokenGuardado) {
        logout();
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/usuarios/me');
        const datos = res.data?.usuario ?? res.data;
        storage.setItem('usuario', JSON.stringify(datos));
        setUsuario(datos);
        setToken(tokenGuardado);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    restaurarSesion();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ usuario, token, loading, login, logout, autenticado: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
