import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { appProjects } from '../data/appData.js';

function Projects() {
  return (
    <AppLayout
      eyebrow="Portfolio Studio"
      title="Projects"
      description="Static project placeholders for the future student workspace and review flow."
    >
      <div className="app-grid-3">
        {appProjects.map((project) => (
          <AppCard key={project.title} eyebrow={project.type} title={project.title} className="app-project-card">
            <div className="app-project-preview" aria-hidden="true">
              <span />
            </div>
            <div className="app-progress-bar" aria-label={`${project.title} progress`}>
              <span style={{ width: `${project.progress}%` }} />
            </div>
            <div className="app-card-footer">
              <span>{project.status}</span>
              <strong>{project.progress}%</strong>
            </div>
          </AppCard>
        ))}
      </div>
    </AppLayout>
  );
}

export default Projects;
