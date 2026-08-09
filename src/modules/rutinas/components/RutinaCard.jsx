function RutinaCard({ rutina, onVerDetalle, onIniciar }) {
  return (
    <div className="card" style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4>{rutina.nombre}</h4>
          <p style={{ color: '#888', fontSize: 14 }}>{rutina.descripcion}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <span className="badge badge-blue">{rutina.entorno_requerido}</span>
            <span className="badge badge-green">{rutina.nivel_dificultad}</span>
            <span className="badge badge-orange">{rutina.duracion_estimada_min}min</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onVerDetalle(rutina.id); }} className="btn btn-primary" style={{ fontSize: 12, padding: '6px 12px' }}>
            👁️ Ver
          </button>
          <button onClick={(e) => { e.stopPropagation(); onIniciar(rutina.id); }} className="btn btn-success" style={{ fontSize: 12, padding: '6px 12px' }}>
            ▶️ Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RutinaCard;
