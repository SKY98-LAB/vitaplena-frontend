import useEntrenamientoActivo from '../modules/entrenamiento/hooks/useEntrenamientoActivo';
import ExerciseCard from '../modules/entrenamiento/components/ExerciseCard';
import EncabezadoEntrenamiento from '../modules/entrenamiento/components/EncabezadoEntrenamiento';
import ListaEjercicios from '../modules/entrenamiento/components/ListaEjercicios';

function EntrenamientoActivo({ rutinaId, ejercicios, modo, onFinalizar, onCancelar }) {
  const {
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
  } = useEntrenamientoActivo({ rutinaId, ejercicios, modo, onFinalizar, onCancelar });

  if (ejercicios.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 30 }}>
        <h3>⚠️ Esta rutina no tiene ejercicios.</h3>
        <p style={{ color: '#888' }}>No se pudo iniciar el entrenamiento.</p>
        <button onClick={cancelar} className="btn btn-primary" style={{ marginTop: 12 }}>
          ← Volver a mis rutinas
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button onClick={cancelar} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 13 }}>
          ✖ Cancelar entrenamiento
        </button>
      </div>
      <EncabezadoEntrenamiento
        esCircuito={esCircuito}
        rondaActual={rondaActual}
        totalRondas={totalRondas}
        progreso={progreso}
        ejercicioActual={ejercicioActual}
        totalEjercicios={ejercicios.length}
        serieActual={serieActual}
        seriesPlanificadas={ej?.series_planificadas}
      />

      <ExerciseCard
        ejercicio={ej}
        esCircuito={esCircuito}
        fase={fase}
        corriendo={corriendo}
        tiempo={tiempo}
        descanso={descanso}
        serieActual={serieActual}
        rondaActual={rondaActual}
        mostrarPostura={mostrarPostura}
        esUltimoEjercicio={ejercicioActual === ejercicios.length - 1}
        onIniciar={iniciarEjercicio}
        onPausar={detener}
        onIniciarDescanso={iniciarDescanso}
        onIniciarDescansoRonda={iniciarDescansoRonda}
        onSiguiente={siguienteEjercicio}
        onFinalizar={finalizarEntrenamiento}
        onTogglePostura={togglePostura}
      />

      <ListaEjercicios
        ejercicios={ejercicios}
        ejercicioActual={ejercicioActual}
        corriendo={corriendo}
        esCircuito={esCircuito}
        rondaActual={rondaActual}
        totalRondas={totalRondas}
      />
    </div>
  );
}

export default EntrenamientoActivo;
