import { useState, useEffect } from 'react';
import api from '../services/api';
import EntrenamientoActivo from './EntrenamientoActivo';

const ejercicioIconos = {
  pecho: '🦾', espalda: '🔙', cuadriceps: '🦵', femorales: '🦵',
  pantorrillas: '🦶', gluteos: '🍑', hombros: '🙆',
  biceps: '💪', triceps: '💪', core: '🎯', cardio: '❤️', flexibilidad: '🧘‍♂️',
  piernas: '🦵', brazos: '💪'
};

function Rutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);
  const [grupoMuscular, setGrupoMuscular] = useState('pecho');
  const [nivel, setNivel] = useState('principiante');
  const [entorno, setEntorno] = useState('casa');
  const [entrenando, setEntrenando] = useState(false);
  const [rutinaActiva, setRutinaActiva] = useState(null);
  const [modo, setModo] = useState('normal');
  const [rutinasHoy, setRutinasHoy] = useState(0);
  const [objetivo, setObjetivo] = useState('hipertrofia');

  useEffect(() => {
    cargarRutinas();
    cargarLimite();
  }, []);

  const cargarRutinas = async () => {
    try {
      const res = await api.get('/rutinas');
      setRutinas(res.data.rutinas);
    } catch (err) {
      console.error('Error al cargar rutinas');
    }
  };

  const cargarLimite = async () => {
    try {
      const res = await api.get('/usuarios/rutinas-hoy');
      setRutinasHoy(res.data.rutinas_hoy || 0);
    } catch (err) {}
  };

  const verRutina = async (id) => {
    try {
      const res = await api.get(`/rutinas/${id}`);
      setEjercicios(res.data.ejercicios);
      setRutinaSeleccionada(res.data.rutina);
    } catch (err) {
      console.error('Error al ver rutina');
    }
  };

  const puedeCrearRutina = async () => {
    try {
      const res = await api.get('/usuarios/suscripcion');
      const esPremium = res.data.suscripcion?.estado === 'activo';
      if (!esPremium && rutinasHoy >= 3) {
        alert('⚠️ Límite alcanzado: 3 rutinas gratis por día. ¡Hazte PREMIUM para crear ilimitadas!');
        return false;
      }
      return true;
    } catch (err) {
      return true;
    }
  };

  const generarRutina = async () => {
    if (!(await puedeCrearRutina())) return;
    try {
      await api.post('/generador/rutina', {
        grupo_muscular: grupoMuscular,
        entorno: entorno,
        nivel: nivel,
        objetivo: objetivo  // <-- CORREGIDO: ahora usa el estado objetivo
      });
      alert('✅ Rutina generada con éxito!');
      setMostrarGenerador(false);
      cargarRutinas();
      cargarLimite();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (err.response?.status === 403 || err.response?.data?.limite) {
        alert(msg || '⚠️ Límite de rutinas gratis alcanzado.');
      } else {
        alert('Error al generar rutina');
      }
    }
  };

  const iniciarEntrenamiento = async (rutinaId) => {
    try {
      const res = await api.get(`/rutinas/${rutinaId}`);
      setRutinaActiva(res.data.rutina);
      setEjercicios(res.data.ejercicios);
      setEntrenando(true);
    } catch (err) {
      alert('Error al cargar la rutina');
    }
  };

  if (entrenando && rutinaActiva) {
    return (
      <EntrenamientoActivo
        rutinaId={rutinaActiva.id}
        ejercicios={ejercicios}
        modo={modo}
        onFinalizar={() => {
          setEntrenando(false);
          setRutinaActiva(null);
          setEjercicios([]);
          alert('🎉 Entrenamiento finalizado!');
        }}
      />
    );
  }

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)', color: 'white' }}>
        <h3>🤖 Generador Automático</h3>
        <p>Selecciona tus preferencias y genera una rutina personalizada</p>
        <p style={{ fontSize: 12, opacity: 0.8 }}>Rutinas hoy: {rutinasHoy}/3</p>
        <button onClick={() => setMostrarGenerador(!mostrarGenerador)} className="btn btn-warning" style={{ background: 'white', color: '#FF9800' }}>
          ⚡ {mostrarGenerador ? 'Cancelar' : 'Generar Rutina'}
        </button>
      </div>

      {mostrarGenerador && (
        <div className="card">
          <select value={entorno} onChange={(e) => setEntorno(e.target.value)} className="input">
            <option value="casa">🏠 Casa</option>
            <option value="gimnasio">🏋️ Gimnasio</option>
          </select>
          <select value={grupoMuscular} onChange={(e) => setGrupoMuscular(e.target.value)} className="input">
            <option value="pecho">Pecho</option>
            <option value="espalda">Espalda</option>
            <option value="cuadriceps">Cuádriceps</option>
            <option value="femorales">Femorales</option>
            <option value="gluteos">Glúteos</option>
            <option value="pantorrillas">Pantorrillas</option>
            <option value="hombros">Hombros</option>
            <option value="biceps">Bíceps</option>
            <option value="triceps">Tríceps</option>
            <option value="core">Core</option>
            <option value="cardio">Cardio</option>
          </select>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="input">
            <option value="principiante">Principiante</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
          <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="input">
            <option value="hipertrofia">🏋️ Hipertrofia (3x10)</option>
            <option value="fuerza">💪 Fuerza (4x6)</option>
            <option value="resistencia">🏃 Resistencia (2x18)</option>
          </select>
          <select value={modo} onChange={(e) => setModo(e.target.value)} className="input">
            <option value="normal">Normal (series por ejercicio)</option>
            <option value="circuito">Circuito (una serie de cada, repetir)</option>
          </select>
          <button onClick={generarRutina} className="btn btn-success" style={{ width: '100%', marginTop: 8 }}>
            🎯 Generar Rutina
          </button>
        </div>
      )}

      <h3 style={{ marginBottom: 12 }}>📋 Mis Rutinas</h3>
      {rutinas.length === 0 && <p style={{ color: '#888' }}>No tienes rutinas aún. ¡Genera una!</p>}
      {rutinas.map((r) => (
        <div key={r.id} className="card" style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4>{r.nombre}</h4>
              <p style={{ color: '#888', fontSize: 14 }}>{r.descripcion}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span className="badge badge-blue">{r.entorno_requerido}</span>
                <span className="badge badge-green">{r.nivel_dificultad}</span>
                <span className="badge badge-orange">{r.duracion_estimada_min}min</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={(e) => { e.stopPropagation(); verRutina(r.id); }} className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
                👁️ Ver
              </button>
              <button onClick={(e) => { e.stopPropagation(); iniciarEntrenamiento(r.id); }} className="btn btn-success" style={{ fontSize: 12, padding: '6px 12px' }}>
                ▶️ Iniciar
              </button>
            </div>
          </div>
        </div>
      ))}

      {ejercicios.length > 0 && !entrenando && (
        <div className="modal" onClick={() => { setEjercicios([]); setRutinaSeleccionada(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{rutinaSeleccionada?.nombre || 'Rutina'}</h3>
            <p style={{ color: '#888', marginBottom: 16 }}>
              {rutinaSeleccionada?.duracion_estimada_min} min | {rutinaSeleccionada?.nivel_dificultad}
            </p>
            {ejercicios.map((ej, i) => {
              const icono = ejercicioIconos[ej.grupo_muscular_principal] || '🏋️';
              return (
                <div key={i} className="card" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 36 }}>{icono}</span>
                    <div style={{ flex: 1 }}>
                      <h4>{i+1}. {ej.ejercicio_nombre}</h4>
                      <p style={{ color: '#666' }}>{ej.descripcion_corta}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <span className="badge badge-blue">
                          {ej.series_planificadas} x {ej.repeticiones_planificadas || ej.duracion_segundos + 's'}
                        </span>
                        <span className="badge badge-green">{ej.grupo_muscular_principal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <button onClick={() => { setEjercicios([]); setRutinaSeleccionada(null); }} className="btn btn-danger" style={{ width: '100%', marginTop: 8 }}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rutinas;