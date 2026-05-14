import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import {
  getAllTaskSubmissionsForReview,
  updateSubmissionReview,
} from '../services/submissionService.js';

const reviewStatuses = ['submitted', 'needs_revision', 'reviewed', 'approved'];

function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSaveId, setActiveSaveId] = useState('');
  const [loadError, setLoadError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const loadSubmissions = async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const nextSubmissions = await getAllTaskSubmissionsForReview();
      setSubmissions(nextSubmissions);
      setDrafts(Object.fromEntries(nextSubmissions.map((submission) => [
        submission.id,
        {
          status: submission.status,
          feedback: submission.feedback || '',
          score: submission.score ?? '',
        },
      ])));
    } catch (error) {
      setLoadError(error.message || 'Could not load submissions for review.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const updateDraft = (submissionId, field, value) => {
    setDrafts((current) => ({
      ...current,
      [submissionId]: {
        ...current[submissionId],
        [field]: value,
      },
    }));
  };

  const saveReview = async (submissionId) => {
    setActiveSaveId(submissionId);
    setSaveMessage('');
    setLoadError('');

    try {
      const reviewedSubmission = await updateSubmissionReview(submissionId, drafts[submissionId]);
      await loadSubmissions();
      setSaveMessage(
        reviewedSubmission.rewardsUpdated
          ? 'Submission reviewed and rewards updated.'
          : 'Submission reviewed. Rewards were already up to date.',
      );
    } catch (error) {
      setLoadError(error.message || 'Could not save review.');
    } finally {
      setActiveSaveId('');
    }
  };

  return (
    <AppLayout
      eyebrow="Instructor Review"
      title="Task submissions"
      description="Review student submissions, leave feedback, and update status."
    >
      <div className="submissions-page-shell">
        {isLoading ? <p className="auth-message">Loading submissions...</p> : null}
        {loadError ? <p className="auth-message is-error">{loadError}</p> : null}
        {saveMessage ? <p className="auth-message is-success">{saveMessage}</p> : null}
        {!isLoading && !loadError && submissions.length === 0 ? (
          <AppCard eyebrow="Empty" title="No submissions yet">
            <p>Student submissions will appear here when tasks are submitted.</p>
          </AppCard>
        ) : null}

        <div className="submission-review-list">
          {submissions.map((submission) => {
            const draft = drafts[submission.id] || {};

            return (
              <article key={submission.id} className="app-card reveal submission-review-card">
                <header className="app-card-header">
                  <p className="app-card-eyebrow">{submission.courseTitle}</p>
                  <h2>{submission.taskTitle}</h2>
                </header>
                <div className="submission-meta-row">
                  <span>{submission.studentName}</span>
                  <span>{submission.status}</span>
                  <span>{submission.score ?? 'No score'}</span>
                </div>
                <p>{submission.submissionText}</p>
                {submission.projectUrl ? (
                  <a className="submission-link" href={submission.projectUrl} target="_blank" rel="noreferrer">
                    Open project link
                  </a>
                ) : null}

                <form className="admin-task-form submission-review-form">
                  <label>
                    Status
                    <select
                      value={draft.status || 'submitted'}
                      onChange={(event) => updateDraft(submission.id, 'status', event.target.value)}
                    >
                      {reviewStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Score
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={draft.score ?? ''}
                      onChange={(event) => updateDraft(submission.id, 'score', event.target.value)}
                    />
                  </label>
                  <label className="admin-field-wide">
                    Feedback
                    <textarea
                      rows="4"
                      value={draft.feedback || ''}
                      onChange={(event) => updateDraft(submission.id, 'feedback', event.target.value)}
                    />
                  </label>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => saveReview(submission.id)}
                    disabled={activeSaveId === submission.id}
                  >
                    {activeSaveId === submission.id ? 'Saving...' : 'Save Review'}
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

export default AdminSubmissions;
