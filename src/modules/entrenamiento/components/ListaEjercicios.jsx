import { formatearSeries } from '../utils/entrenamientoUtils';

function ListaEjercicios({ ejercicios, ejercicioActual, corriendo, esCircuito, rondaActual, totalRondas }) {
  return (
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
            {esCircuito ? '1 serie' : formatearSeries(e)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ListaEjercicios;
