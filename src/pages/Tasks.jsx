import { useEffect, useMemo, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { currentTasks, taskStats, weeklyChallenges } from '../data/tasks.js';
import { getStudentTasks } from '../services/taskService.js';

function Tasks() {
  const { user } = useAuth();
  const [backendTasks, setBackendTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

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
              <TaskCard key={task.id} task={task} />
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
                <TaskCard key={task.id} task={task} />
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
    </AppLayout>
  );
}

export default Tasks;
