function Timer({ segundos, colorBase, onPausar }) {
  return (
    <div>
      <h1 style={{ fontSize: 60, color: segundos <= 3 ? '#f44336' : colorBase }}>{segundos}s</h1>
      <button onClick={onPausar} className="btn btn-warning">⏸️ Pausar</button>
    </div>
  );
}

export default Timer;
