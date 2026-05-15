import { useEffect, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import {
  getAllTaskSubmissionsForReview,
  updateSubmissionReview,
} from '../services/submissionService.js';
import { checkRateLimit } from '../utils/rateLimit.js';

const reviewStatuses = ['submitted', 'needs_revision', 'reviewed', 'approved'];
const PAGE_SIZE = 12;

function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeSaveId, setActiveSaveId] = useState('');
  const [loadError, setLoadError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const mergeDrafts = (nextSubmissions, shouldReplace = false) => {
    const nextDrafts = Object.fromEntries(nextSubmissions.map((submission) => [
      submission.id,
      {
        status: submission.status,
        feedback: submission.feedback || '',
        score: submission.score ?? '',
      },
    ]));

    setDrafts((current) => (shouldReplace ? nextDrafts : { ...current, ...nextDrafts }));
  };

  const loadSubmissions = async (nextPage = 1, { append = false } = {}) => {
    append ? setIsLoadingMore(true) : setIsLoading(true);
    setLoadError('');

    try {
      const result = await getAllTaskSubmissionsForReview({ page: nextPage, pageSize: PAGE_SIZE });
      setSubmissions((current) => (append ? [...current, ...result.items] : result.items));
      mergeDrafts(result.items, !append);
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch (error) {
      setLoadError(error.message || 'Could not load submissions for review.');
    } finally {
      append ? setIsLoadingMore(false) : setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadInitialSubmissions() {
      try {
        const result = await getAllTaskSubmissionsForReview({ page: 1, pageSize: PAGE_SIZE });
        if (!isMounted) return;

        setSubmissions(result.items);
        mergeDrafts(result.items, true);
        setPage(result.page);
        setHasMore(result.hasMore);
      } catch (error) {
        if (isMounted) setLoadError(error.message || 'Could not load submissions for review.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadInitialSubmissions();

    return () => {
      isMounted = false;
    };
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
    setSaveMessage('');
    setLoadError('');

    const rateLimit = checkRateLimit(`admin:submission-review:${submissionId}`, 6000);
    if (!rateLimit.allowed) {
      setLoadError(rateLimit.message);
      return;
    }

    setActiveSaveId(submissionId);

    try {
      const reviewedSubmission = await updateSubmissionReview(submissionId, drafts[submissionId]);
      await loadSubmissions(1);
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
        {hasMore ? (
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => loadSubmissions(page + 1, { append: true })}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load more submissions'}
          </button>
        ) : null}
      </div>
    </AppLayout>
  );
}

export default AdminSubmissions;
