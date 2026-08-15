import { useState } from 'react';
import api from '../services/api';
import env from '../config/env';
import useSuscripcion from '../hooks/useSuscripcion';
import usePlayBilling from '../hooks/usePlayBilling';
import SeleccionarPlan from './SeleccionarPlan';
import { PLAN_MENSUAL, PLAN_ANUAL } from '../constants/suscripciones';
import { openUrl, showAlert, showPrompt } from '../services/platform';

function PremiumBanner() {
  const { suscripcion } = useSuscripcion();
  const { disponible } = usePlayBilling();
  const [mostrarPlanes, setMostrarPlanes] = useState(false);

  const solicitarPlan = async (plan) => {
    const telefono = showPrompt('Tu WhatsApp para contactarte (ej: 51987654321):');
    if (!telefono) return;

    await api.post('/usuarios/suscripcion/solicitar', { plan, whatsapp: telefono });
    showAlert('✅ Solicitud enviada. Te escribiremos por WhatsApp para coordinar el pago.');
    openUrl(`https://wa.me/${env.whatsappContact}?text=Hola! Quiero el plan ${plan} de VitaPlena. Mi WhatsApp: ${telefono}`);
  };

  const elegirPlan = (plan) => {
    if (disponible) {
      setMostrarPlanes(true);
    } else {
      solicitarPlan(plan);
    }
  };

  if (!suscripcion) return null;
  if (suscripcion.estado === 'activo' && suscripcion.plan !== 'gratis') return null;

  return (
    <>
      {mostrarPlanes && <SeleccionarPlan onCerrar={() => setMostrarPlanes(false)} />}
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
            <button onClick={() => elegirPlan(PLAN_MENSUAL)} className="btn btn-warning" style={{ margin: 5 }}>
              Renovar S/ 5.99
            </button>
          </div>
        ) : (
          <div>
            <p>🚀 Desbloquea gráficos, recetas y más desde S/ 3.99 al mes</p>
            <button onClick={() => elegirPlan(PLAN_MENSUAL)} className="btn btn-warning" style={{ margin: 5 }}>
              S/ 3.99 Fundador
            </button>
            <button onClick={() => elegirPlan(PLAN_ANUAL)} className="btn btn-warning" style={{ margin: 5 }}>
              S/ 5.99 Premium
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default PremiumBanner;
