function ComidaCard({ comida }) {
  const iconos = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙', snack: '🍿' };
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>{iconos[comida.tipo_comida] || '🍽️'} {comida.tipo_comida}</h4>
        <span className="badge badge-orange">{comida.total_calorias} kcal</span>
      </div>
      <div style={{ display: 'flex', gap: 15, marginTop: 8 }}>
        <span>💪 {comida.total_proteinas}g</span>
        <span>🍞 {comida.total_carbohidratos}g</span>
        <span>🧈 {comida.total_grasas}g</span>
      </div>
      <small style={{ color: '#aaa' }}>{new Date(comida.fecha_hora).toLocaleTimeString()}</small>
    </div>
  );
}

export default ComidaCard;
