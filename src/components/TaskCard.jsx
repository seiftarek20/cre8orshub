function TaskCard({ task, onSubmitTask, canSubmit = true }) {
  const statusClass = task.status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const isFinal = ['approved', 'reviewed'].includes(task.rawStatus);
  const buttonLabel = task.submission ? 'View Submission' : 'Submit Task';

  return (
    <article className={`task-card reveal task-status-${statusClass}`}>
      <div className="task-card-topline">
        <span>{task.category}</span>
        <strong>{task.status}</strong>
      </div>
      <header className="task-card-header">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
      </header>
      <div className="task-meta-grid">
        <span>{task.difficulty}</span>
        <span>Due {task.deadline}</span>
        <span>{task.points} pts</span>
      </div>
      <div className="task-requirements">
        <p>Requirements</p>
        <ul>
          {(task.requirements || []).map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-outline task-submit-btn"
        type="button"
        onClick={() => onSubmitTask?.(task)}
        disabled={!canSubmit || isFinal}
      >
        {isFinal ? task.status : buttonLabel}
      </button>
    </article>
  );
}

export default TaskCard;
