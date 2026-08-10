export const PLAY_PLAN_PREMIUM = 'premium';
export const PLAY_PLAN_FUNDADOR = 'fundador';

export const PLAY_PRODUCT_IDS = [PLAY_PLAN_PREMIUM, PLAY_PLAN_FUNDADOR];

export const PLAY_CATALOGO = [
  {
    productId: PLAY_PLAN_FUNDADOR,
    basePlanId: 'mensual',
    codigoPlan: 'FUNDADOR_399',
    nombre: 'Fundador',
    precio: 'S/ 3.99',
    periodo: 'mes',
    descripcion: 'Precio de lanzamiento para los primeros 500 suscriptores',
  },
  {
    productId: PLAY_PLAN_PREMIUM,
    basePlanId: 'mensual',
    codigoPlan: 'PREMIUM_599',
    nombre: 'Premium',
    precio: 'S/ 5.99',
    periodo: 'mes',
    descripcion: 'Acceso completo a VitaPlena',
  },
  {
    productId: PLAY_PLAN_PREMIUM,
    basePlanId: 'anual',
    codigoPlan: 'PREMIUM_599',
    nombre: 'Premium Anual',
    precio: 'S/ 44.99',
    periodo: 'año',
    descripcion: 'Acceso completo por 12 meses',
  },
];

export function obtenerPlanCatalogado(productId, basePlanId) {
  return (
    PLAY_CATALOGO.find(
      (plan) => plan.productId === productId && plan.basePlanId === basePlanId
    ) || null
  );
}
