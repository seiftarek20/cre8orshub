import { Link } from 'react-router-dom';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { appActivity, appCourses, appTasks, studentSnapshot } from '../data/appData.js';

function Dashboard() {
  return (
    <AppLayout
      eyebrow="Student Workspace"
      title={`Welcome back, ${studentSnapshot.name}`}
      description="A calm command center for your courses, projects, and creative progress."
      action={
        <Link className="btn btn-primary" to="/my-courses">
          Continue Learning
        </Link>
      }
    >
      <div className="app-dashboard-grid">
        <AppCard eyebrow="Overall progress" title={`${studentSnapshot.overallProgress}% complete`} className="app-card-feature">
          <div className="app-progress-bar" aria-label="Overall progress">
            <span style={{ width: `${studentSnapshot.overallProgress}%` }} />
          </div>
          <p>{studentSnapshot.focus}</p>
          <p className="app-muted">Weekly goal: {studentSnapshot.weeklyGoal}</p>
        </AppCard>

        <AppCard eyebrow="Next lesson" title={studentSnapshot.nextLesson.title}>
          <div className="app-meta-list">
            <span>{studentSnapshot.nextLesson.course}</span>
            <span>{studentSnapshot.nextLesson.duration}</span>
            <span>{studentSnapshot.nextLesson.due}</span>
          </div>
        </AppCard>

        <AppCard eyebrow="Today" title="Tasks">
          <div className="app-list">
            {appTasks.map((task) => (
              <div key={task.title} className="app-list-row">
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.meta}</span>
                </div>
                <em>{task.state}</em>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard eyebrow="Active tracks" title="My courses">
          <div className="app-mini-course-list">
            {appCourses.slice(0, 2).map((course) => (
              <div key={course.title} className="app-mini-course">
                <div>
                  <strong>{course.title}</strong>
                  <span>{course.lessons}</span>
                </div>
                <span>{course.progress}%</span>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard eyebrow="Recent activity" title="Studio updates">
          <div className="app-activity-list">
            {appActivity.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </AppCard>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
