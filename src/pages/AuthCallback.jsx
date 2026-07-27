import { useEffect, useState } from 'react';
import api from '../services/api';

function AuthCallback({ onLogin }) {
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const procesarGoogle = async () => {
      try {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          setError('No se pudo autenticar con Google');
          setCargando(false);
          return;
        }

        const userRes = await fetch('https://kvbjqetankipzminsfrs.supabase.co/auth/v1/user', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userData = await userRes.json();

        const res = await api.post('/usuarios/google', {
          email: userData.email,
          nombre: userData.user_metadata?.full_name || userData.email?.split('@')[0],
          google_id: userData.id
        });

        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
        onLogin(res.data.usuario);

      } catch (err) {
        console.error('Error:', err);
        setError('Error al procesar el login con Google');
        setCargando(false);
      }
    };

    procesarGoogle();
  }, []);

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <h2>Iniciando sesion con Google...</h2>
        <p>Espera un momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <h2>Error</h2>
        <p>{error}</p>
        <a href="/">Volver al inicio</a>
      </div>
    );
  }

  return null;
}

export default AuthCallback;