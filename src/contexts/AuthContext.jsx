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
    storage.clearSession();
    setToken(null);
    setUsuario(null);
  }, []);

  const login = useCallback((datos) => {
    const { accessToken, refreshToken, usuario, esNuevo } = datos || {};

    if (accessToken) {
      storage.setToken(accessToken);
      setToken(accessToken);
    }
    if (refreshToken) {
      storage.setRefreshToken(refreshToken);
    }
    if (usuario) {
      storage.setUsuario(usuario);
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
        storage.setUsuario(datos);
        setUsuario(datos);
        // El interceptor pudo haber renovado el accessToken vía refresh;
        // se usa el token vigente en storage, no el que se leyó al inicio.
        setToken(storage.getToken());
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
