import PremiumBanner from '../components/PremiumBanner';
import useResumenHoy from '../hooks/useResumenHoy';

function Dashboard({ usuario, onNavigate }) {
  const { datos } = useResumenHoy();

  const resumen = datos ? {
    calorias: datos.comidas?.totales?.calorias || 0,
    proteinas: datos.comidas?.totales?.proteinas || 0,
    imc: datos.corporal?.ultimo_registro?.imc
      || (usuario?.peso_kg && usuario?.altura_cm
          ? Number(usuario.peso_kg / Math.pow(Number(usuario.altura_cm) / 100, 2)).toFixed(1)
          : '--'),
    clasificacion: datos.corporal?.clasificacion_imc || '',
    peso: datos.corporal?.ultimo_registro?.peso_kg || usuario?.peso_kg || '--',
    sueno: datos.sueno?.promedio_horas || '--',
    calidad: datos.sueno?.promedio_calidad || '--',
    agua: datos.hidratacion?.total_ml || 0,
    aguaMeta: datos.hidratacion?.recomendacion_ml || 2500,
    aguaPct: datos.hidratacion?.porcentaje_cubierto || 0,
    consejo: datos.sueno?.consejo_del_dia || ''
  } : null;

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
