export const DESCANSO_LARGO_SEG = 60;
export const TOTAL_RONDAS_CIRCUITO = 3;

export function getPostura(nombre) {
  const n = nombre.toLowerCase();
  if (n.includes('sentadilla')) return 'Pies al ancho de hombros. Baja como si te sentaras. Espalda recta. Rodillas no sobrepasan los pies.';
  if (n.includes('flexión') || n.includes('flexion')) return 'Manos al ancho de hombros. Codos a 45°. Baja el pecho al suelo. Cuerpo recto.';
  if (n.includes('plancha')) return 'Antebrazos en el suelo. Codos bajo los hombros. Cuerpo recto. Abdomen contraído.';
  if (n.includes('zancada') || n.includes('lunge')) return 'Paso adelante. Rodilla delantera a 90°. Torso erguido.';
  if (n.includes('jumping') || n.includes('jack')) return 'De pie, salta abriendo piernas y subiendo brazos. Vuelve a posición inicial.';
  if (n.includes('curl')) return 'Codos pegados al cuerpo. Sube el peso controladamente. Baja lento.';
  if (n.includes('fondos')) return 'Manos en la silla. Codos hacia atrás. Baja controladamente.';
  if (n.includes('dominada')) return 'Agarre en la barra. Sube hasta que la barbilla pase la barra. No balancearse.';
  if (n.includes('burpee')) return 'Sentadilla, plancha, flexión, vuelve a sentadilla y salta.';
  if (n.includes('peso muerto')) return 'Espalda recta. Barra cerca del cuerpo. Levanta con piernas.';
  if (n.includes('hip thrust')) return 'Espalda en banco. Barra sobre caderas. Empuja hacia arriba.';
  if (n.includes('remo')) return 'Espalda recta. Tira con los codos hacia atrás.';
  if (n.includes('press')) return 'Empuja el peso hacia arriba. Controla la bajada.';
  if (n.includes('elevación') || n.includes('elevacion')) return 'Movimiento controlado. Sube y baja lentamente.';
  if (n.includes('estiramiento')) return 'Mantén la posición 20-30 segundos. No rebotes. Respira.';
  if (n.includes('círculo') || n.includes('circulo')) return 'Movimiento amplio y controlado. No uses impulso.';
  if (n.includes('abducción') || n.includes('abduccion')) return 'Acostado de lado. Eleva la pierna superior. Cadera alineada.';
  if (n.includes('patada')) return 'En cuatro patas. Eleva la pierna flexionada. Espalda recta.';
  if (n.includes('puente')) return 'Boca arriba. Eleva la cadera apretando glúteos.';
  if (n.includes('skater')) return 'Salta lateralmente. Aterriza suave. Alterna piernas.';
  if (n.includes('bear crawl')) return 'En cuatro patas. Avanza moviendo brazo y pierna opuestos.';
  if (n.includes('high knee')) return 'Rodillas al pecho en el sitio. Brazos acompañan el movimiento.';
  if (n.includes('tuck jump')) return 'Salta llevando rodillas al pecho. Amortigua la caída.';
  if (n.includes('escalador') || n.includes('mountain')) return 'En plancha. Lleva rodillas al pecho alternando rápido.';
  if (n.includes('dead bug')) return 'Boca arriba. Extiende brazo y pierna opuestos. Espalda pegada al suelo.';
  if (n.includes('russian twist')) return 'Sentado, gira el torso de lado a lado. Piernas elevadas.';
  if (n.includes('v-up')) return 'Boca arriba. Eleva piernas y torso a la vez. Forma una V.';
  return 'Mantén una postura correcta. Respira al hacer el movimiento. No hagas movimientos bruscos.';
}

export function getDuracionEjercicio(ejercicio) {
  return ejercicio.duracion_segundos || ejercicio.repeticiones_planificadas * 3;
}

export function getDescansoEntreSeries(ejercicio) {
  return ejercicio.descanso_entre_series_seg || DESCANSO_LARGO_SEG;
}

export function calcularProgreso({ esCircuito, ejercicioActual, ejercicios, rondaActual, totalRondas }) {
  return esCircuito
    ? ((rondaActual - 1) * ejercicios.length + ejercicioActual) / (totalRondas * ejercicios.length) * 100
    : (ejercicioActual / ejercicios.length * 100);
}

export function formatearSeries(ejercicio, { conPalabraSeries = false, conEspacios = false } = {}) {
  const repeticiones = ejercicio.repeticiones_planificadas || ejercicio.duracion_segundos + 's';
  if (conPalabraSeries) return `${ejercicio.series_planificadas} series x ${repeticiones}`;
  if (conEspacios) return `${ejercicio.series_planificadas} x ${repeticiones}`;
  return `${ejercicio.series_planificadas}x${repeticiones}`;
}
