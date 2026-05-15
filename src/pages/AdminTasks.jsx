import { useEffect, useMemo, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import {
  archiveTask,
  createTask,
  getAllTasksForStaff,
  getTaskCoursesForStaff,
  toggleTaskPublished,
  updateTask,
} from '../services/taskService.js';
import { checkRateLimit } from '../utils/rateLimit.js';

const emptyTaskForm = {
  title: '',
  description: '',
  requirementsText: '',
  points: 50,
  courseId: '',
  lessonId: '',
  dueDaysAfterEnrollment: '',
  isPublished: false,
};

function formatDate(value) {
  if (!value) return 'Not updated';
  return new Date(value).toLocaleDateString();
}

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const editingTask = useMemo(
    () => tasks.find((task) => task.id === editingTaskId),
    [tasks, editingTaskId],
  );

  const loadAdminTasks = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [nextCourses, nextTasks] = await Promise.all([
        getTaskCoursesForStaff(),
        getAllTasksForStaff(),
      ]);

      setCourses(nextCourses);
      setTasks(nextTasks);

      if (!form.courseId && nextCourses[0]?.id) {
        setForm((current) => ({ ...current, courseId: nextCourses[0].id }));
      }
    } catch (loadError) {
      setError(loadError.message || 'Could not load task manager data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTasks();
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingTaskId('');
    setForm({
      ...emptyTaskForm,
      courseId: courses[0]?.id || '',
    });
    setMessage('');
    setError('');
  };

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setMessage('');
    setError('');
    setForm({
      title: task.title,
      description: task.description,
      requirementsText: task.requirementsText,
      points: task.points,
      courseId: task.courseId,
      lessonId: task.lessonId,
      dueDaysAfterEnrollment: task.dueDaysAfterEnrollment,
      isPublished: task.isPublished,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const actionKey = editingTaskId ? `admin:task-update:${editingTaskId}` : 'admin:task-create';
    const rateLimit = checkRateLimit(actionKey, 6000);
    if (!rateLimit.allowed) {
      setError(rateLimit.message);
      return;
    }

    setIsSaving(true);

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, form);
        setMessage('Task updated.');
      } else {
        await createTask(form);
        setMessage('Task created.');
      }

      await loadAdminTasks();
      resetForm();
    } catch (saveError) {
      setError(saveError.message || 'Could not save task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (task) => {
    setMessage('');
    setError('');

    const rateLimit = checkRateLimit(`admin:task-publish:${task.id}`, 6000);
    if (!rateLimit.allowed) {
      setError(rateLimit.message);
      return;
    }

    setActiveTaskId(task.id);

    try {
      await toggleTaskPublished(task.id, !task.isPublished);
      await loadAdminTasks();
      setMessage(task.isPublished ? 'Task unpublished.' : 'Task published.');
    } catch (toggleError) {
      setError(toggleError.message || 'Could not update publish status.');
    } finally {
      setActiveTaskId('');
    }
  };

  const handleArchiveTask = async (task) => {
    setMessage('');
    setError('');

    const rateLimit = checkRateLimit(`admin:task-archive:${task.id}`, 6000);
    if (!rateLimit.allowed) {
      setError(rateLimit.message);
      return;
    }

    setActiveTaskId(task.id);

    try {
      await archiveTask(task.id);
      await loadAdminTasks();
      setMessage('Task archived.');
    } catch (archiveError) {
      setError(archiveError.message || 'Could not archive task.');
    } finally {
      setActiveTaskId('');
    }
  };

  return (
    <AppLayout
      eyebrow="Instructor Tools"
      title="Admin tasks manager"
      description="Create, edit, publish, and archive student task briefs from the website."
    >
      <div className="admin-task-manager">
        {isLoading ? <p className="auth-message">Loading task manager...</p> : null}
        {error ? <p className="auth-message is-error">{error}</p> : null}
        {message ? <p className="auth-message is-success">{message}</p> : null}

        <div className="admin-task-builder">
          <form className="admin-task-form reveal" onSubmit={handleSubmit}>
            <label>
              Task title
              <input name="title" value={form.title} onChange={updateField} required />
            </label>
            <label>
              Course
              <select name="courseId" value={form.courseId} onChange={updateField} required>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Points
              <input name="points" type="number" min="0" value={form.points} onChange={updateField} />
            </label>
            <label>
              Due days after enrollment
              <input
                name="dueDaysAfterEnrollment"
                type="number"
                min="0"
                value={form.dueDaysAfterEnrollment}
                onChange={updateField}
                placeholder="Optional"
              />
            </label>
            <label className="admin-field-wide">
              Description
              <textarea name="description" rows="4" value={form.description} onChange={updateField} />
            </label>
            <label className="admin-field-wide">
              Requirements
              <textarea
                name="requirementsText"
                rows="5"
                value={form.requirementsText}
                onChange={updateField}
                placeholder="One requirement per line"
              />
            </label>
            <label className="admin-publish-toggle admin-field-wide">
              <input
                name="isPublished"
                type="checkbox"
                checked={form.isPublished}
                onChange={updateField}
              />
              Publish this task for students
            </label>
            <div className="admin-form-actions admin-field-wide">
              <button className="btn btn-primary" type="submit" disabled={isSaving || !courses.length}>
                {isSaving ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task'}
              </button>
              {editingTaskId ? (
                <button className="btn btn-outline" type="button" onClick={resetForm} disabled={isSaving}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>

          <section className="admin-preview-panel reveal" aria-label="Task manager status">
            <p className="app-card-eyebrow">{editingTask ? 'Editing Task' : 'Task Manager'}</p>
            <h2>{editingTask ? editingTask.title : `${tasks.length} tasks`}</h2>
            <p>
              Published tasks appear for students on the task studio. Archived tasks remain saved but hidden from students.
            </p>
            <div className="tasks-stats-row">
              <span>{tasks.filter((task) => task.isPublished).length} Published</span>
              <span>{tasks.filter((task) => !task.isPublished).length} Draft</span>
            </div>
          </section>
        </div>

        <section className="tasks-section">
          <div className="app-section-heading reveal">
            <p className="app-card-eyebrow">Supabase Tasks</p>
            <h2>Manage task briefs</h2>
          </div>

          {!isLoading && tasks.length === 0 ? (
            <AppCard eyebrow="Empty" title="No tasks yet">
              <p>Create the first task brief and publish it when it is ready for students.</p>
            </AppCard>
          ) : null}

          <div className="admin-task-list">
            {tasks.map((task) => (
              <article key={task.id} className="app-card reveal admin-task-row">
                <div>
                  <p className="app-card-eyebrow">{task.courseTitle}</p>
                  <h2>{task.title}</h2>
                  <p>{task.description || 'No description yet.'}</p>
                  <div className="submission-meta-row">
                    <span>{task.isPublished ? 'Published' : 'Draft'}</span>
                    <span>{task.points} pts</span>
                    <span>{task.dueDaysAfterEnrollment || 'Flexible'} days</span>
                    <span>Updated {formatDate(task.updatedAt)}</span>
                  </div>
                </div>
                <div className="admin-task-row-actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => startEditing(task)}
                    disabled={activeTaskId === task.id || isSaving}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => handleTogglePublished(task)}
                    disabled={activeTaskId === task.id}
                  >
                    {task.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => handleArchiveTask(task)}
                    disabled={activeTaskId === task.id || !task.isPublished}
                  >
                    Archive
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

export default AdminTasks;
