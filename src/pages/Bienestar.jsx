import { useState, useEffect } from 'react';
import api from '../services/api';

function Bienestar() {
  const [sueno, setSueno] = useState([]);
  const [resumenSueno, setResumenSueno] = useState(null);
  const [hidratacion, setHidratacion] = useState(null);
  const [mostrarSueno, setMostrarSueno] = useState(false);
  const [mostrarAgua, setMostrarAgua] = useState(false);
  const [formSueno, setFormSueno] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora_acostarse: '23:00',
    hora_despertarse: '07:00',
    calidad: 4,
    interrupciones: 0,
    notas: ''
  });
  const [cantidadAgua, setCantidadAgua] = useState(250);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resSueno, resResumen, resAgua] = await Promise.all([
        api.get('/bienestar/sueno?limite=7'),
        api.get('/bienestar/sueno/resumen'),
        api.get('/bienestar/hidratacion')
      ]);
      setSueno(resSueno.data.registros);
      setResumenSueno(resResumen.data);
      setHidratacion(resAgua.data);
    } catch (err) {
      console.error('Error al cargar datos');
    }
  };

  const guardarSueno = async () => {
    try {
      await api.post('/bienestar/sueno', formSueno);
      alert('Sueño registrado!');
      setMostrarSueno(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const registrarAgua = async () => {
    try {
      await api.post('/bienestar/hidratacion', { cantidad_ml: cantidadAgua, tipo_bebida: 'agua' });
      alert('Agua registrada!');
      setMostrarAgua(false);
      cargarDatos();
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>😴💧 Bienestar</h2>

      {/* SUEÑO */}
      <div style={{ background: '#e3f2fd', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>😴 Sueño</h3>
        {resumenSueno && (
          <div style={{ display: 'flex', gap: 20, marginBottom: 15 }}>
            <div style={{ textAlign: 'center' }}>
              <h2>{resumenSueno.promedio_horas}h</h2>
              <small>Promedio 7 días</small>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2>{resumenSueno.promedio_calidad}/5</h2>
              <small>Calidad</small>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2>{resumenSueno.racha_dias_7h}🔥</h2>
              <small>Racha +7h</small>
            </div>
          </div>
        )}
        {resumenSueno?.consejo_del_dia && (
          <p style={{ background: '#fff', padding: 10, borderRadius: 5, fontStyle: 'italic' }}>💡 {resumenSueno.consejo_del_dia}</p>
        )}
        <button onClick={() => setMostrarSueno(!mostrarSueno)} style={{ padding: 10, background: '#607D8B', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          + Registrar sueño
        </button>
        {mostrarSueno && (
          <div style={{ background: 'white', padding: 15, borderRadius: 5, marginTop: 10 }}>
            <input type="date" value={formSueno.fecha} onChange={(e) => setFormSueno({...formSueno, fecha: e.target.value})} style={{ width: '100%', padding: 8, marginBottom: 5 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label>Dormir</label>
                <input type="time" value={formSueno.hora_acostarse} onChange={(e) => setFormSueno({...formSueno, hora_acostarse: e.target.value})} style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Despertar</label>
                <input type="time" value={formSueno.hora_despertarse} onChange={(e) => setFormSueno({...formSueno, hora_despertarse: e.target.value})} style={{ width: '100%', padding: 8 }} />
              </div>
            </div>
            <div style={{ marginTop: 5 }}>
              <label>Calidad (1-5): </label>
              <input type="number" min="1" max="5" value={formSueno.calidad} onChange={(e) => setFormSueno({...formSueno, calidad: parseInt(e.target.value)})} style={{ padding: 8, width: 60 }} />
            </div>
            <button onClick={guardarSueno} style={{ marginTop: 10, padding: 10, background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', width: '100%' }}>💾 Guardar</button>
          </div>
        )}
      </div>

      {/* HIDRATACIÓN */}
      <div style={{ background: '#e0f7fa', padding: 20, borderRadius: 10, marginBottom: 20 }}>
        <h3>💧 Hidratación</h3>
        {hidratacion && (
          <div style={{ textAlign: 'center', marginBottom: 15 }}>
            <h1 style={{ color: '#00BCD4' }}>{hidratacion.total_ml} ml</h1>
            <p>de {hidratacion.recomendacion_ml} ml ({hidratacion.porcentaje_cubierto}%)</p>
            <div style={{ background: '#ddd', height: 20, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ background: '#00BCD4', height: '100%', width: `${hidratacion.porcentaje_cubierto}%` }}></div>
            </div>
            <p>{hidratacion.vasos_250ml} vasos de 250ml</p>
          </div>
        )}
        <button onClick={() => setMostrarAgua(!mostrarAgua)} style={{ padding: 10, background: '#00BCD4', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          + Agregar agua
        </button>
        {mostrarAgua && (
          <div style={{ background: 'white', padding: 15, borderRadius: 5, marginTop: 10 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              {[250, 500, 750, 1000].map((ml) => (
                <button key={ml} onClick={() => setCantidadAgua(ml)} style={{ padding: 10, background: cantidadAgua === ml ? '#00BCD4' : '#ddd', color: cantidadAgua === ml ? 'white' : 'black', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
                  {ml}ml
                </button>
              ))}
            </div>
            <button onClick={registrarAgua} style={{ padding: 10, background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', width: '100%' }}>
              💧 Registrar {cantidadAgua}ml
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bienestar;