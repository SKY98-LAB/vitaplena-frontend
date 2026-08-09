import ProgressBar from './ProgressBar';

function EncabezadoEntrenamiento({
  esCircuito,
  rondaActual,
  totalRondas,
  progreso,
  ejercicioActual,
  totalEjercicios,
  serieActual,
  seriesPlanificadas
}) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>🏋️ {esCircuito ? `Circuito - Ronda ${rondaActual}/${totalRondas}` : 'Entrenamiento Activo'}</h3>
        <span className="badge badge-blue">{progreso.toFixed(0)}%</span>
      </div>
      <ProgressBar progreso={progreso} />
      <p style={{ color: '#888' }}>
        {esCircuito
          ? `Ejercicio ${ejercicioActual + 1} de ${totalEjercicios} | Ronda ${rondaActual}`
          : `Ejercicio ${ejercicioActual + 1} de ${totalEjercicios} | Serie ${serieActual}/${seriesPlanificadas}`
        }
      </p>
    </div>
  );
}

export default EncabezadoEntrenamiento;
