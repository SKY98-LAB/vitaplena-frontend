import api from '../services/api';
import env from '../config/env';
import useSuscripcion from '../hooks/useSuscripcion';
import { PLAN_MENSUAL, PLAN_ANUAL } from '../constants/suscripciones';
import { openUrl, showAlert, showPrompt } from '../services/platform';

function PremiumBanner() {
  const { suscripcion } = useSuscripcion();

  const solicitarPlan = async (plan) => {
    const telefono = showPrompt('Tu WhatsApp para contactarte (ej: 51987654321):');
    if (!telefono) return;
    
    await api.post('/usuarios/suscripcion/solicitar', { plan, whatsapp: telefono });
    showAlert('✅ Solicitud enviada. Te escribiremos por WhatsApp para coordinar el pago.');
    openUrl(`https://wa.me/${env.whatsappContact}?text=Hola! Quiero el plan ${plan} de VitaPlena. Mi WhatsApp: ${telefono}`);
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
          <button onClick={() => solicitarPlan(PLAN_MENSUAL)} className="btn btn-warning" style={{ margin: 5 }}>
            Renovar S/ 5/mes
          </button>
        </div>
      ) : (
        <div>
          <p>🚀 Desbloquea gráficos, recetas y más por S/ 5 al mes</p>
          <button onClick={() => solicitarPlan(PLAN_MENSUAL)} className="btn btn-warning" style={{ margin: 5 }}>
            S/ 5 mensual
          </button>
          <button onClick={() => solicitarPlan(PLAN_ANUAL)} className="btn btn-warning" style={{ margin: 5 }}>
            S/ 40 anual
          </button>
        </div>
      )}
    </div>
  );
}

export default PremiumBanner;
