function TaskCard({ task }) {
  return (
    <article className={`task-card reveal task-status-${task.status.toLowerCase()}`}>
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
          {task.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      </div>
      <button className="btn btn-outline task-submit-btn" type="button">
        Submit Project
      </button>
    </article>
  );
}

export default TaskCard;
