import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { getAllProjectsForStaff, reviewProject } from '../services/projectService.js';

const projectStatuses = ['draft', 'submitted', 'reviewed', 'showcased'];

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProjects = async () => {
    setIsLoading(true);
    setError('');

    try {
      const nextProjects = await getAllProjectsForStaff();
      setProjects(nextProjects);
      setDrafts(Object.fromEntries(nextProjects.map((project) => [
        project.id,
        {
          status: project.status,
          isPublic: project.isPublic,
          staffNote: '',
        },
      ])));
    } catch (loadError) {
      setError(loadError.message || 'Could not load projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const updateDraft = (projectId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [projectId]: {
        ...current[projectId],
        [field]: value,
      },
    }));
  };

  const saveReview = async (projectId) => {
    setActiveProjectId(projectId);
    setMessage('');
    setError('');

    try {
      await reviewProject(projectId, drafts[projectId]);
      await loadProjects();
      setMessage('Project review saved.');
    } catch (reviewError) {
      setError(reviewError.message || 'Could not review project.');
    } finally {
      setActiveProjectId('');
    }
  };

  return (
    <AppLayout
      eyebrow="Portfolio Review"
      title="Admin projects"
      description="Review student portfolio projects and approve showcased work."
    >
      <div className="projects-page-shell">
        {isLoading ? <p className="auth-message">Loading projects...</p> : null}
        {error ? <p className="auth-message is-error">{error}</p> : null}
        {message ? <p className="auth-message is-success">{message}</p> : null}

        {!isLoading && !error && projects.length === 0 ? (
          <AppCard eyebrow="Empty" title="No projects yet">
            <p>Submitted student projects will appear here when they are ready for review.</p>
          </AppCard>
        ) : null}

        <div className="submission-review-list">
          {projects.map((project) => {
            const draft = drafts[project.id] || {};

            return (
              <article key={project.id} className="app-card reveal project-review-card">
                {project.coverUrl ? <img className="project-cover" src={project.coverUrl} alt="" /> : null}
                <header className="app-card-header">
                  <p className="app-card-eyebrow">{project.courseTitle}</p>
                  <h2>{project.title}</h2>
                </header>
                <div className="submission-meta-row">
                  <span>{project.studentName}</span>
                  <span>{project.status}</span>
                  <span>{project.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <p>{project.description || 'No description.'}</p>
                {project.projectUrl ? (
                  <a className="submission-link" href={project.projectUrl} target="_blank" rel="noreferrer">
                    Open project
                  </a>
                ) : null}

                <form className="admin-task-form project-review-form">
                  <label>
                    Status
                    <select
                      value={draft.status || project.status}
                      onChange={(event) => updateDraft(project.id, 'status', event.target.value)}
                    >
                      {projectStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-publish-toggle">
                    <input
                      type="checkbox"
                      checked={Boolean(draft.isPublic)}
                      onChange={(event) => updateDraft(project.id, 'isPublic', event.target.checked)}
                    />
                    Public showcase
                  </label>
                  <label className="admin-field-wide">
                    Staff note
                    <textarea
                      rows="3"
                      value={draft.staffNote || ''}
                      onChange={(event) => updateDraft(project.id, 'staffNote', event.target.value)}
                      placeholder="UI-only note. The current projects table has no feedback column."
                    />
                  </label>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => saveReview(project.id)}
                    disabled={activeProjectId === project.id}
                  >
                    {activeProjectId === project.id ? 'Saving...' : 'Save Review'}
                  </button>
                </form>
              </article>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

export default AdminProjects;
