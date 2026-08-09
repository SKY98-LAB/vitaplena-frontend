function FormularioCorporal({ form, setForm, onGuardar }) {
  return (
    <div className="card">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label>Fecha</label>
          <input type="date" value={form.fecha} onChange={(e) => setForm({...form, fecha: e.target.value})} className="input" />
        </div>
        <div>
          <label>Peso (kg) *</label>
          <input type="number" step="0.1" placeholder="Ej: 70.5" value={form.peso_kg} onChange={(e) => setForm({...form, peso_kg: e.target.value})} className="input" />
        </div>
        <div>
          <label>Cintura (cm)</label>
          <input type="number" step="0.1" value={form.cintura_cm} onChange={(e) => setForm({...form, cintura_cm: e.target.value})} className="input" />
        </div>
        <div>
          <label>Cadera (cm)</label>
          <input type="number" step="0.1" value={form.cadera_cm} onChange={(e) => setForm({...form, cadera_cm: e.target.value})} className="input" />
        </div>
        <div>
          <label>Pecho (cm)</label>
          <input type="number" step="0.1" value={form.pecho_cm} onChange={(e) => setForm({...form, pecho_cm: e.target.value})} className="input" />
        </div>
        <div>
          <label>Brazo (cm)</label>
          <input type="number" step="0.1" value={form.brazo_cm} onChange={(e) => setForm({...form, brazo_cm: e.target.value})} className="input" />
        </div>
        <div>
          <label>Muslo (cm)</label>
          <input type="number" step="0.1" value={form.muslo_cm} onChange={(e) => setForm({...form, muslo_cm: e.target.value})} className="input" />
        </div>
        <div>
          <label>Notas</label>
          <input type="text" placeholder="Ej: En ayunas" value={form.notas} onChange={(e) => setForm({...form, notas: e.target.value})} className="input" />
        </div>
      </div>
      <button onClick={onGuardar} className="btn btn-primary" style={{ marginTop: 15, width: '100%', fontSize: 16 }}>
        💾 Guardar Registro
      </button>
    </div>
  );
}

export default FormularioCorporal;
