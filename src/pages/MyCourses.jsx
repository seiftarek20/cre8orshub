import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { appCourses } from '../data/appData.js';

function MyCourses() {
  return (
    <AppLayout
      eyebrow="Learning"
      title="My Courses"
      description="Your active creative tracks, next lessons, and visible course momentum."
    >
      <div className="app-grid-3">
        {appCourses.map((course) => (
          <AppCard key={course.title} eyebrow={course.status} title={course.title} className="app-course-card">
            <p>{course.next}</p>
            <div className="app-progress-bar" aria-label={`${course.title} progress`}>
              <span style={{ width: `${course.progress}%` }} />
            </div>
            <div className="app-card-footer">
              <span>{course.lessons}</span>
              <strong>{course.progress}%</strong>
            </div>
          </AppCard>
        ))}
      </div>
    </AppLayout>
  );
}

export default MyCourses;
