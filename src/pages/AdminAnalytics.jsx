import { useEffect, useMemo, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { getAdminAnalytics } from '../services/analyticsService.js';

function formatDate(value) {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString();
}

function ActivityList({ items, emptyLabel }) {
  if (!items.length) {
    return <p className="app-muted">{emptyLabel}</p>;
  }

  return (
    <div className="analytics-activity-list">
      {items.map((item) => (
        <div key={item.id} className="app-list-row">
          <div>
            <strong>{item.title}</strong>
            <span>{item.meta}</span>
          </div>
          <em>{item.status} · {formatDate(item.createdAt)}</em>
        </div>
      ))}
    </div>
  );
}

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAnalytics() {
      setIsLoading(true);
      setError('');

      try {
        const nextAnalytics = await getAdminAnalytics();
        if (isMounted) setAnalytics(nextAnalytics);
      } catch (loadError) {
        if (isMounted) setError(loadError.message || 'Could not load analytics.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = useMemo(() => {
    const stats = analytics?.stats || {};

    return [
      ['Users', stats.totalUsers],
      ['Bookings', stats.totalBookingRequests],
      ['Tasks', stats.totalTasks],
      ['Submissions', stats.totalSubmissions],
      ['Approved', stats.approvedSubmissions],
      ['Projects', stats.totalProjects],
      ['Showcased', stats.showcasedProjects],
      ['Reward Points', stats.totalRewardPointsAwarded],
    ];
  }, [analytics]);

  return (
    <AppLayout
      eyebrow="Admin Analytics"
      title="Platform activity"
      description="A quiet overview of users, bookings, tasks, submissions, projects, and rewards."
    >
      <div className="analytics-page-shell">
        {isLoading ? <p className="auth-message">Loading analytics...</p> : null}
        {error ? <p className="auth-message is-error">{error}</p> : null}

        <section className="analytics-stat-grid">
          {statCards.map(([label, value]) => (
            <article key={label} className="app-card reveal analytics-stat-card">
              <p className="app-card-eyebrow">{label}</p>
              <h2>{Number(value || 0).toLocaleString()}</h2>
            </article>
          ))}
        </section>

        <section className="analytics-recent-grid">
          <AppCard eyebrow="Latest" title="Booking requests">
            <ActivityList
              items={analytics?.latestBookingRequests || []}
              emptyLabel="No booking requests available yet."
            />
          </AppCard>

          <AppCard eyebrow="Latest" title="Task submissions">
            <ActivityList
              items={analytics?.latestSubmissions || []}
              emptyLabel="No submissions available yet."
            />
          </AppCard>

          <AppCard eyebrow="Latest" title="Projects">
            <ActivityList
              items={analytics?.latestProjects || []}
              emptyLabel="No projects available yet."
            />
          </AppCard>
        </section>
      </div>
    </AppLayout>
  );
}

export default AdminAnalytics;
