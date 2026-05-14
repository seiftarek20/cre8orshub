import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppCard from '../components/AppCard.jsx';
import { getPublicShowcaseProjects } from '../services/projectService.js';

function StudentWork() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadShowcase() {
      try {
        const showcasedProjects = await getPublicShowcaseProjects();
        if (isMounted) setProjects(showcasedProjects);
      } catch (error) {
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadShowcase();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="section-block page-top">
      <div className="section-heading reveal">
        <p className="eyebrow">Student work</p>
        <h1>{projects.length ? 'Showcased creator projects.' : 'Gallery coming together.'}</h1>
        <p>
          {projects.length
            ? 'Featured work from Cre8ors Hub creators, reviewed and approved for showcase.'
            : 'Weâ€™re curating featured pieces from Cre8ors Hub creators. Check back soonâ€”or start building your own reel with a course track.'}
        </p>
      </div>

      {isLoading ? <p className="auth-message">Loading student work...</p> : null}

      {projects.length ? (
        <div className="student-work-grid reveal show">
          {projects.map((project) => (
            <AppCard key={project.id} eyebrow={project.courseTitle} title={project.title} className="app-project-card">
              {project.coverUrl ? (
                <img className="project-cover" src={project.coverUrl} alt="" />
              ) : (
                <div className="app-project-preview" aria-hidden="true">
                  <span />
                </div>
              )}
              <p>{project.description}</p>
              <div className="app-card-footer">
                <span>{project.studentName}</span>
                {project.projectUrl ? (
                  <a className="submission-link" href={project.projectUrl} target="_blank" rel="noreferrer">
                    View
                  </a>
                ) : null}
              </div>
            </AppCard>
          ))}
        </div>
      ) : (
        <div className="he-student-cta reveal">
          <Link className="btn btn-primary" to="/courses">
            Explore courses
          </Link>
          <Link className="btn btn-outline" to="/booking">
            Book a call
          </Link>
        </div>
      )}
    </div>
  );
}

export default StudentWork;
