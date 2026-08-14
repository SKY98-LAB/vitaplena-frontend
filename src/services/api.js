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

// Promesa única de refresco: evita múltiples llamadas simultáneas
// cuando varias peticiones expiran a la vez (single-flight).
let refrescando = null;

// Identifica si el error corresponde a un accessToken inválido/expirado.
// - 401 en una petición autenticada (token no proporcionado/inválido).
// - 403 SOLO si el mensaje del backend es el de token (otros 403 de
//   plan/permisos deben llegar intactos al componente).
function esErrorTokenExpirado(error) {
  const status = error.response?.status;
  if (status === 401) return true;
  if (status === 403) {
    const mensaje = error.response?.data?.error;
    return typeof mensaje === 'string' && mensaje.includes('Token inválido o expirado');
  }
  return false;
}

// Llama al endpoint de refresh y guarda los tokens nuevos.
// Usa axios directo (no `api`) para no disparar los interceptores.
async function refrescarTokens() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('Sin refresh token');
  }

  const res = await axios.post(`${env.apiUrl}/usuarios/refresh`, { refreshToken });

  const { accessToken, refreshToken: nuevoRefreshToken } = res.data || {};
  if (!accessToken || !nuevoRefreshToken) {
    throw new Error('Respuesta de refresh inválida');
  }

  storage.setToken(accessToken);
  storage.setRefreshToken(nuevoRefreshToken);
  return accessToken;
}

function limpiarSesion() {
  storage.clearSession();
  emitLogout();
}

// Detecta 401/403 de token expirado en petición autenticada:
//  1. refresca el accessToken (una sola vez, con single-flight)
//  2. guarda los tokens nuevos
//  3. reintenta UNA vez la petición original
// Si no hay refreshToken o el refresh falla -> cierra sesión y notifica
// al AuthContext (via sessionBus) para volver al login.
// Los 403 de plan/permisos y otros errores se devuelven al componente.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config) {
      return Promise.reject(error);
    }

    const peticionAutenticada = Boolean(config.headers?.Authorization);
    const esPeticionRefresh = String(config.url || '').includes('/usuarios/refresh');

    if (!peticionAutenticada || esPeticionRefresh) {
      return Promise.reject(error);
    }

    if (!esErrorTokenExpirado(error)) {
      return Promise.reject(error);
    }

    // Ya se reintentó una vez y volvió a fallar por token: sesión inválida.
    if (config._reintentado) {
      limpiarSesion();
      return Promise.reject(error);
    }

    try {
      if (!refrescando) {
        refrescando = refrescarTokens().finally(() => {
          refrescando = null;
        });
      }
      const nuevoAccessToken = await refrescando;

      config._reintentado = true;
      config.headers.Authorization = `Bearer ${nuevoAccessToken}`;
      return api(config);
    } catch (refreshError) {
      limpiarSesion();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
