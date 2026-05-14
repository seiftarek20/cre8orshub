import { useEffect, useMemo, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { currentTasks, taskStats, weeklyChallenges } from '../data/tasks.js';
import {
  createTaskSubmission,
  getStudentTasks,
  updateMySubmissionIfAllowed,
} from '../services/taskService.js';

function Tasks() {
  const { user } = useAuth();
  const [backendTasks, setBackendTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ submissionText: '', projectUrl: '' });
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshTasks = async () => {
    if (!user?.id) return;

    const tasks = await getStudentTasks(user.id);
    setBackendTasks(tasks);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadTasks() {
      if (!user?.id) {
        setBackendTasks([]);
        setLoadError('');
        return;
      }

      setIsLoading(true);
      setLoadError('');

      try {
        const tasks = await getStudentTasks(user.id);
        if (isMounted) setBackendTasks(tasks);
      } catch (error) {
        if (isMounted) {
          setBackendTasks([]);
          setLoadError(error.message || 'Could not load live tasks.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTasks();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const tasks = backendTasks.length ? backendTasks : currentTasks;
  const isUsingFallback = !backendTasks.length;
  const liveStats = useMemo(() => {
    if (!backendTasks.length) return taskStats;

    return {
      openTasks: backendTasks.filter((task) => task.status === 'Open').length,
      submittedTasks: backendTasks.filter((task) => task.status === 'Submitted').length,
      reviewedTasks: backendTasks.filter((task) => task.status === 'Reviewed').length,
      weeklyPoints: backendTasks.reduce((total, task) => total + (task.points || 0), 0),
    };
  }, [backendTasks]);

  const openSubmissionModal = (task) => {
    setActiveTask(task);
    setSubmissionError('');
    setSubmissionForm({
      submissionText: task.submission?.text || '',
      projectUrl: task.submission?.projectUrl || '',
    });
  };

  const closeSubmissionModal = () => {
    if (isSubmitting) return;
    setActiveTask(null);
    setSubmissionError('');
  };

  const updateSubmissionField = (event) => {
    setSubmissionForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmission = async (event) => {
    event.preventDefault();

    if (!activeTask) return;

    setSubmissionError('');
    setIsSubmitting(true);

    try {
      if (activeTask.submission?.id) {
        await updateMySubmissionIfAllowed(activeTask.submission.id, submissionForm);
      } else {
        await createTaskSubmission(activeTask.id, submissionForm.submissionText, submissionForm.projectUrl);
      }

      await refreshTasks();
      setActiveTask(null);
    } catch (error) {
      setSubmissionError(error.message || 'Could not save your submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      eyebrow="Tasks Studio"
      title="Tasks and weekly challenges"
      description="A focused workspace for assignments, submissions, review status, and reward points."
    >
      <div className="tasks-page-shell">
        <section className="tasks-hero-panel reveal">
          <div>
            <p className="app-card-eyebrow">This week</p>
            <h2>Build momentum with calm, focused creative work.</h2>
            <p>
              Pick a task, follow the brief, and submit your project when the upload flow is connected later.
            </p>
          </div>
          <div className="tasks-stats-row">
            <span>{liveStats.openTasks} Open</span>
            <span>{liveStats.submittedTasks} Submitted</span>
            <span>{liveStats.reviewedTasks} Reviewed</span>
            <span>{liveStats.weeklyPoints} pts</span>
          </div>
        </section>

        {isLoading ? <p className="auth-message">Loading your latest tasks...</p> : null}
        {loadError ? <p className="auth-message is-error">Live tasks are unavailable, so the studio is showing starter tasks.</p> : null}

        <section className="tasks-section">
          <div className="app-section-heading reveal">
            <p className="app-card-eyebrow">{isUsingFallback ? 'Current Tasks' : 'Live Tasks'}</p>
            <h2>Active assignments</h2>
          </div>
          <div className="task-card-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                canSubmit={!isUsingFallback}
                onSubmitTask={openSubmissionModal}
              />
            ))}
          </div>
        </section>

        {isUsingFallback ? (
          <section className="tasks-section">
            <div className="app-section-heading reveal">
              <p className="app-card-eyebrow">Weekly Challenges</p>
              <h2>Limited creative prompts</h2>
            </div>
            <div className="task-card-grid is-compact">
              {weeklyChallenges.map((task) => (
                <TaskCard key={task.id} task={task} canSubmit={false} />
              ))}
            </div>
          </section>
        ) : null}

        <AppCard eyebrow="Submission note" title="Project upload is a placeholder">
          <p>
            The Submit Project buttons are visual only for now. Real upload, review, and feedback flows can connect later
            when the backend and student accounts are added.
          </p>
        </AppCard>
      </div>

      {activeTask ? (
        <div className="app-modal-backdrop" role="presentation" onMouseDown={closeSubmissionModal}>
          <section
            className="app-modal-panel reveal show"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="app-modal-close" type="button" onClick={closeSubmissionModal} aria-label="Close">
              Close
            </button>
            <p className="app-card-eyebrow">{activeTask.category}</p>
            <h2 id="submission-modal-title">{activeTask.title}</h2>
            {activeTask.submission ? (
              <p className="app-muted">Current status: {activeTask.status}</p>
            ) : null}
            <form className="admin-task-form submission-form" onSubmit={handleSubmission}>
              <label className="admin-field-wide">
                Submission notes
                <textarea
                  name="submissionText"
                  value={submissionForm.submissionText}
                  onChange={updateSubmissionField}
                  rows="6"
                  required
                  placeholder="Describe what you made, your process, and anything you want reviewed."
                />
              </label>
              <label className="admin-field-wide">
                Project link
                <input
                  name="projectUrl"
                  type="url"
                  value={submissionForm.projectUrl}
                  onChange={updateSubmissionField}
                  placeholder="https://..."
                />
              </label>
              {activeTask.submission?.feedback ? (
                <p className="auth-message">Feedback: {activeTask.submission.feedback}</p>
              ) : null}
              {submissionError ? <p className="auth-message is-error">{submissionError}</p> : null}
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : activeTask.submission ? 'Update Submission' : 'Submit Task'}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </AppLayout>
  );
}

export default Tasks;
