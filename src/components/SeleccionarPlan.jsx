import { useState } from 'react';
import usePlayBilling from '../hooks/usePlayBilling';
import { PLAY_CATALOGO } from '../constants/playPlans';

function SeleccionarPlan({ onCerrar }) {
  const { conectado, productos, comprando, error, comprar, restaurar } = usePlayBilling();
  const [exito, setExito] = useState(null);

  const manejarCompra = async (producto) => {
    setExito(null);
    const res = await comprar(producto.productId, producto.basePlanId);
    if (res.ok) setExito('✅ Compra procesada. Tu suscripción PREMIUM ya está activa.');
  };

  const manejarRestaurar = async () => {
    setExito(null);
    const res = await restaurar();
    if (res.ok) setExito('✅ Compras restauradas correctamente.');
  };

  const precioDe = (producto) => {
    const dePlay = (productos || []).find(
      (p) => p.productId === producto.productId
    );
    if (dePlay?.price) return dePlay.price;
    return producto.precio;
  };

  return (
    <div className="modal" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>🚀 Desbloquea VitaPlena PREMIUM</h3>
        <p style={{ color: '#888', marginBottom: 16 }}>
          Acceso completo: rutinas ilimitadas, gráficos y más.
        </p>

        {!conectado && !error && (
          <p style={{ color: '#666', textAlign: 'center' }}>Conectando con Google Play...</p>
        )}

        {PLAY_CATALOGO.map((producto) => (
          <div
            key={producto.productId + producto.basePlanId}
            className="card"
            style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <h4>{producto.nombre}</h4>
              <p style={{ color: '#666' }}>{producto.descripcion}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ color: '#F57C00' }}>{precioDe(producto)}</h4>
              <button
                onClick={() => manejarCompra(producto)}
                disabled={comprando || !conectado}
                className="btn btn-warning"
              >
                {comprando ? 'Procesando...' : 'Comprar'}
              </button>
            </div>
          </div>
        ))}

        {error && (
          <p style={{ background: '#fdecea', color: '#c62828', padding: 10, borderRadius: 8, marginTop: 8, fontSize: 14 }}>
            ⚠️ {error}
          </p>
        )}

        {exito && (
          <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: 10, borderRadius: 8, marginTop: 8, fontSize: 14 }}>
            {exito}
          </p>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={manejarRestaurar} disabled={comprando} className="btn" style={{ flex: 1 }}>
            Restaurar compras
          </button>
          <button onClick={onCerrar} className="btn btn-danger" style={{ flex: 1 }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeleccionarPlan;
