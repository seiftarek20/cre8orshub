import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { getMyTaskSubmissions } from '../services/submissionService.js';

function formatDate(value) {
  if (!value) return 'Pending';
  return new Date(value).toLocaleDateString();
}

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSubmissions() {
      setIsLoading(true);
      setLoadError('');

      try {
        const nextSubmissions = await getMyTaskSubmissions();
        if (isMounted) setSubmissions(nextSubmissions);
      } catch (error) {
        if (isMounted) setLoadError(error.message || 'Could not load submissions.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSubmissions();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppLayout
      eyebrow="Submissions"
      title="Your task submissions"
      description="Track submitted work, review status, feedback, and scores."
    >
      <div className="submissions-page-shell">
        {isLoading ? <p className="auth-message">Loading your submissions...</p> : null}
        {loadError ? <p className="auth-message is-error">{loadError}</p> : null}
        {!isLoading && !loadError && submissions.length === 0 ? (
          <AppCard eyebrow="Empty" title="No submissions yet">
            <p>Submit a task from the tasks studio and it will appear here.</p>
          </AppCard>
        ) : null}

        <div className="submission-card-grid">
          {submissions.map((submission) => (
            <AppCard key={submission.id} eyebrow={submission.courseTitle} title={submission.taskTitle}>
              <div className="submission-meta-row">
                <span>{submission.status}</span>
                <span>{submission.points} pts</span>
                <span>{formatDate(submission.submittedAt)}</span>
              </div>
              <p>{submission.submissionText}</p>
              {submission.projectUrl ? (
                <a className="submission-link" href={submission.projectUrl} target="_blank" rel="noreferrer">
                  Open project link
                </a>
              ) : null}
              {submission.feedback ? <p className="auth-message">Feedback: {submission.feedback}</p> : null}
              {submission.score !== null && submission.score !== undefined ? (
                <p className="app-muted">Score: {submission.score}/100</p>
              ) : null}
            </AppCard>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Submissions;
