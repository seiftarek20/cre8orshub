import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import { appRoadmap } from '../data/appData.js';

function Progress() {
  return (
    <AppLayout
      eyebrow="Roadmap"
      title="Progress"
      description="A premium app-style roadmap view for tracking the journey from foundation to portfolio."
    >
      <div className="app-roadmap-panel">
        {appRoadmap.map((item, index) => (
          <AppCard key={item.step} eyebrow={`Stage ${String(index + 1).padStart(2, '0')}`} title={item.step}>
            <p>{item.detail}</p>
            <div className="app-progress-bar" aria-label={`${item.step} progress`}>
              <span style={{ width: `${item.progress}%` }} />
            </div>
            <div className="app-card-footer">
              <span>Roadmap progress</span>
              <strong>{item.progress}%</strong>
            </div>
          </AppCard>
        ))}
      </div>
    </AppLayout>
  );
}

export default Progress;
