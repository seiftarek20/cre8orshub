import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { currentTasks, taskStats, weeklyChallenges } from '../data/tasks.js';

function Tasks() {
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
            <span>{taskStats.openTasks} Open</span>
            <span>{taskStats.submittedTasks} Submitted</span>
            <span>{taskStats.reviewedTasks} Reviewed</span>
            <span>{taskStats.weeklyPoints} pts</span>
          </div>
        </section>

        <section className="tasks-section">
          <div className="app-section-heading reveal">
            <p className="app-card-eyebrow">Current Tasks</p>
            <h2>Active assignments</h2>
          </div>
          <div className="task-card-grid">
            {currentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

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
