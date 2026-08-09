import Timer from './Timer';
import { getPostura, getDescansoEntreSeries, formatearSeries, DESCANSO_LARGO_SEG } from '../utils/entrenamientoUtils';

function ExerciseCard({
  ejercicio,
  esCircuito,
  fase,
  corriendo,
  tiempo,
  descanso,
  serieActual,
  rondaActual,
  mostrarPostura,
  esUltimoEjercicio,
  onIniciar,
  onPausar,
  onIniciarDescanso,
  onIniciarDescansoRonda,
  onSiguiente,
  onFinalizar,
  onTogglePostura,
}) {
  const descansoEntreSeries = getDescansoEntreSeries(ejercicio);

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 50 }}>
        {fase.includes('descanso') ? '😮‍💨' : fase === 'completado' ? '✅' : '🏋️'}
      </span>
      <h2>{ejercicio.ejercicio_nombre}</h2>
      <p style={{ fontSize: 18, color: '#666' }}>
        {esCircuito
          ? 'Circuito automático sin pausa'
          : formatearSeries(ejercicio, { conPalabraSeries: true })
        }
        {ejercicio.peso_sugerido_kg ? ` con ${ejercicio.peso_sugerido_kg}kg` : ''}
      </p>

      <button
        onClick={onTogglePostura}
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
          <p>{getPostura(ejercicio.ejercicio_nombre)}</p>
          {ejercicio.advertencia_lesion && (
            <p style={{ color: '#e65100', marginTop: 8 }}>⚠️ {ejercicio.advertencia_lesion}</p>
          )}
          {ejercicio.version_facilitada && (
            <p style={{ color: '#2e7d32', marginTop: 8 }}>💡 Más fácil: {ejercicio.version_facilitada}</p>
          )}
        </div>
      )}

      {fase === 'ejercicio' && !corriendo && (
        <button onClick={onIniciar} className="btn btn-success" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
          ▶️ {esCircuito ? `Iniciar Ronda ${rondaActual}` : `Iniciar Serie ${serieActual}`}
        </button>
      )}
      {fase === 'ejercicio' && corriendo && (
        <Timer segundos={tiempo} colorBase="#2196F3" onPausar={onPausar} />
      )}

      {fase === 'descanso' && !corriendo && (
        <div>
          <p>Descansa {descansoEntreSeries}s</p>
          <button onClick={onIniciarDescanso} className="btn btn-warning" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
            😴 Iniciar Descanso
          </button>
        </div>
      )}
      {fase === 'descanso' && corriendo && (
        <Timer segundos={descanso} colorBase="#FF9800" onPausar={onPausar} />
      )}

      {fase === 'descanso_ronda' && !corriendo && (
        <div>
          <h3>🎉 ¡Ronda {rondaActual} completada!</h3>
          <p>Descansa {DESCANSO_LARGO_SEG}s</p>
          <button onClick={onIniciarDescansoRonda} className="btn btn-warning" style={{ fontSize: 20, padding: '15px 40px', marginTop: 10 }}>
            ▶️ Iniciar Ronda {rondaActual + 1}
          </button>
        </div>
      )}
      {fase === 'descanso_ronda' && corriendo && (
        <Timer segundos={descanso} colorBase="#FF9800" onPausar={onPausar} />
      )}

      {fase === 'completado' && (
        <div>
          <h3>✅ {esCircuito ? 'Circuito completado!' : 'Ejercicio completado!'}</h3>
          <button onClick={esCircuito ? onFinalizar : onSiguiente} className="btn btn-primary" style={{ fontSize: 18, padding: '12px 30px', marginTop: 10 }}>
            {esCircuito ? '🏁 Finalizar' : !esUltimoEjercicio ? '➡️ Siguiente' : '🏁 Finalizar'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
