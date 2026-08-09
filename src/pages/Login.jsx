import { useState, useEffect } from 'react';
import api from '../services/api';
import env from '../config/env';
import useAuth from '../hooks/useAuth';
import { getHash, replaceHash } from '../services/platform';

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
      setError('Email o contraseña incorrectos');
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
      <a
        href={`${env.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${env.redirectUrl}`}
        style={{
          display: 'block', textAlign: 'center', padding: 12,
          background: '#fff', color: '#333', border: '1px solid #ddd',
          borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 16
        }}
      >
        🅶 Continuar con Google
      </a>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        ¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onCrearCuenta(); }}>Crear una</a>
      </p>
    </div>
  );
}

export default Login;