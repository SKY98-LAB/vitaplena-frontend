import { useState, useEffect } from 'react';
import api from '../services/api';
import GraficosProgreso from '../components/GraficosProgreso';

function Corporal() {
  const [registros, setRegistros] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso_kg: '',
    cintura_cm: '',
    cadera_cm: '',
    pecho_cm: '',
    brazo_cm: '',
    muslo_cm: '',
    notas: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resRegistros, resResumen] = await Promise.all([
        api.get('/registros/corporal?limite=10'),
        api.get('/registros/corporal/resumen')
      ]);
      setRegistros(resRegistros.data.registros);
      setResumen(resResumen.data);
    } catch (err) {
      console.error('Error al cargar datos corporales');
    }
  };

  const guardarRegistro = async () => {
    if (!form.peso_kg) return alert('El peso es obligatorio');
    try {
      await api.post('/registros/corporal', {
        fecha: form.fecha,
        peso_kg: parseFloat(form.peso_kg),
        cintura_cm: form.cintura_cm ? parseFloat(form.cintura_cm) : null,
        cadera_cm: form.cadera_cm ? parseFloat(form.cadera_cm) : null,
        pecho_cm: form.pecho_cm ? parseFloat(form.pecho_cm) : null,
        brazo_cm: form.brazo_cm ? parseFloat(form.brazo_cm) : null,
        muslo_cm: form.muslo_cm ? parseFloat(form.muslo_cm) : null,
        notas: form.notas
      });
      alert('Registro guardado!');
      setMostrarForm(false);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const pesoMin = registros.length > 0 ? Math.min(...registros.map(r => parseFloat(r.peso_kg))) - 2 : 0;
  const pesoMax = registros.length > 0 ? Math.max(...registros.map(r => parseFloat(r.peso_kg))) + 2 : 100;

  return (
    <div>
      <h2>📏 Registro Corporal</h2>

      {/* Resumen con IMC */}
      {resumen && (
        <div className="card" style={{ background: '#e8eaf6', textAlign: 'center' }}>
          <h3>📊 Tu resumen</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
            <div>
              <h1 style={{ color: '#4CAF50' }}>{resumen.imc || '--'}</h1>
              <p>IMC</p>
              <small>{resumen.clasificacion_imc || ''}</small>
            </div>
            <div>
              <h1 style={{ color: '#2196F3' }}>{resumen.ultimo_registro?.peso_kg || '--'} kg</h1>
              <p>Peso actual</p>
            </div>
            <div>
              <h1 style={{ color: '#FF9800' }}>{resumen.altura_cm || '--'} cm</h1>
              <p>Altura</p>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos de progreso con Chart.js */}
      <GraficosProgreso />

      {/* Gráfico simple de barras de peso */}
      {registros.length >= 2 && (
        <div className="card">
          <h3>📈 Evolución de Peso</h3>
          <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 150, padding: '10px 0' }}>
            {[...registros].reverse().map((r, i) => {
              const altura = ((parseFloat(r.peso_kg) - pesoMin) / (pesoMax - pesoMin)) * 100;
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: `${altura}%`,
                    background: 'linear-gradient(to top, #2196F3, #64B5F6)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: 20,
                    transition: 'height 0.5s'
                  }}></div>
                  <small style={{ fontSize: 10 }}>{new Date(r.fecha).toLocaleDateString('es', {day:'numeric', month:'short'})}</small>
                  <br/>
                  <small style={{ fontWeight: 'bold' }}>{r.peso_kg}</small>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón nuevo registro */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="btn btn-success"
        style={{ marginBottom: 20, fontSize: 16 }}
      >
        {mostrarForm ? 'Cancelar' : '+ Nuevo Registro'}
      </button>

      {/* Formulario */}
      {mostrarForm && (
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label>Fecha</label>
              <input type="date" value={form.fecha} onChange={(e) => setForm({...form, fecha: e.target.value})} className="input" />
            </div>
            <div>
              <label>Peso (kg) *</label>
              <input type="number" step="0.1" placeholder="Ej: 70.5" value={form.peso_kg} onChange={(e) => setForm({...form, peso_kg: e.target.value})} className="input" />
            </div>
            <div>
              <label>Cintura (cm)</label>
              <input type="number" step="0.1" value={form.cintura_cm} onChange={(e) => setForm({...form, cintura_cm: e.target.value})} className="input" />
            </div>
            <div>
              <label>Cadera (cm)</label>
              <input type="number" step="0.1" value={form.cadera_cm} onChange={(e) => setForm({...form, cadera_cm: e.target.value})} className="input" />
            </div>
            <div>
              <label>Pecho (cm)</label>
              <input type="number" step="0.1" value={form.pecho_cm} onChange={(e) => setForm({...form, pecho_cm: e.target.value})} className="input" />
            </div>
            <div>
              <label>Brazo (cm)</label>
              <input type="number" step="0.1" value={form.brazo_cm} onChange={(e) => setForm({...form, brazo_cm: e.target.value})} className="input" />
            </div>
            <div>
              <label>Muslo (cm)</label>
              <input type="number" step="0.1" value={form.muslo_cm} onChange={(e) => setForm({...form, muslo_cm: e.target.value})} className="input" />
            </div>
            <div>
              <label>Notas</label>
              <input type="text" placeholder="Ej: En ayunas" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} className="input" />
            </div>
          </div>
          <button onClick={guardarRegistro} className="btn btn-primary" style={{ marginTop: 15, width: '100%', fontSize: 16 }}>
            💾 Guardar Registro
          </button>
        </div>
      )}

      {/* Historial */}
      <h3>📋 Historial</h3>
      {registros.map((r) => (
        <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{new Date(r.fecha).toLocaleDateString()}</strong>
            <p>⚖️ {r.peso_kg} kg {r.cintura_cm && `| 📏 Cintura: ${r.cintura_cm}cm`}</p>
            {r.notas && <small>{r.notas}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Corporal;