import { useState, useEffect } from 'react';
import api from '../services/api';
import { ICONOS_GRUPO_MUSCULAR, GRUPOS_FILTRO_EJERCICIOS } from '../constants/gruposMusculares';

const posturaIconos = { ...ICONOS_GRUPO_MUSCULAR, cardio: '🏃' };

const posturaDescripcion = {
  sentadilla: 'Pies al ancho de hombros. Baja como si te sentaras. Espalda recta. Rodillas no sobrepasan los pies.',
  flexiones: 'Manos al ancho de hombros. Codos a 45°. Baja el pecho al suelo. Cuerpo recto como una tabla.',
  plancha: 'Antebrazos en el suelo. Codos bajo los hombros. Cuerpo recto. Abdomen contraído. Aguanta.',
  zancadas: 'Paso adelante. Rodilla delantera a 90°. Rodilla trasera casi toca el suelo. Torso erguido.',
  jumping: 'De pie, brazos a los lados. Salta abriendo piernas y subiendo brazos. Vuelve a posición inicial.',
  press_banca: 'Acostado en banca. Barra sobre el pecho. Empuja hacia arriba. Baja controlado.',
  peso_muerto: 'Barra en el suelo. Espalda recta. Flexiona rodillas. Levanta con la fuerza de piernas.',
  default: 'Mantén una postura correcta. Respira al hacer el movimiento. No hagas movimientos bruscos.'
};

function Ejercicios() {
  const [ejercicios, setEjercicios] = useState([]);
  const [entorno, setEntorno] = useState('casa');
  const [grupo, setGrupo] = useState('');
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null);

  useEffect(() => { cargarEjercicios(); }, [entorno, grupo]);

  const cargarEjercicios = async () => {
    try {
      let url = `/ejercicios?entorno=${entorno}`;
      if (grupo) url += `&grupo=${grupo}`;
      const res = await api.get(url);
      setEjercicios(res.data.ejercicios);
    } catch (err) {
      console.error('Error al cargar ejercicios');
    }
  };

  const getPostura = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes('sentadilla')) return posturaDescripcion.sentadilla;
    if (n.includes('flexión') || n.includes('flexion')) return posturaDescripcion.flexiones;
    if (n.includes('plancha')) return posturaDescripcion.plancha;
    if (n.includes('zancada') || n.includes('lunge')) return posturaDescripcion.zancadas;
    if (n.includes('jumping') || n.includes('jack')) return posturaDescripcion.jumping;
    if (n.includes('press') && n.includes('banca')) return posturaDescripcion.press_banca;
    if (n.includes('peso muerto')) return posturaDescripcion.peso_muerto;
    return posturaDescripcion.default;
  };

  return (
    <div>
      <div className="card">
        <h3>🏋️ Ejercicios</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select value={entorno} onChange={(e) => setEntorno(e.target.value)} className="input" style={{ flex: 1, minWidth: 150 }}>
            <option value="casa">🏠 Casa</option>
            <option value="gimnasio">🏋️ Gimnasio</option>
            <option value="todos">🌍 Todos</option>
          </select>
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="input" style={{ flex: 1, minWidth: 150 }}>
            <option value="">Todos los grupos</option>
            {GRUPOS_FILTRO_EJERCICIOS.map((g) => (
              <option key={g.valor} value={g.valor}>
                {g.valor === 'flexibilidad' ? '🧘' : g.icono} {g.etiqueta}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="exercise-grid">
        {ejercicios.map((ej) => {
          const icono = posturaIconos[ej.grupo_muscular_principal] || '🏋️';
          return (
            <div key={ej.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setEjercicioSeleccionado(ej)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 40 }}>{icono}</span>
                <div style={{ flex: 1 }}>
                  <h4>{ej.nombre}</h4>
                  <span className={`muscle muscle-${ej.grupo_muscular_principal}`}>
                    {ej.grupo_muscular_principal}
                  </span>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className="badge badge-blue">{ej.nivel_dificultad}</span>
                    <span className="badge badge-green">{ej.entorno}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {ejercicioSeleccionado && (
        <div className="modal" onClick={() => setEjercicioSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', fontSize: 60, marginBottom: 10 }}>
              {posturaIconos[ejercicioSeleccionado.grupo_muscular_principal] || '🏋️'}
            </div>
            <h2>{ejercicioSeleccionado.nombre}</h2>
            <span className={`muscle muscle-${ejercicioSeleccionado.grupo_muscular_principal}`}>
              {ejercicioSeleccionado.grupo_muscular_principal}
            </span>
            
            <p style={{ marginTop: 12 }}>{ejercicioSeleccionado.descripcion_corta}</p>
            
            <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 12, marginTop: 12 }}>
              <h4>📐 ¿Cómo se hace?</h4>
              <p>{getPostura(ejercicioSeleccionado.nombre)}</p>
            </div>

            {ejercicioSeleccionado.advertencia_lesion && (
              <div style={{ background: '#fff3e0', padding: 12, borderRadius: 8, marginTop: 8 }}>
                ⚠️ {ejercicioSeleccionado.advertencia_lesion}
              </div>
            )}
            {ejercicioSeleccionado.version_facilitada && (
              <div style={{ background: '#e8f5e9', padding: 12, borderRadius: 8, marginTop: 8 }}>
                💡 Versión fácil: {ejercicioSeleccionado.version_facilitada}
              </div>
            )}
            {ejercicioSeleccionado.version_avanzada && (
              <div style={{ background: '#fce4ec', padding: 12, borderRadius: 8, marginTop: 8 }}>
                🔥 Versión avanzada: {ejercicioSeleccionado.version_avanzada}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <span className="badge badge-blue">{ejercicioSeleccionado.nivel_dificultad}</span>
              <span className="badge badge-green">{ejercicioSeleccionado.entorno}</span>
              {ejercicioSeleccionado.met_value && (
                <span className="badge badge-orange">MET: {ejercicioSeleccionado.met_value}</span>
              )}
            </div>

            <button
              onClick={() => setEjercicioSeleccionado(null)}
              className="btn btn-danger"
              style={{ width: '100%', marginTop: 15 }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ejercicios;