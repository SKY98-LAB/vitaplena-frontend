import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../../services/api';
import useTimer from './useTimer';
import useAudio from './useAudio';
import {
  calcularProgreso,
  getDuracionEjercicio,
  getDescansoEntreSeries,
  DESCANSO_LARGO_SEG,
  TOTAL_RONDAS_CIRCUITO,
} from '../utils/entrenamientoUtils';

function useEntrenamientoActivo({ rutinaId, ejercicios, modo, onFinalizar, onCancelar }) {
  const { tiempo, descanso, corriendo, contarTiempo, contarDescanso, detener } = useTimer();
  const playBeep = useAudio();

  const [entrenamientoId, setEntrenamientoId] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [serieActual, setSerieActual] = useState(1);
  const [fase, setFase] = useState('ejercicio');
  const [rondaActual, setRondaActual] = useState(1);
  const [mostrarPostura, setMostrarPostura] = useState(false);

  const arrancadoRef = useRef(false);
  const sesionFinalizadaRef = useRef(false);

  const esCircuito = modo === 'circuito';
  const totalRondas = esCircuito ? TOTAL_RONDAS_CIRCUITO : 1;
  const ej = ejercicios[ejercicioActual];

  const iniciarEntrenamiento = useCallback(async () => {
    if (!ejercicios.length) return;
    try {
      const res = await api.post('/entrenamientos', {
        rutina_id: rutinaId,
        fecha_inicio: new Date().toISOString()
      });
      setEntrenamientoId(res.data.entrenamiento.id);
    } catch (err) {
      console.error('Error al iniciar entrenamiento');
    }
  }, [rutinaId, ejercicios.length]);

  useEffect(() => {
    if (arrancadoRef.current) return;
    arrancadoRef.current = true;
    iniciarEntrenamiento();
  }, [iniciarEntrenamiento]);

  const ejecutarCircuito = (idx) => {
    setMostrarPostura(false);
    const ejActual = ejercicios[idx];
    if (!ejActual) return;
    setEjercicioActual(idx);
    setFase('ejercicio');
    contarTiempo(
      getDuracionEjercicio(ejActual),
      () => playBeep(600, 0.15, 0.2),
      () => {
        playBeep(800, 0.3, 0.3);
        if (idx < ejercicios.length - 1) {
          ejecutarCircuito(idx + 1);
        } else {
          if (rondaActual < totalRondas) {
            setFase('descanso_ronda');
          } else {
            setFase('completado');
          }
        }
      }
    );
  };

  const iniciarEjercicio = () => {
    setMostrarPostura(false);
    if (esCircuito) {
      ejecutarCircuito(ejercicioActual);
      return;
    }

    playBeep();
    setFase('ejercicio');
    contarTiempo(
      getDuracionEjercicio(ej),
      () => playBeep(600, 0.15, 0.2),
      () => {
        playBeep();
        if (serieActual < ej.series_planificadas) {
          setFase('descanso');
        } else {
          completarEjercicio();
        }
      }
    );
  };

  const iniciarDescanso = () => {
    playBeep();
    contarDescanso(
      getDescansoEntreSeries(ej),
      () => playBeep(600, 0.15, 0.2),
      () => {
        playBeep();
        setSerieActual(serieActual + 1);
        setFase('ejercicio');
      }
    );
  };

  const iniciarDescansoRonda = () => {
    playBeep();
    contarDescanso(
      DESCANSO_LARGO_SEG,
      () => playBeep(600, 0.15, 0.2),
      () => {
        playBeep();
        setRondaActual(rondaActual + 1);
        setEjercicioActual(0);
        setFase('ejercicio');
      }
    );
  };

  const completarEjercicio = async () => {
    detener();
    setFase('completado');
    playBeep();
    if (entrenamientoId) {
      try {
        await api.post(`/entrenamientos/${entrenamientoId}/ejercicios`, {
          ejercicio_id: ej.ejercicio_id,
          series_realizadas: ej.series_planificadas,
          repeticiones_realizadas: Array(ej.series_planificadas).fill(ej.repeticiones_planificadas || 10)
        });
      } catch (err) {
        console.error('Error al registrar ejercicio');
      }
    }
  };

  const siguienteEjercicio = () => {
    if (ejercicioActual < ejercicios.length - 1) {
      setEjercicioActual(ejercicioActual + 1);
      setSerieActual(1);
      setFase('ejercicio');
    } else {
      finalizarEntrenamiento();
    }
  };

  const cerrarSesion = useCallback(async () => {
    if (sesionFinalizadaRef.current) return;
    sesionFinalizadaRef.current = true;
    if (entrenamientoId) {
      try {
        await api.put(`/entrenamientos/${entrenamientoId}/finalizar`, {
          nivel_esfuerzo_percibido: 7,
          nivel_energia_antes: 4,
          nivel_energia_despues: 3
        });
      } catch (err) {
        console.error('Error al finalizar');
      }
    }
  }, [entrenamientoId]);

  const finalizarEntrenamiento = async () => {
    playBeep(800, 0.5, 0.4);
    await cerrarSesion();
    onFinalizar();
  };

  const cancelar = async () => {
    await cerrarSesion();
    onCancelar();
  };

  useEffect(() => {
    return () => {
      cerrarSesion();
    };
  }, [cerrarSesion]);

  const togglePostura = () => setMostrarPostura(!mostrarPostura);

  const progreso = calcularProgreso({ esCircuito, ejercicioActual, ejercicios, rondaActual, totalRondas });

  return {
    tiempo,
    descanso,
    corriendo,
    esCircuito,
    totalRondas,
    ejercicioActual,
    serieActual,
    fase,
    rondaActual,
    mostrarPostura,
    ej,
    progreso,
    iniciarEjercicio,
    detener,
    iniciarDescanso,
    iniciarDescansoRonda,
    siguienteEjercicio,
    finalizarEntrenamiento,
    cancelar,
    togglePostura
  };
}

export default useEntrenamientoActivo;
