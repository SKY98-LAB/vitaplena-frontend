import { registerPlugin } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { esNativo } from './platform';
import api from './api';

export const ESTADO_COMPRA = {
  PURCHASED: 0,
  CANCELED: 1,
  PENDING: 2,
};

const webImpl = {
  connect: async () => ({ connected: false }),
  getProducts: async () => ({ products: [] }),
  purchase: async () => ({ purchase: null }),
  acknowledge: async () => undefined,
  restorePurchases: async () => ({ purchases: [] }),
  addListener: async () => ({ remove: () => undefined }),
};

const PlayBilling = registerPlugin('PlayBilling', { web: webImpl });

export function billingDisponible() {
  return esNativo() && Capacitor.getPlatform() === 'android';
}

export function compraPagada(compra) {
  if (!compra) return false;
  return compra.state === ESTADO_COMPRA.PURCHASED || compra.state === 'PURCHASED';
}

export async function conectar() {
  return PlayBilling.connect();
}

export async function obtenerProductos(productIds) {
  const res = await PlayBilling.getProducts({ productIds });
  return res.products || [];
}

export async function comprar(productId, basePlanId) {
  const res = await PlayBilling.purchase({ productId, basePlanId });
  return res.purchase || null;
}

export async function restaurarCompras() {
  const res = await PlayBilling.restorePurchases();
  return res.purchases || [];
}

export function suscribirseActualizacion(callback) {
  const limpiadores = [];
  const registrar = (evento, mapear) => {
    PlayBilling.addListener(evento, mapear).then((h) => {
      if (h) limpiadores.push(() => h.remove());
    });
  };
  registrar('purchaseUpdated', (data) => callback(data.purchase || data));
  registrar('purchaseError', (data) => callback({ error: data.message || 'Error de compra' }));
  return () => limpiadores.forEach((limpiar) => limpiar());
}

export async function verificarCompraEnBackend({ productId, basePlanId, purchaseToken, orderId }) {
  const res = await api.post('/pagos/play/confirmar', { productId, basePlanId, purchaseToken, orderId });
  return res.data;
}

export function mensajeDeError(e) {
  return e?.message || 'No se pudo completar la operación';
}
