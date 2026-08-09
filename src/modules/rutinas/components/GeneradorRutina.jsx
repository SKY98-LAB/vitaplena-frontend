import { GRUPOS_GENERADOR_RUTINAS } from '../../../constants/gruposMusculares';

function GeneradorRutina({
  entorno,
  setEntorno,
  grupoMuscular,
  setGrupoMuscular,
  nivel,
  setNivel,
  objetivo,
  setObjetivo,
  modo,
  setModo,
  onGenerar,
}) {
  return (
    <div className="card">
      <select value={entorno} onChange={(e) => setEntorno(e.target.value)} className="input">
        <option value="casa">🏠 Casa</option>
        <option value="gimnasio">🏋️ Gimnasio</option>
      </select>
      <select value={grupoMuscular} onChange={(e) => setGrupoMuscular(e.target.value)} className="input">
        {GRUPOS_GENERADOR_RUTINAS.map((g) => (
          <option key={g.valor} value={g.valor}>{g.etiqueta}</option>
        ))}
      </select>
      <select value={nivel} onChange={(e) => setNivel(e.target.value)} className="input">
        <option value="principiante">Principiante</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
      </select>
      <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="input">
        <option value="hipertrofia">🏋️ Hipertrofia (3x10)</option>
        <option value="fuerza">💪 Fuerza (4x6)</option>
        <option value="resistencia">🏃 Resistencia (2x18)</option>
      </select>
      <select value={modo} onChange={(e) => setModo(e.target.value)} className="input">
        <option value="normal">Normal (series por ejercicio)</option>
        <option value="circuito">Circuito (una serie de cada, repetir)</option>
      </select>
      <button onClick={onGenerar} className="btn btn-success" style={{ width: '100%', marginTop: 8 }}>
        🎯 Generar Rutina
      </button>
    </div>
  );
}

export default GeneradorRutina;
