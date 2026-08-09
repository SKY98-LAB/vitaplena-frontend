import axios from 'axios';
import env from '../config/env';
import storage from './storage';
import { emitLogout } from './sessionBus';

const api = axios.create({
  baseURL: env.apiUrl,
});

// Agregar token a cada petición
api.interceptors.request.use((config) => {
  const token = storage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Detecta 401 en petición autenticada: limpia storage y notifica
// al AuthContext para sincronizar el estado React.
// 403/429 se devuelven al componente sin borrar sesión ni recargar.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const peticionAutenticada = Boolean(error.config?.headers?.Authorization);
    if (status === 401 && peticionAutenticada) {
      storage.removeItem('token');
      storage.removeItem('usuario');
      emitLogout();
    }
    return Promise.reject(error);
  }
);

export default api;
