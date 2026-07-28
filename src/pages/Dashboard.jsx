import { useState, useEffect } from 'react';
import api from '../services/api';
import PremiumBanner from '../components/PremiumBanner';

function Dashboard({ usuario, onNavigate }) {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    cargarResumen();
  }, []);

  const cargarResumen = async () => {
    try {
      const [comidas, corporal, sueno, agua] = await Promise.all([
        api.get('/alimentacion/comidas'),
        api.get('/registros/corporal/resumen'),
        api.get('/bienestar/sueno/resumen'),
        api.get('/bienestar/hidratacion')
      ]);
      setResumen({
        calorias: comidas.data.totales?.calorias || 0,
        proteinas: comidas.data.totales?.proteinas || 0,
        imc: corporal.data.imc || '--',
        clasificacion: corporal.data.clasificacion_imc || '',
        peso: corporal.data.ultimo_registro?.peso_kg || '--',
        sueno: sueno.data.promedio_horas || '--',
        calidad: sueno.data.promedio_calidad || '--',
        agua: agua.data.total_ml || 0,
        aguaMeta: agua.data.recomendacion_ml || 2500,
        aguaPct: agua.data.porcentaje_cubierto || 0,
        consejo: sueno.data.consejo_del_dia || ''
      });
    } catch (err) {
      console.error('Error al cargar resumen');
    }
  };

  const opciones = [
    { id: 'ejercicios', icon: '🏋️', label: 'Ejercicios', color: '#2196F3', desc: '108 ejercicios' },
    { id: 'rutinas', icon: '📋', label: 'Rutinas', color: '#FF9800', desc: 'Entrena ya' },
    { id: 'alimentacion', icon: '🍎', label: 'Comidas', color: '#4CAF50', desc: '111 alimentos' },
    { id: 'corporal', icon: '📏', label: 'Cuerpo', color: '#9C27B0', desc: 'Peso e IMC' },
    { id: 'sueno', icon: '😴', label: 'Sueño', color: '#607D8B', desc: 'Descanso' },
    { id: 'sueno', icon: '💧', label: 'Agua', color: '#00BCD4', desc: 'Hidratación' },
  ];

  return (
    <div>
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>👋 {usuario?.nombre}!</h2>
        {resumen?.consejo && (
          <p style={{ background: '#e3f2fd', padding: 10, borderRadius: 8, marginTop: 8, fontSize: 14 }}>
            💡 {resumen.consejo}
          </p>
        )}
      </div>

      {/* Banner PREMIUM */}
      <PremiumBanner />

      {resumen && (
        <div className="card">
          <h3>📊 Hoy</h3>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
            <div style={miniCard}>
              <span style={{ fontSize: 24 }}>🔥</span>
              <h3>{resumen.calorias}</h3>
              <small>kcal</small>
            </div>
            <div style={miniCard}>
              <span style={{ fontSize: 24 }}>💪</span>
              <h3>{resumen.proteinas}g</h3>
              <small>proteína</small>
            </div>
            <div style={miniCard}>
              <span style={{ fontSize: 24 }}>⚖️</span>
              <h3>{resumen.peso}kg</h3>
              <small>IMC {resumen.imc}</small>
            </div>
            <div style={miniCard}>
              <span style={{ fontSize: 24 }}>😴</span>
              <h3>{resumen.sueno}h</h3>
              <small>sueño</small>
            </div>
            <div style={miniCard}>
              <span style={{ fontSize: 24 }}>💧</span>
              <h3>{resumen.agua}ml</h3>
              <div className="progress-bar" style={{ width: 60, margin: '4px auto' }}>
                <div className="progress-fill" style={{ width: `${resumen.aguaPct}%`, background: '#00BCD4' }}></div>
              </div>
              <small>{resumen.aguaPct}%</small>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {opciones.map(op => (
          <div
            key={op.id + op.label}
            className="dashboard-card"
            style={{ background: op.color }}
            onClick={() => onNavigate(op.id)}
          >
            <span className="icon">{op.icon}</span>
            {op.label}
            <br/>
            <small style={{ fontSize: 11, opacity: 0.8 }}>{op.desc}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const miniCard = {
  background: '#f5f5f5',
  padding: '10px 14px',
  borderRadius: 12,
  minWidth: 70
};

export default Dashboard; 
