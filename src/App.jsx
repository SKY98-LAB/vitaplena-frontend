import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Ejercicios from './pages/Ejercicios';
import Alimentacion from './pages/Alimentacion';
import Corporal from './pages/Corporal';
import Bienestar from './pages/Bienestar';
import Rutinas from './pages/Rutinas';
import AuthCallback from './pages/AuthCallback';


function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [pagina, setPagina] = useState('dashboard');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogin = (user) => setUsuario(user);
  const handleRegistrado = (user) => { setUsuario(user); setMostrarRegistro(false); };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (!usuario) {
  if (window.location.hash && window.location.hash.includes('access_token')) {
    return <AuthCallback onLogin={handleLogin} />;
  }
  if (mostrarRegistro) {
      return <Registro onRegistrado={handleRegistrado} onVolver={() => setMostrarRegistro(false)} />;
    }
    return <Login onLogin={handleLogin} onCrearCuenta={() => setMostrarRegistro(true)} />;
  }

  const paginas = [
    { id: 'dashboard', label: '🏠', title: 'Inicio' },
    { id: 'ejercicios', label: '🏋️', title: 'Ejercicios' },
    { id: 'rutinas', label: '📋', title: 'Rutinas' },
    { id: 'alimentacion', label: '🍎', title: 'Comidas' },
    { id: 'corporal', label: '📏', title: 'Cuerpo' },
    { id: 'sueno', label: '😴', title: 'Bienestar' },
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
          <button onClick={handleLogout}>Salir</button>
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
      </div>
    </div>
  );
}

export default App;