import EntrenamientoActivo from './EntrenamientoActivo';
import useRutinas from '../modules/rutinas/hooks/useRutinas';
import RutinaCard from '../modules/rutinas/components/RutinaCard';
import GeneradorRutina from '../modules/rutinas/components/GeneradorRutina';
import RutinaDetalleModal from '../modules/rutinas/components/RutinaDetalleModal';

function Rutinas() {
  const {
    rutinas,
    ejercicios,
    rutinaSeleccionada,
    entrenando,
    rutinaActiva,
    modo,
    mostrarGenerador,
    grupoMuscular,
    nivel,
    entorno,
    objetivo,
    rutinasHoy,
    setMostrarGenerador,
    setGrupoMuscular,
    setNivel,
    setEntorno,
    setObjetivo,
    setModo,
    verRutina,
    iniciarEntrenamiento,
    generarRutina,
    finalizarEntrenamiento,
    cancelarEntrenamiento,
    cerrarModalRutina,
  } = useRutinas();

  if (entrenando && rutinaActiva) {
    return (
      <EntrenamientoActivo
        rutinaId={rutinaActiva.id}
        ejercicios={ejercicios}
        modo={modo}
        onFinalizar={finalizarEntrenamiento}
        onCancelar={cancelarEntrenamiento}
      />
    );
  }

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, #FF9800, #F57C00)', color: 'white' }}>
        <h3>🤖 Generador Automático</h3>
        <p>Selecciona tus preferencias y genera una rutina personalizada</p>
        <p style={{ fontSize: 12, opacity: 0.8 }}>Rutinas hoy: {rutinasHoy}/3</p>
        <button onClick={() => setMostrarGenerador(!mostrarGenerador)} className="btn btn-warning" style={{ background: 'white', color: '#FF9800' }}>
          ⚡ {mostrarGenerador ? 'Cancelar' : 'Generar Rutina'}
        </button>
      </div>

      {mostrarGenerador && (
        <GeneradorRutina
          entorno={entorno}
          setEntorno={setEntorno}
          grupoMuscular={grupoMuscular}
          setGrupoMuscular={setGrupoMuscular}
          nivel={nivel}
          setNivel={setNivel}
          objetivo={objetivo}
          setObjetivo={setObjetivo}
          modo={modo}
          setModo={setModo}
          onGenerar={generarRutina}
        />
      )}

      <h3 style={{ marginBottom: 12 }}>📋 Mis Rutinas</h3>
      {rutinas.length === 0 && <p style={{ color: '#888' }}>No tienes rutinas aún. ¡Genera una!</p>}
      {rutinas.map((r) => (
        <RutinaCard key={r.id} rutina={r} onVerDetalle={verRutina} onIniciar={iniciarEntrenamiento} />
      ))}

      {ejercicios.length > 0 && !entrenando && (
        <RutinaDetalleModal
          rutinaSeleccionada={rutinaSeleccionada}
          ejercicios={ejercicios}
          onCerrar={cerrarModalRutina}
        />
      )}
    </div>
  );
}

export default Rutinas;