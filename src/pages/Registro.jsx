import { useState } from 'react';
import api from '../services/api';

function Registro({ onRegistrado, onVolver }) {
  const [form, setForm] = useState({
    email: '', password: '', nombre: '', apellido: '',
    peso_kg: '', altura_cm: '', sexo: 'M',
    entorno: 'casa', nivel: 'principiante', objetivo: 'mantenerse_activo'
  });
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1);

  const handleRegistro = async () => {
    try {
      const res = await api.post('/usuarios/registro', {
        email: form.email,
        password: form.password,
        nombre: form.nombre,
        apellido: form.apellido
      });
      // Actualizar perfil con datos corporales
      await api.put('/usuarios/perfil', {
        peso_kg: parseFloat(form.peso_kg),
        altura_cm: parseFloat(form.altura_cm),
        sexo: form.sexo,
        entorno_entrenamiento: form.entorno,
        nivel_experiencia: form.nivel,
        objetivo_principal: form.objetivo
      });
      // Login automático
      const loginRes = await api.post('/usuarios/login', {
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', loginRes.data.accessToken);
      localStorage.setItem('usuario', JSON.stringify(loginRes.data.usuario));
      onRegistrado(loginRes.data.usuario);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '30px auto', padding: 20 }}>
      <h1>🏃 Crear cuenta en VitaPlena</h1>
      
      {paso === 1 && (
        <div>
          <h3>Paso 1: Tus datos</h3>
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} style={inputStyle} />
          <input placeholder="Apellido" value={form.apellido} onChange={(e) => setForm({...form, apellido: e.target.value})} style={inputStyle} />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={inputStyle} />
          <input placeholder="Contraseña" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={inputStyle} />
          <button onClick={() => setPaso(2)} style={btnStyle}>Siguiente →</button>
        </div>
      )}

      {paso === 2 && (
        <div>
          <h3>Paso 2: Tu cuerpo</h3>
          <input placeholder="Peso (kg)" type="number" value={form.peso_kg} onChange={(e) => setForm({...form, peso_kg: e.target.value})} style={inputStyle} />
          <input placeholder="Altura (cm)" type="number" value={form.altura_cm} onChange={(e) => setForm({...form, altura_cm: e.target.value})} style={inputStyle} />
          <select value={form.sexo} onChange={(e) => setForm({...form, sexo: e.target.value})} style={inputStyle}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <button onClick={() => setPaso(1)} style={{...btnStyle, background: '#999'}}>← Atrás</button>
          <button onClick={() => setPaso(3)} style={btnStyle}>Siguiente →</button>
        </div>
      )}

      {paso === 3 && (
        <div>
          <h3>Paso 3: Tu entrenamiento</h3>
          <select value={form.entorno} onChange={(e) => setForm({...form, entorno: e.target.value})} style={inputStyle}>
            <option value="casa">🏠 Casa</option>
            <option value="gimnasio">🏋️ Gimnasio</option>
          </select>
          <select value={form.nivel} onChange={(e) => setForm({...form, nivel: e.target.value})} style={inputStyle}>
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <select value={form.objetivo} onChange={(e) => setForm({...form, objetivo: e.target.value})} style={inputStyle}>
            <option value="mantenerse_activo">Mantenerse activo</option>
            <option value="perder_peso">Perder peso</option>
            <option value="ganar_musculo">Ganar músculo</option>
            <option value="flexibilidad">Flexibilidad</option>
          </select>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={() => setPaso(2)} style={{...btnStyle, background: '#999'}}>← Atrás</button>
          <button onClick={handleRegistro} style={btnStyle}>✅ Crear cuenta</button>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        ¿Ya tienes cuenta? <a href="#" onClick={onVolver}>Iniciar sesión</a>
      </p>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', margin: '10px 0', padding: 12, borderRadius: 5, border: '1px solid #ccc', fontSize: 16 };
const btnStyle = { padding: 12, width: '100%', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 16, marginTop: 10 };

export default Registro;