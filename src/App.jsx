import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import useAuth from './hooks/useAuth';
import storage from './services/storage';
import { esNativo, getHash, onUrlAbierto } from './services/platform';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Ejercicios from './pages/Ejercicios';
import Alimentacion from './pages/Alimentacion';
import Corporal from './pages/Corporal';
import Bienestar from './pages/Bienestar';
import Rutinas from './pages/Rutinas';
import AuthCallback from './pages/AuthCallback';
import EliminarCuenta from './pages/EliminarCuenta';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Ajustes from './pages/Ajustes';

function AppContent() {
  const { usuario, loading, logout } = useAuth();
  const esPaginaEliminarCuenta = window.location.pathname.replace(/\/+$/, '') === '/eliminar-cuenta';
  const esPaginaRecuperar = window.location.pathname.replace(/\/+$/, '') === '/recuperar-contrasena';
  const [pagina, setPagina] = useState('dashboard');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [urlAbierta, setUrlAbierta] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return storage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (usuario) {
      return undefined;
    }
    return onUrlAbierto((url) => {
      if (url.includes('access_token')) {
        setUrlAbierta(url);
      }
    });
  }, [usuario]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    storage.setItem('darkMode', darkMode);
  }, [darkMode]);

  if (esPaginaEliminarCuenta) {
    return <EliminarCuenta />;
  }

  if (esPaginaRecuperar) {
    return <RecuperarContrasena />;
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!usuario) {
    if (getHash().includes('access_token') || (esNativo() && urlAbierta?.includes('access_token'))) {
      return <AuthCallback urlAbierta={esNativo() ? urlAbierta : null} onTerminado={() => setUrlAbierta(null)} />;
    }
    if (mostrarRegistro) {
      return <Registro onVolver={() => setMostrarRegistro(false)} />;
    }
    return <Login onCrearCuenta={() => setMostrarRegistro(true)} />;
  }

  const paginas = [
    { id: 'dashboard', label: '🏠', title: 'Inicio' },
    { id: 'ejercicios', label: '🏋️', title: 'Ejercicios' },
    { id: 'rutinas', label: '📋', title: 'Rutinas' },
    { id: 'alimentacion', label: '🍎', title: 'Comidas' },
    { id: 'corporal', label: '📏', title: 'Cuerpo' },
    { id: 'sueno', label: '😴', title: 'Bienestar' },
    { id: 'ajustes', label: '⚙️', title: 'Ajustes' },
  ];

  return (
    <div>
      <div className="header">
        <h3>🏃 VitaPlena</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span style={{ fontSize: 14 }}>{usuario.nombre}</span>
          <button onClick={logout}>Salir</button>
        </div>
      </div>
      <div className="nav">
        {paginas.map(p => (
          <button
            key={p.id}
            onClick={() => setPagina(p.id)}
            className={pagina === p.id ? 'active' : ''}
            title={p.title}
          >
            {p.label} {p.title}
          </button>
        ))}
      </div>
      <div className="container">
        {pagina === 'dashboard' && <Dashboard usuario={usuario} onNavigate={setPagina} />}
        {pagina === 'ejercicios' && <Ejercicios />}
        {pagina === 'rutinas' && <Rutinas />}
        {pagina === 'alimentacion' && <Alimentacion />}
        {pagina === 'corporal' && <Corporal />}
        {pagina === 'sueno' && <Bienestar />}
        {pagina === 'ajustes' && <Ajustes />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
