import { useState } from 'react';
import api from '../services/api';
import { showAlert } from '../services/platform';
import useResumenHoy from '../hooks/useResumenHoy';
import ComidaCard from '../modules/alimentacion/components/ComidaCard';
import FormularioComida from '../modules/alimentacion/components/FormularioComida';

function Alimentacion() {
  const { datos, recargar } = useResumenHoy(['comidas']);
  const [alimentos, setAlimentos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [alimentoSeleccionado, setAlimentoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(100);
  const [tipoComida, setTipoComida] = useState('almuerzo');
  const comidas = datos?.comidas?.comidas ?? [];
  const totales = datos?.comidas?.totales ?? {};

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
      showAlert('✅ Comida registrada!');
      setMostrarRegistro(false);
      setAlimentoSeleccionado(null);
      setCantidad(100);
      recargar();
    } catch (err) {
      showAlert('Error al registrar comida');
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
        <FormularioComida
          alimento={alimentoSeleccionado}
          cantidad={cantidad}
          onCantidad={setCantidad}
          tipoComida={tipoComida}
          onTipoComida={setTipoComida}
          onRegistrar={registrarComida}
          onCerrar={() => setMostrarRegistro(false)}
        />
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
      {comidas.map((c) => (
        <ComidaCard key={c.id} comida={c} />
      ))}
    </div>
  );
}

export default Alimentacion;