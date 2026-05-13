function PointsProgress({ label, value, max = 100, detail }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className="points-progress">
      <div className="points-progress-top">
        <span>{label}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="app-progress-bar" aria-label={label}>
        <span style={{ width: `${percent}%` }} />
      </div>
      {detail ? <p>{detail}</p> : null}
    </div>
  );
}

export default PointsProgress;
