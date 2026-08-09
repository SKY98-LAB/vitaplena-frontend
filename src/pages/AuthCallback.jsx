import { useEffect, useState } from 'react';
import api from '../services/api';
import env from '../config/env';
import useAuth from '../hooks/useAuth';
import { cerrarBrowser, replaceHash } from '../services/platform';

function AuthCallback({ urlAbierta, onTerminado }) {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [necesitaPerfil, setNecesitaPerfil] = useState(false);
  const [sesionGoogle, setSesionGoogle] = useState(null);
  const [form, setForm] = useState({ peso_kg: '', altura_cm: '', sexo: 'M', objetivo: 'mantenerse_activo' });

  const cerrarNativo = async () => {
    if (urlAbierta) {
      await cerrarBrowser();
    }
  };

  const volver = async () => {
    await cerrarNativo();
    onTerminado?.();
    if (!urlAbierta) {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const procesarGoogle = async () => {
      try {
        const url = urlAbierta || window.location.href;
        const fragmento = url.slice(url.indexOf('#') + 1);
        const params = new URLSearchParams(fragmento);
        const accessToken = params.get('access_token');

        if (!accessToken) {
          setError('No se pudo autenticar con Google');
          setCargando(false);
          await cerrarNativo();
          return;
        }

        replaceHash();

        const userRes = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userData = await userRes.json();

        const res = await api.post('/usuarios/google', {
          email: userData.email,
          nombre: userData.user_metadata?.full_name || userData.email?.split('@')[0],
          google_id: userData.id
        });

        setSesionGoogle(res.data);
        login(res.data);

        if (res.data.esNuevo) {
          setNecesitaPerfil(true);
          setCargando(false);
        } else {
          await cerrarNativo();
          onTerminado?.();
        }

      } catch (err) {
        console.error('Error:', err);
        setError('Error al procesar el login');
        setCargando(false);
        await cerrarNativo();
      }
    };

    procesarGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  const guardarPerfil = async () => {
    if (!form.peso_kg || !form.altura_cm) {
      setError('Peso y altura son obligatorios');
      return;
    }
    try {
      await api.put('/usuarios/perfil', {
        peso_kg: parseFloat(form.peso_kg),
        altura_cm: parseFloat(form.altura_cm),
        sexo: form.sexo,
        objetivo_principal: form.objetivo
      });
      login({ accessToken: sesionGoogle.accessToken, usuario: sesionGoogle.usuario });
      await cerrarNativo();
      onTerminado?.();
    } catch (err) {
      setError('Error al guardar perfil');
    }
  };

  if (necesitaPerfil) {
    return (
      <div style={{ maxWidth: 400, margin: '30px auto', padding: 20 }}>
        <h2>🏃 Completa tu perfil</h2>
        <p>Para personalizar tu experiencia</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input placeholder="Peso (kg)" type="number" className="input" value={form.peso_kg} onChange={(e) => setForm({...form, peso_kg: e.target.value})} />
        <input placeholder="Altura (cm)" type="number" className="input" value={form.altura_cm} onChange={(e) => setForm({...form, altura_cm: e.target.value})} />
        <select className="input" value={form.sexo} onChange={(e) => setForm({...form, sexo: e.target.value})}>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <select className="input" value={form.objetivo} onChange={(e) => setForm({...form, objetivo: e.target.value})}>
          <option value="mantenerse_activo">Mantenerse activo</option>
          <option value="perder_peso">Perder peso</option>
          <option value="ganar_musculo">Ganar músculo</option>
        </select>
        <button onClick={guardarPerfil} className="btn btn-success" style={{ width: '100%' }}>Guardar y continuar</button>
      </div>
    );
  }

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <h2>Iniciando sesion con Google...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={volver} style={{ padding: 10, cursor: 'pointer' }}>Volver al inicio</button>
      </div>
    );
  }

  return null;
}

export default AuthCallback;
