import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import useSuscripcion from '../../../hooks/useSuscripcion';
import { showAlert } from '../../../services/platform';

function useRutinas() {
  const { esPremium } = useSuscripcion();
  const [rutinas, setRutinas] = useState([]);
  const [ejercicios, setEjercicios] = useState([]);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);
  const [grupoMuscular, setGrupoMuscular] = useState('pecho');
  const [nivel, setNivel] = useState('principiante');
  const [entorno, setEntorno] = useState('casa');
  const [entrenando, setEntrenando] = useState(false);
  const [rutinaActiva, setRutinaActiva] = useState(null);
  const [modo, setModo] = useState('normal');
  const [rutinasHoy, setRutinasHoy] = useState(0);
  const [objetivo, setObjetivo] = useState('hipertrofia');

  const cargarRutinas = useCallback(async () => {
    try {
      const res = await api.get('/rutinas');
      setRutinas(res.data.rutinas);
    } catch (err) {
      console.error('Error al cargar rutinas');
    }
  }, []);

  const cargarLimite = useCallback(async () => {
    try {
      const res = await api.get('/usuarios/rutinas-hoy');
      setRutinasHoy(res.data.rutinas_hoy || 0);
    } catch (err) {}
  }, []);

  useEffect(() => {
    cargarRutinas();
    cargarLimite();
  }, [cargarRutinas, cargarLimite]);

  const puedeCrearRutina = useCallback(async () => {
    if (!esPremium && rutinasHoy >= 3) {
      showAlert('Has usado tus 3 rutinas gratuitas del día. ¡Hazte PREMIUM para crear ilimitadas!');
      return false;
    }
    return true;
  }, [esPremium, rutinasHoy]);

  const verRutina = useCallback(async (id) => {
    try {
      const res = await api.get(`/rutinas/${id}`);
      setEjercicios(res.data.ejercicios);
      setRutinaSeleccionada(res.data.rutina);
    } catch (err) {
      console.error('Error al ver rutina');
    }
  }, []);

  const iniciarEntrenamiento = useCallback(async (rutinaId) => {
    try {
      const res = await api.get(`/rutinas/${rutinaId}`);
      setRutinaActiva(res.data.rutina);
      setEjercicios(res.data.ejercicios);
      setEntrenando(true);
    } catch (err) {
      showAlert('Error al cargar la rutina');
    }
  }, []);

  const generarRutina = useCallback(async () => {
    if (!(await puedeCrearRutina())) return;
    try {
      await api.post('/generador/rutina', {
        grupo_muscular: grupoMuscular,
        entorno: entorno,
        nivel: nivel,
        objetivo: objetivo
      });
      showAlert('✅ Rutina generada con éxito!');
      setMostrarGenerador(false);
      cargarRutinas();
      cargarLimite();
    } catch (err) {
      const msg = err.response?.data?.error;
      if (err.response?.status === 403 || err.response?.data?.limite) {
        showAlert(msg || '⚠️ Límite de rutinas gratis alcanzado.');
      } else {
        showAlert('Error al generar rutina');
      }
    }
  }, [puedeCrearRutina, grupoMuscular, entorno, nivel, objetivo, cargarRutinas, cargarLimite]);

  const finalizarEntrenamiento = useCallback(() => {
    setEntrenando(false);
    setRutinaActiva(null);
    setEjercicios([]);
    showAlert('🎉 Entrenamiento finalizado!');
  }, []);

  const cancelarEntrenamiento = useCallback(() => {
    setEntrenando(false);
    setRutinaActiva(null);
    setEjercicios([]);
  }, []);

  const cerrarModalRutina = useCallback(() => {
    setEjercicios([]);
    setRutinaSeleccionada(null);
  }, []);

  return {
    rutinas,
    ejercicios,
    rutinaSeleccionada,
    entrenando,
    rutinaActiva,
    modo,
    mostrarGenerador,
    grupoMuscular,
    nivel,
    entorno,
    objetivo,
    rutinasHoy,
    setMostrarGenerador,
    setGrupoMuscular,
    setNivel,
    setEntorno,
    setObjetivo,
    setModo,
    cargarRutinas,
    cargarLimite,
    puedeCrearRutina,
    verRutina,
    iniciarEntrenamiento,
    generarRutina,
    finalizarEntrenamiento,
    cancelarEntrenamiento,
    cerrarModalRutina,
  };
}

export default useRutinas;
