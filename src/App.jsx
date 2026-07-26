import { useState } from 'react';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Ejercicios from './pages/Ejercicios';
import Alimentacion from './pages/Alimentacion';
import Corporal from './pages/Corporal';
import Bienestar from './pages/Bienestar';
import Rutinas from './pages/Rutinas';
import EntrenamientoActivo from './pages/EntrenamientoActivo';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [pagina, setPagina] = useState('dashboard');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const handleLogin = (user) => setUsuario(user);
  const handleRegistrado = (user) => { setUsuario(user); setMostrarRegistro(false); };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (!usuario) {
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
        <div>
          <span style={{ marginRight: 15, fontSize: 14 }}>{usuario.nombre}</span>
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