function FormularioComida({
  alimento,
  cantidad,
  onCantidad,
  tipoComida,
  onTipoComida,
  onRegistrar,
  onCerrar
}) {
  return (
    <div className="modal" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>📝 Registrar: {alimento.nombre}</h3>
        <p style={{ color: '#888' }}>{alimento.calorias_por_100g} kcal por 100g</p>
        <div style={{ margin: '10px 0' }}>
          <label>Gramos:</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => onCantidad(Number(e.target.value))}
            className="input"
            style={{ width: 120 }}
          />
          <p style={{ background: '#e8f5e9', padding: 10, borderRadius: 8, marginTop: 8 }}>
            = {((alimento.calorias_por_100g * cantidad) / 100).toFixed(0)} kcal,{' '}
            {((alimento.proteinas_por_100g * cantidad) / 100).toFixed(1)}g proteína
          </p>
        </div>
        <select value={tipoComida} onChange={(e) => onTipoComida(e.target.value)} className="input">
          <option value="desayuno">🌅 Desayuno</option>
          <option value="almuerzo">☀️ Almuerzo</option>
          <option value="cena">🌙 Cena</option>
          <option value="snack">🍿 Snack</option>
        </select>
        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button onClick={onRegistrar} className="btn btn-success" style={{ flex: 1 }}>✅ Guardar</button>
          <button onClick={onCerrar} className="btn btn-danger" style={{ flex: 1 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default FormularioComida;
