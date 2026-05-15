import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { getAllProjectsForStaff, reviewProject } from '../services/projectService.js';

const projectStatuses = ['draft', 'submitted', 'reviewed', 'showcased'];
const PAGE_SIZE = 12;

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const mergeDrafts = (nextProjects, shouldReplace = false) => {
    const nextDrafts = Object.fromEntries(nextProjects.map((project) => [
      project.id,
      {
        status: project.status,
        isPublic: project.isPublic,
        staffNote: '',
      },
    ]));

    setDrafts((current) => (shouldReplace ? nextDrafts : { ...current, ...nextDrafts }));
  };

  const loadProjects = async (nextPage = 1, { append = false } = {}) => {
    append ? setIsLoadingMore(true) : setIsLoading(true);
    setError('');

    try {
      const result = await getAllProjectsForStaff({ page: nextPage, pageSize: PAGE_SIZE });
      setProjects((current) => (append ? [...current, ...result.items] : result.items));
      mergeDrafts(result.items, !append);
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (loadError) {
      setError(loadError.message || 'Could not load projects.');
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialProjects() {
      try {
        const result = await getAllProjectsForStaff({ page: 1, pageSize: PAGE_SIZE });
        if (!isMounted) return;

        setProjects(result.items);
        mergeDrafts(result.items, true);
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Could not load projects.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialProjects();

    return () => {
      isMounted = false;
    };
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
      await loadProjects(1);
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
        {hasMore ? (
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => loadProjects(page + 1, { append: true })}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load more projects'}
          </button>
        ) : null}
      </div>
    </AppLayout>
  );
}

export default AdminProjects;
