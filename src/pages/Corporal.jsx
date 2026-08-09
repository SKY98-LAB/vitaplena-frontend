import { useState, useEffect } from 'react';
import api from '../services/api';
import GraficosProgreso from '../components/GraficosProgreso';
import { showAlert } from '../services/platform';
import useResumenHoy from '../hooks/useResumenHoy';
import FormularioCorporal from '../modules/corporal/components/FormularioCorporal';
import HistorialCorporal from '../modules/corporal/components/HistorialCorporal';

function Corporal() {
  const { datos, recargar } = useResumenHoy(['corporal']);
  const [registros, setRegistros] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const resumen = datos?.corporal;
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
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const res = await api.get('/registros/corporal?limite=10');
      setRegistros(res.data.registros);
    } catch (err) {
      console.error('Error al cargar datos corporales');
    }
  };

  const guardarRegistro = async () => {
    if (!form.peso_kg) return showAlert('El peso es obligatorio');
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
      showAlert('Registro guardado!');
      setMostrarForm(false);
      cargarRegistros();
      recargar();
    } catch (err) {
      showAlert('Error al guardar');
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
      {mostrarForm && <FormularioCorporal form={form} setForm={setForm} onGuardar={guardarRegistro} />}

      {/* Historial */}
      <HistorialCorporal registros={registros} />
    </div>
  );
}

export default Corporal;