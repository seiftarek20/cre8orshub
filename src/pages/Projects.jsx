import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { appProjects } from '../data/appData.js';
import {
  createProject,
  deleteMyProject,
  getMyProjects,
  getProjectCourses,
  updateMyProject,
} from '../services/projectService.js';

const emptyProjectForm = {
  title: '',
  description: '',
  courseId: '',
  coverUrl: '',
  projectUrl: '',
  status: 'draft',
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [useFallback, setUseFallback] = useState(false);

  const loadProjects = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [nextProjects, nextCourses] = await Promise.all([
        getMyProjects(),
        getProjectCourses(),
      ]);
      setProjects(nextProjects);
      setCourses(nextCourses);
      setUseFallback(false);
    } catch (loadError) {
      setProjects([]);
      setUseFallback(true);
      setError(loadError.message || 'Could not load live projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setEditingProjectId('');
    setForm(emptyProjectForm);
    setMessage('');
  };

  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setMessage('');
    setError('');
    setForm({
      title: project.title,
      description: project.description,
      courseId: project.courseId,
      coverUrl: project.coverUrl,
      projectUrl: project.projectUrl,
      status: project.status,
    });
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');

    try {
      if (editingProjectId) {
        await updateMyProject(editingProjectId, form);
        setMessage('Project updated.');
      } else {
        await createProject(form);
        setMessage('Project created.');
      }

      await loadProjects();
      resetForm();
    } catch (saveError) {
      setError(saveError.message || 'Could not save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const submitProject = async (project) => {
    setActiveProjectId(project.id);
    setMessage('');
    setError('');

    try {
      await updateMyProject(project.id, { ...project, status: 'submitted' });
      await loadProjects();
      setMessage('Project submitted for review.');
    } catch (submitError) {
      setError(submitError.message || 'Could not submit project.');
    } finally {
      setActiveProjectId('');
    }
  };

  const deleteProject = async (project) => {
    setActiveProjectId(project.id);
    setMessage('');
    setError('');

    try {
      await deleteMyProject(project.id);
      await loadProjects();
      setMessage('Draft project deleted.');
    } catch (deleteError) {
      setError(deleteError.message || 'Only draft projects can be deleted.');
    } finally {
      setActiveProjectId('');
    }
  };

  return (
    <AppLayout
      eyebrow="Portfolio Studio"
      title="Projects"
      description="Create portfolio projects, submit them for review, and prepare your best work for showcase."
    >
      <div className="projects-page-shell">
        {isLoading ? <p className="auth-message">Loading your projects...</p> : null}
        {error ? <p className="auth-message is-error">{useFallback ? 'Live projects are unavailable, so starter projects are shown.' : error}</p> : null}
        {message ? <p className="auth-message is-success">{message}</p> : null}

        {!useFallback ? (
          <form className="admin-task-form project-editor-form reveal" onSubmit={saveProject}>
            <label>
              Project title
              <input name="title" value={form.title} onChange={updateField} required />
            </label>
            <label>
              Course
              <select name="courseId" value={form.courseId} onChange={updateField}>
                <option value="">No course selected</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field-wide">
              Description
              <textarea name="description" rows="4" value={form.description} onChange={updateField} />
            </label>
            <label>
              Project link
              <input name="projectUrl" type="url" value={form.projectUrl} onChange={updateField} placeholder="https://..." />
            </label>
            <label>
              Cover image URL
              <input name="coverUrl" type="url" value={form.coverUrl} onChange={updateField} placeholder="https://..." />
            </label>
            <div className="admin-form-actions admin-field-wide">
              <button className="btn btn-primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingProjectId ? 'Update Project' : 'Create Project'}
              </button>
              {editingProjectId ? (
                <button className="btn btn-outline" type="button" onClick={resetForm} disabled={isSaving}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </form>
        ) : null}

        {useFallback ? (
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
        ) : (
          <div className="project-card-grid">
            {!isLoading && projects.length === 0 ? (
              <AppCard eyebrow="Empty" title="No projects yet">
                <p>Create your first project draft and submit it when it is ready for review.</p>
              </AppCard>
            ) : null}

            {projects.map((project) => (
              <article key={project.id} className="app-card reveal project-manage-card">
                {project.coverUrl ? (
                  <img className="project-cover" src={project.coverUrl} alt="" />
                ) : (
                  <div className="app-project-preview" aria-hidden="true">
                    <span />
                  </div>
                )}
                <header className="app-card-header">
                  <p className="app-card-eyebrow">{project.courseTitle}</p>
                  <h2>{project.title}</h2>
                </header>
                <p>{project.description || 'No description yet.'}</p>
                <div className="submission-meta-row">
                  <span>{project.status}</span>
                  <span>{project.isPublic ? 'Public' : 'Private'}</span>
                </div>
                {project.projectUrl ? (
                  <a className="submission-link" href={project.projectUrl} target="_blank" rel="noreferrer">
                    Open project
                  </a>
                ) : null}
                <div className="admin-task-row-actions">
                  <button className="btn btn-outline" type="button" onClick={() => startEditing(project)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => submitProject(project)}
                    disabled={activeProjectId === project.id || !['draft', 'submitted'].includes(project.status)}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={() => deleteProject(project)}
                    disabled={activeProjectId === project.id || project.status !== 'draft'}
                  >
                    Delete Draft
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Projects;
