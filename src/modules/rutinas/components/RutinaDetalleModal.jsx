import { ICONOS_GRUPO_MUSCULAR } from '../../../constants/gruposMusculares';
import { formatearSeries } from '../../entrenamiento/utils/entrenamientoUtils';

function RutinaDetalleModal({ rutinaSeleccionada, ejercicios, onCerrar }) {
  return (
    <div className="modal" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{rutinaSeleccionada?.nombre || 'Rutina'}</h3>
        <p style={{ color: '#888', marginBottom: 16 }}>
          {rutinaSeleccionada?.duracion_estimada_min} min | {rutinaSeleccionada?.nivel_dificultad}
        </p>
        {ejercicios.map((ej, i) => {
          const icono = ICONOS_GRUPO_MUSCULAR[ej.grupo_muscular_principal] || '🏋️';
          return (
            <div key={i} className="card" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 36 }}>{icono}</span>
                <div style={{ flex: 1 }}>
                  <h4>{i+1}. {ej.ejercicio_nombre}</h4>
                  <p style={{ color: '#666' }}>{ej.descripcion_corta}</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className="badge badge-blue">
                      {formatearSeries(ej, { conEspacios: true })}
                    </span>
                    <span className="badge badge-green">{ej.grupo_muscular_principal}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={onCerrar} className="btn btn-danger" style={{ width: '100%', marginTop: 8 }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default RutinaDetalleModal;
