import { useEffect, useState, useCallback } from 'react';
import {
  billingDisponible,
  conectar,
  obtenerProductos,
  comprar as comprarEnPlay,
  restaurarCompras,
  suscribirseActualizacion,
  verificarCompraEnBackend,
  compraPagada,
  mensajeDeError,
} from '../services/playBilling';
import { emitRefrescoSuscripcion } from '../services/suscripcionBus';
import { PLAY_PRODUCT_IDS } from '../constants/playPlans';

function usePlayBilling() {
  const [disponible, setDisponible] = useState(false);
  const [conectado, setConectado] = useState(false);
  const [productos, setProductos] = useState([]);
  const [comprando, setComprando] = useState(false);
  const [error, setError] = useState(null);

  const verificarYActualizar = useCallback(async (compra) => {
    try {
      await verificarCompraEnBackend({
        productId: compra.productId,
        basePlanId: compra.basePlanId,
        purchaseToken: compra.purchaseToken,
        orderId: compra.orderId,
      });
      emitRefrescoSuscripcion();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: mensajeDeError(e) };
    }
  }, []);

  useEffect(() => {
    if (!billingDisponible()) {
      setDisponible(false);
      return undefined;
    }
    setDisponible(true);
    let activo = true;

    const limpiarListener = suscribirseActualizacion(async (evento) => {
      if (!activo) return;
      if (evento.error) {
        setError(evento.error);
        return;
      }
      if (compraPagada(evento)) {
        setError(null);
        const res = await verificarYActualizar(evento);
        if (!res.ok) setError(res.error);
      }
    });

    conectar()
      .then(async () => {
        if (!activo) return;
        setConectado(true);
        const lista = await obtenerProductos(PLAY_PRODUCT_IDS);
        if (activo) setProductos(lista);
      })
      .catch((e) => {
        if (activo) setError(mensajeDeError(e));
      });

    return () => {
      activo = false;
      limpiarListener();
    };
  }, [verificarYActualizar]);

  const comprar = useCallback(
    async (productId, basePlanId) => {
      setComprando(true);
      setError(null);
      try {
        const compra = await comprarEnPlay(productId, basePlanId);
        if (compraPagada(compra)) {
          const res = await verificarYActualizar(compra);
          if (!res.ok) setError(res.error);
        }
        return { ok: true };
      } catch (e) {
        setError(mensajeDeError(e));
        return { ok: false, error: mensajeDeError(e) };
      } finally {
        setComprando(false);
      }
    },
    [verificarYActualizar]
  );

  const restaurar = useCallback(async () => {
    setError(null);
    try {
      const compras = await restaurarCompras();
      for (const compra of compras) {
        if (compraPagada(compra)) {
          const res = await verificarYActualizar(compra);
          if (!res.ok) setError(res.error);
        }
      }
      return { ok: true };
    } catch (e) {
      setError(mensajeDeError(e));
      return { ok: false, error: mensajeDeError(e) };
    }
  }, [verificarYActualizar]);

  return { disponible, conectado, productos, comprando, error, comprar, restaurar };
}

export default usePlayBilling;
