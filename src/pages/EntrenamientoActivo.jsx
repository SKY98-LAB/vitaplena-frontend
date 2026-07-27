import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function EntrenamientoActivo({ rutinaId, ejercicios, modo, onFinalizar }) {
  const [entrenamientoId, setEntrenamientoId] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(0);
  const [serieActual, setSerieActual] = useState(1);
  const [fase, setFase] = useState('ejercicio');
  const [tiempo, setTiempo] = useState(0);
  const [descanso, setDescanso] = useState(60);
  const [corriendo, setCorriendo] = useState(false);
  const [rondaActual, setRondaActual] = useState(1);
  const [mostrarPostura, setMostrarPostura] = useState(false);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const esCircuito = modo === 'circuito';
  const descansoLargo = 60;
  const totalRondas = esCircuito ? 3 : 1;

  const playBeep = (freq = 800, dur = 0.2, vol = 0.3) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = vol;
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const getPostura = (nombre) => {
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
    if (n.includes('skater') || n.includes('skater')) return 'Salta lateralmente. Aterriza suave. Alterna piernas.';
    if (n.includes('bear crawl')) return 'En cuatro patas. Avanza moviendo brazo y pierna opuestos.';
    if (n.includes('high knee')) return 'Rodillas al pecho en el sitio. Brazos acompañan el movimiento.';
    if (n.includes('tuck jump')) return 'Salta llevando rodillas al pecho. Amortigua la caída.';
    if (n.includes('escalador') || n.includes('mountain')) return 'En plancha. Lleva rodillas al pecho alternando rápido.';
    if (n.includes('dead bug')) return 'Boca arriba. Extiende brazo y pierna opuestos. Espalda pegada al suelo.';
    if (n.includes('russian twist')) return 'Sentado, gira el torso de lado a lado. Piernas elevadas.';
    if (n.includes('v-up')) return 'Boca arriba. Eleva piernas y torso a la vez. Forma una V.';
    return 'Mantén una postura correcta. Respira al hacer el movimiento. No hagas movimientos bruscos.';
  };

  useEffect(() => {
    iniciarEntrenamiento();
    return () => clearInterval(timerRef.current);
  }, []);

  const iniciarEntrenamiento = async () => {
    try {
      const res = await api.post('/entrenamientos', {
        rutina_id: rutinaId,
        fecha_inicio: new Date().toISOString()
      });
      setEntrenamientoId(res.data.entrenamiento.id);
    } catch (err) {
      console.error('Error al iniciar entrenamiento');
    }
  };

  const ejecutarCircuito = (idx) => {
    setMostrarPostura(false);
    const ej = ejercicios[idx];
    const duracion = ej.duracion_segundos || ej.repeticiones_planificadas * 3;
    setTiempo(duracion);
    setFase('ejercicio');
    setCorriendo(true);

    timerRef.current = setInterval(() => {
      setTiempo((prev) => {
        if (prev === 4) playBeep(600, 0.15, 0.2);
        
        if (prev <= 1) {
          clearInterval(timerRef.current);
          playBeep(800, 0.3, 0.3);

          if (idx < ejercicios.length - 1) {
            ejecutarCircuito(idx + 1);
          } else {
            setCorriendo(false);
            if (rondaActual < totalRondas) {
              setFase('descanso_ronda');
              setDescanso(descansoLargo);
            } else {
              setFase('completado');
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const iniciarEjercicio = () => {
    setMostrarPostura(false);
    if (esCircuito) {
      ejecutarCircuito(ejercicioActual);
      return;
    }

    playBeep();
    setCorriendo(true);
    setFase('ejercicio');
    const ej = ejercicios[ejercicioActual];
    const duracion = ej.duracion_segundos || ej.repeticiones_planificadas * 3;
    setTiempo(duracion);

    timerRef.current = setInterval(() => {
      setTiempo((prev) => {
        if (prev === 4) playBeep(600, 0.15, 0.2);
        
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCorriendo(false);
          playBeep();

          if (serieActual < ejercicios[ejercicioActual].series_planificadas) {
            setFase('descanso');
            setDescanso(ejercicios[ejercicioActual].descanso_entre_series_seg || 60);
          } else {
            completarEjercicio();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const iniciarDescanso = () => {
    playBeep();
    setCorriendo(true);

    timerRef.current = setInterval(() => {
      setDescanso((prev) => {
        if (prev === 4) playBeep(600, 0.15, 0.2);
        
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSerieActual(serieActual + 1);
          setFase('ejercicio');
          setCorriendo(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const iniciarDescansoRonda = () => {
    playBeep();
    setCorriendo(true);

    timerRef.current = setInterval(() => {
      setDescanso((prev) => {
        if (prev === 4) playBeep(600, 0.15, 0.2);
        
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setRondaActual(rondaActual + 1);
          setEjercicioActual(0);
          setFase('ejercicio');
          setCorriendo(false);
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completarEjercicio = async () => {
    clearInterval(timerRef.current);
    setCorriendo(false);
    setFase('completado');
    playBeep();

    if (entrenamientoId) {
      try {
        await api.post(`/entrenamientos/${entrenamientoId}/ejercicios`, {
          ejercicio_id: ejercicios[ejercicioActual].ejercicio_id,
          series_realizadas: ejercicios[ejercicioActual].series_planificadas,
          repeticiones_realizadas: Array(ejercicios[ejercicioActual].series_planificadas).fill(
            ejercicios[ejercicioActual].repeticiones_planificadas || 10
          )
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
      setCorriendo(false);
      setTiempo(0);
    } else {
      finalizarEntrenamiento();
    }
  };

  const finalizarEntrenamiento = async () => {
    playBeep(800, 0.5, 0.4);
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
    onFinalizar();
  };

  const pausar = () => {
    clearInterval(timerRef.current);
    setCorriendo(false);
  };

  const ej = ejercicios[ejercicioActual];
  const progreso = esCircuito
    ? ((rondaActual - 1) * ejercicios.length + ejercicioActual) / (totalRondas * ejercicios.length) * 100
    : (ejercicioActual / ejercicios.length * 100);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>🏋️ {esCircuito ? `Circuito - Ronda ${rondaActual}/${totalRondas}` : 'Entrenamiento Activo'}</h3>
          <span className="badge badge-blue">{progreso.toFixed(0)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progreso}%`, background: '#4CAF50' }}></div>
        </div>
        <p style={{ color: '#888' }}>
          {esCircuito
            ? `Ejercicio ${ejercicioActual + 1} de ${ejercicios.length} | Ronda ${rondaActual}`
            : `Ejercicio ${ejercicioActual + 1} de ${ejercicios.length} | Serie ${serieActual}/${ej.series_planificadas}`
          }
        </p>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <span style={{ fontSize: 50 }}>
          {fase.includes('descanso') ? '😮‍💨' : fase === 'completado' ? '✅' : '🏋️'}
        </span>
        <h2>{ej.ejercicio_nombre}</h2>
        <p style={{ fontSize: 18, color: '#666' }}>
          {esCircuito
            ? 'Circuito automático sin pausa'
            : `${ej.series_planificadas} series x ${ej.repeticiones_planificadas || ej.duracion_segundos + 's'}`
          }
          {ej.peso_sugerido_kg ? ` con ${ej.peso_sugerido_kg}kg` : ''}
        </p>

        {/* Botón de postura */}
        <button 
          onClick={() => setMostrarPostura(!mostrarPostura)} 
          style={{ 
            background: 'none', border: '1px solid #2196F3', color: '#2196F3', 
            padding: '5px 15px', borderRadius: 20, cursor: 'pointer', fontSize: 14, marginBottom: 10 
          }}
        >
          📐 ¿Cómo se hace?
        </button>

        {mostrarPostura && (
          <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 12, marginTop: 10, textAlign: 'left' }}>
            <h4>📐 Postura correcta</h4>
            <p>{getPostura(ej.ejercicio_nombre)}</p>
            {ej.advertencia_lesion && (
              <p style={{ color: '#e65100', marginTop: 8 }}>⚠️ {ej.advertencia_lesion}</p>
            )}
            {ej.version_facilitada && (
              <p style={{ color: '#2e7d32', marginTop: 8 }}>💡 Más fácil: {ej.version_facilitada}</p>
            )}
          </div>
        )}

        {/* EJERCICIO */}
        {fase === 'ejercicio' && !corriendo && (
          <button onClick={iniciarEjercicio} className="btn btn-success" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
            ▶️ {esCircuito ? `Iniciar Ronda ${rondaActual}` : `Iniciar Serie ${serieActual}`}
          </button>
        )}
        {fase === 'ejercicio' && corriendo && (
          <div>
            <h1 style={{ fontSize: 60, color: tiempo <= 3 ? '#f44336' : '#2196F3' }}>{tiempo}s</h1>
            <button onClick={pausar} className="btn btn-warning">⏸️ Pausar</button>
          </div>
        )}

        {/* DESCANSO NORMAL */}
        {fase === 'descanso' && !corriendo && (
          <div>
            <p>Descansa {ej.descanso_entre_series_seg || 60}s</p>
            <button onClick={iniciarDescanso} className="btn btn-warning" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
              😴 Iniciar Descanso
            </button>
          </div>
        )}
        {fase === 'descanso' && corriendo && (
          <div>
            <h1 style={{ fontSize: 60, color: descanso <= 3 ? '#f44336' : '#FF9800' }}>{descanso}s</h1>
            <button onClick={pausar} className="btn btn-warning">⏸️ Pausar</button>
          </div>
        )}

        {/* DESCANSO ENTRE RONDAS */}
        {fase === 'descanso_ronda' && !corriendo && (
          <div>
            <h3>🎉 ¡Ronda {rondaActual} completada!</h3>
            <p>Descansa {descansoLargo}s</p>
            <button onClick={iniciarDescansoRonda} className="btn btn-warning" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
              ▶️ Iniciar Ronda {rondaActual + 1}
            </button>
          </div>
        )}
        {fase === 'descanso_ronda' && corriendo && (
          <div>
            <h1 style={{ fontSize: 60, color: descanso <= 3 ? '#f44336' : '#FF9800' }}>{descanso}s</h1>
            <button onClick={pausar} className="btn btn-warning">⏸️ Pausar</button>
          </div>
        )}

        {/* COMPLETADO */}
        {fase === 'completado' && (
          <div>
            <h3>✅ {esCircuito ? 'Circuito completado!' : 'Ejercicio completado!'}</h3>
            <button onClick={esCircuito ? finalizarEntrenamiento : siguienteEjercicio} className="btn btn-primary" style={{ fontSize: 18, padding: '12px 30px', marginTop: 10 }}>
              {esCircuito ? '🏁 Finalizar' : ejercicios.length > ejercicioActual + 1 ? '➡️ Siguiente' : '🏁 Finalizar'}
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h4>📋 Ejercicios {esCircuito && `(Ronda ${rondaActual}/${totalRondas})`}</h4>
        {ejercicios.map((e, i) => (
          <div key={i} style={{
            padding: '10px 0', borderBottom: '1px solid #eee',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: i === ejercicioActual && corriendo ? '#e3f2fd' : 'transparent'
          }}>
            <span>
              {i === ejercicioActual && corriendo ? '▶️' : i < ejercicioActual ? '✅' : '⏳'} {e.ejercicio_nombre}
            </span>
            <span style={{ fontSize: 12, color: '#888' }}>
              {esCircuito ? '1 serie' : `${e.series_planificadas}x${e.repeticiones_planificadas || e.duracion_segundos + 's'}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntrenamientoActivo;