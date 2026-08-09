function ProgressBar({ progreso, color = '#4CAF50' }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progreso}%`, background: color }}></div>
    </div>
  );
}

export default ProgressBar;
