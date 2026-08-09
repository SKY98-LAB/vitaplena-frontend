function HistorialCorporal({ registros }) {
  return (
    <>
      <h3>📋 Historial</h3>
      {registros.map((r) => (
        <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{new Date(r.fecha).toLocaleDateString()}</strong>
            <p>⚖️ {r.peso_kg} kg {r.cintura_cm && `| 📏 Cintura: ${r.cintura_cm}cm`}</p>
            {r.notas && <small>{r.notas}</small>}
          </div>
        </div>
      ))}
    </>
  );
}

export default HistorialCorporal;
