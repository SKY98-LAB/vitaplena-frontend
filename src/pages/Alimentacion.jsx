import { useState, useEffect } from 'react';
import api from '../services/api';

function Alimentacion() {
  const [alimentos, setAlimentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [comidas, setComidas] = useState([]);
  const [totales, setTotales] = useState({});
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(100);
  const [tipoComida, setTipoComida] = useState('almuerzo');

  useEffect(() => { cargarComidas(); }, []);

  const cargarComidas = async () => {
    try {
      const res = await api.get('/alimentacion/comidas');
      setComidas(res.data.comidas);
      setTotales(res.data.totales);
    } catch (err) {
      console.error('Error al cargar comidas');
    }
  };

  const buscarAlimentos = async () => {
    if (!busqueda) return;
    try {
      const res = await api.get(`/alimentacion/alimentos?busqueda=${busqueda}`);
      setAlimentos(res.data.alimentos);
    } catch (err) {
      console.error('Error al buscar');
    }
  };

  const registrarComida = async () => {
    if (!alimentoSeleccionado) return;
    try {
      await api.post('/alimentacion/comidas', {
        fecha_hora: new Date().toISOString(),
        tipo_comida: tipoComida,
        alimentos: [{ alimento_id: alimentoSeleccionado.id, cantidad_gramos: cantidad }]
      });
      alert('✅ Comida registrada!');
      setMostrarRegistro(false);
      setAlimentoSeleccionado(null);
      setCantidad(100);
      cargarComidas();
    } catch (err) {
      alert('Error al registrar comida');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>🔍 Buscar alimento</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="Ej: pollo, manzana, arroz..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarAlimentos()}
            className="input"
            style={{ flex: 1 }}
          />
          <button onClick={buscarAlimentos} className="btn btn-success">Buscar</button>
        </div>
      </div>

      {alimentos.length > 0 && (
        <div className="exercise-grid" style={{ marginBottom: 20 }}>
          {alimentos.map((a) => (
            <div key={a.id} className="card">
              <h4>{a.nombre}</h4>
              <p>🔥 {a.calorias_por_100g} kcal/100g</p>
              <p style={{ fontSize: 13, color: '#666' }}>
                💪 {a.proteinas_por_100g}g | 🍞 {a.carbohidratos_por_100g}g | 🧈 {a.grasas_por_100g}g
              </p>
              <p style={{ fontSize: 13 }}>
                📏 Porción: {a.porcion_estandar_g}g ({a.unidad_porcion})
              </p>
              <button
                onClick={() => { setAlimentoSeleccionado(a); setMostrarRegistro(true); }}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
              >
                + Registrar
              </button>
            </div>
          ))}
        </div>
      )}

      {mostrarRegistro && alimentoSeleccionado && (
        <div className="modal" onClick={() => setMostrarRegistro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📝 Registrar: {alimentoSeleccionado.nombre}</h3>
            <p style={{ color: '#888' }}>{alimentoSeleccionado.calorias_por_100g} kcal por 100g</p>
            <div style={{ margin: '10px 0' }}>
              <label>Gramos:</label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="input"
                style={{ width: 120 }}
              />
              <p style={{ background: '#e8f5e9', padding: 10, borderRadius: 8, marginTop: 8 }}>
                = {((alimentoSeleccionado.calorias_por_100g * cantidad) / 100).toFixed(0)} kcal,{' '}
                {((alimentoSeleccionado.proteinas_por_100g * cantidad) / 100).toFixed(1)}g proteína
              </p>
            </div>
            <select value={tipoComida} onChange={(e) => setTipoComida(e.target.value)} className="input">
              <option value="desayuno">🌅 Desayuno</option>
              <option value="almuerzo">☀️ Almuerzo</option>
              <option value="cena">🌙 Cena</option>
              <option value="snack">🍿 Snack</option>
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={registrarComida} className="btn btn-success" style={{ flex: 1 }}>✅ Guardar</button>
              <button onClick={() => setMostrarRegistro(false)} className="btn btn-danger" style={{ flex: 1 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ background: '#e8f5e9' }}>
        <h3>📊 Resumen del día</h3>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', textAlign: 'center' }}>
          <div><h2>🔥</h2><p>{totales?.calorias || 0}</p><small>kcal</small></div>
          <div><h2>💪</h2><p>{totales?.proteinas || 0}g</p><small>proteína</small></div>
          <div><h2>🍞</h2><p>{totales?.carbohidratos || 0}g</p><small>carbs</small></div>
          <div><h2>🧈</h2><p>{totales?.grasas || 0}g</p><small>grasas</small></div>
        </div>
      </div>

      <h3>📝 Comidas de hoy</h3>
      {comidas.length === 0 && <p style={{ color: '#888' }}>No hay comidas registradas hoy.</p>}
      {comidas.map((c) => {
        const iconos = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙', snack: '🍿' };
        return (
          <div key={c.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{iconos[c.tipo_comida] || '🍽️'} {c.tipo_comida}</h4>
              <span className="badge badge-orange">{c.total_calorias} kcal</span>
            </div>
            <div style={{ display: 'flex', gap: 15, marginTop: 8 }}>
              <span>💪 {c.total_proteinas}g</span>
              <span>🍞 {c.total_carbohidratos}g</span>
              <span>🧈 {c.total_grasas}g</span>
            </div>
            <small style={{ color: '#aaa' }}>{new Date(c.fecha_hora).toLocaleTimeString()}</small>
          </div>
        );
      })}
    </div>
  );
}

export default Alimentacion;