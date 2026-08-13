import { useState, useEffect } from 'react';
import api from '../services/api';
import env from '../config/env';
import useAuth from '../hooks/useAuth';
import { getHash, replaceHash, openUrl, getOAuthRedirectUrl } from '../services/platform';

function Login({ onCrearCuenta }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (getHash().includes('access_token')) {
      replaceHash();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/usuarios/login', { email, password });
      login(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Email o contraseña incorrectos.');
      } else {
        setError('No se pudo conectar con el servidor. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h1>🏃 VitaPlena</h1>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: 10 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: 10 }}
        />
        <button type="submit" style={{ padding: 10, width: '100%', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
              <p style={{ textAlign: 'center', color: '#888', margin: '15px 0' }}>o</p>
      <button
        type="button"
        onClick={() => openUrl(`${env.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${getOAuthRedirectUrl()}`)}
        style={{
          display: 'block', textAlign: 'center', padding: 12,
          background: '#fff', color: '#333', border: '1px solid #ddd',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 16, width: '100%', cursor: 'pointer'
        }}
      >
        🅶 Continuar con Google
      </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <a
          href="/recuperar-contrasena"
          style={{ color: '#2196F3', textDecoration: 'none' }}
        >
          ¿Olvidaste tu contraseña?
        </a>
      </p>
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        ¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onCrearCuenta(); }}>Crear una</a>
      </p>
    </div>
  );
}

export default Login;