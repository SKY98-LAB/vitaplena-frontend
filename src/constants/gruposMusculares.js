export const GRUPOS_MUSCULARES = [
  { valor: 'pecho', etiqueta: 'Pecho', icono: '🦾' },
  { valor: 'espalda', etiqueta: 'Espalda', icono: '🔙' },
  { valor: 'cuadriceps', etiqueta: 'Cuádriceps', icono: '🦵' },
  { valor: 'femorales', etiqueta: 'Femorales', icono: '🦵' },
  { valor: 'gluteos', etiqueta: 'Glúteos', icono: '🍑' },
  { valor: 'pantorrillas', etiqueta: 'Pantorrillas', icono: '🦶' },
  { valor: 'hombros', etiqueta: 'Hombros', icono: '🙆' },
  { valor: 'biceps', etiqueta: 'Bíceps', icono: '💪' },
  { valor: 'triceps', etiqueta: 'Tríceps', icono: '💪' },
  { valor: 'core', etiqueta: 'Core', icono: '🎯' },
  { valor: 'cardio', etiqueta: 'Cardio', icono: '❤️' },
  { valor: 'flexibilidad', etiqueta: 'Flexibilidad', icono: '🧘‍♂️' },
  { valor: 'piernas', etiqueta: 'Piernas', icono: '🦵' },
  { valor: 'brazos', etiqueta: 'Brazos', icono: '💪' }
];

export const ICONOS_GRUPO_MUSCULAR = Object.fromEntries(
  GRUPOS_MUSCULARES.map((g) => [g.valor, g.icono])
);

const VALORES_GENERADOR_RUTINAS = new Set([
  'pecho', 'espalda', 'cuadriceps', 'femorales', 'gluteos', 'pantorrillas',
  'hombros', 'biceps', 'triceps', 'core', 'cardio'
]);

const VALORES_FILTRO_EJERCICIOS = new Set([
  ...VALORES_GENERADOR_RUTINAS, 'flexibilidad'
]);

export const GRUPOS_GENERADOR_RUTINAS = GRUPOS_MUSCULARES.filter((g) => VALORES_GENERADOR_RUTINAS.has(g.valor));

export const GRUPOS_FILTRO_EJERCICIOS = GRUPOS_MUSCULARES.filter((g) => VALORES_FILTRO_EJERCICIOS.has(g.valor));
