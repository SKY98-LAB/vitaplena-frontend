import { useState, useEffect } from 'react';
import api from '../services/api';

function PremiumBanner() {
  const [suscripcion, setSuscripcion] = useState(null);

  useEffect(() => {
    api.get('/usuarios/suscripcion').then(res => {
      setSuscripcion(res.data.suscripcion);
    });
  }, []);

  const solicitarPlan = async (plan) => {
    const telefono = prompt('Tu WhatsApp para contactarte (ej: 51987654321):');
    if (!telefono) return;
    
    await api.post('/usuarios/suscripcion/solicitar', { plan, whatsapp: telefono });
    alert('✅ Solicitud enviada. Te escribiremos por WhatsApp para coordinar el pago.');
    window.open(`https://wa.me/51929932906?text=Hola! Quiero el plan ${plan} de VitaPlena. Mi WhatsApp: ${telefono}`, '_blank');
  };

  if (!suscripcion || suscripcion.estado === 'activo') return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF9800, #F57C00)',
      color: 'white', padding: 15, borderRadius: 12, marginBottom: 16,
      textAlign: 'center'
    }}>
      {suscripcion.estado === 'pendiente' ? (
        <p>⏳ Tu solicitud está en revisión. Te contactaremos pronto.</p>
      ) : suscripcion.estado === 'vencido' ? (
        <div>
          <p>⚠️ Tu suscripción venció. Renueva para seguir disfrutando.</p>
          <button onClick={() => solicitarPlan('mensual')} className="btn btn-warning" style={{ margin: 5 }}>
            Renovar S/ 5/mes
          </button>
        </div>
      ) : (
        <div>
          <p>🚀 Desbloquea gráficos, recetas y más por S/ 5 al mes</p>
          <button onClick={() => solicitarPlan('mensual')} className="btn btn-warning" style={{ margin: 5 }}>
            S/ 5 mensual
          </button>
          <button onClick={() => solicitarPlan('anual')} className="btn btn-warning" style={{ margin: 5 }}>
            S/ 40 anual
          </button>
        </div>
      )}
    </div>
  );
}

export default PremiumBanner;