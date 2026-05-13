import { useMemo, useState } from 'react';
import TaskCard from './TaskCard.jsx';

const initialTask = {
  id: 'preview-task',
  title: 'Cinematic Assignment Brief',
  category: 'Motion Graphics',
  difficulty: 'Intermediate',
  deadline: '2026-05-20',
  points: 150,
  status: 'Open',
  description: 'Create a clear task brief for students with a focused creative outcome.',
  requirementsText: 'Submit final export\nInclude source file\nWrite a short reflection',
};

function AdminTaskForm() {
  const [task, setTask] = useState(initialTask);

  const previewTask = useMemo(
    () => ({
      ...task,
      points: Number(task.points) || 0,
      requirements: task.requirementsText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }),
    [task],
  );

  const updateTask = (event) => {
    const { name, value } = event.target;
    setTask((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Real task saving will connect here later to the backend/database.
  };

  return (
    <div className="admin-task-builder">
      <form className="admin-task-form reveal" onSubmit={handleSubmit}>
        <label>
          Task title
          <input name="title" value={task.title} onChange={updateTask} />
        </label>
        <label>
          Category
          <select name="category" value={task.category} onChange={updateTask}>
            <option>Motion Graphics</option>
            <option>Video Editing</option>
            <option>Graphic Design</option>
            <option>Creative Direction</option>
            <option>Research</option>
          </select>
        </label>
        <label>
          Difficulty
          <select name="difficulty" value={task.difficulty} onChange={updateTask}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Points
          <input name="points" type="number" min="0" value={task.points} onChange={updateTask} />
        </label>
        <label>
          Deadline
          <input name="deadline" type="date" value={task.deadline} onChange={updateTask} />
        </label>
        <label>
          Status
          <select name="status" value={task.status} onChange={updateTask}>
            <option>Open</option>
            <option>Submitted</option>
            <option>Reviewed</option>
          </select>
        </label>
        <label className="admin-field-wide">
          Description
          <textarea name="description" rows="4" value={task.description} onChange={updateTask} />
        </label>
        <label className="admin-field-wide">
          Requirements
          <textarea name="requirementsText" rows="5" value={task.requirementsText} onChange={updateTask} />
        </label>
        <button className="btn btn-primary admin-field-wide" type="submit">
          Preview Only
        </button>
      </form>

      <section className="admin-preview-panel reveal" aria-label="Preview task card">
        <p className="app-card-eyebrow">Preview Task Card</p>
        <TaskCard task={previewTask} />
      </section>
    </div>
  );
}

export default AdminTaskForm;
