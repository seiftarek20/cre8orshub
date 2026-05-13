import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import PointsProgress from '../components/PointsProgress.jsx';
import RewardBadge from '../components/RewardBadge.jsx';
import {
  achievements,
  badges,
  creatorLevels,
  pointsSummary,
  rewardsActivity,
  unlockableRewards,
} from '../data/rewards.js';

function Rewards() {
  return (
    <AppLayout
      eyebrow="Rewards"
      title="Points, badges, and achievements"
      description="A lightweight rewards layer prepared for future student accounts and real progress tracking."
    >
      <div className="rewards-page-shell">
        <section className="rewards-balance-panel reveal">
          <div>
            <p className="app-card-eyebrow">Points Balance</p>
            <h2>{pointsSummary.balance.toLocaleString()} pts</h2>
            <p>
              Current level: <strong>{pointsSummary.currentLevel}</strong>
            </p>
          </div>
          <PointsProgress
            label={`Progress to ${pointsSummary.nextLevel}`}
            value={pointsSummary.levelProgress}
            detail={`${100 - pointsSummary.levelProgress}% left until the next level unlocks.`}
          />
        </section>

        <section className="rewards-level-strip reveal" aria-label="Creator levels">
          {creatorLevels.map((level) => (
            <span key={level} className={level === pointsSummary.currentLevel ? 'is-active' : ''}>
              {level}
            </span>
          ))}
        </section>

        <section className="rewards-section">
          <div className="app-section-heading reveal">
            <p className="app-card-eyebrow">Badges</p>
            <h2>Creator milestones</h2>
          </div>
          <div className="reward-badge-grid">
            {badges.map((badge) => (
              <RewardBadge key={badge.title} badge={badge} />
            ))}
          </div>
        </section>

        <div className="rewards-grid">
          <AppCard eyebrow="Achievements" title="Recent wins">
            <div className="rewards-list">
              {achievements.map((achievement) => (
                <div key={achievement.title} className="rewards-list-row">
                  <div>
                    <strong>{achievement.title}</strong>
                    <span>{achievement.date}</span>
                  </div>
                  <em>{achievement.points}</em>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard eyebrow="Streak" title={`${pointsSummary.streak} days`}>
            <p>Keep submitting small polished work each week to protect the streak and earn extra points.</p>
            <div className="streak-dots" aria-label={`${pointsSummary.streak} day streak`}>
              {Array.from({ length: 9 }, (_, index) => (
                <span key={index} />
              ))}
            </div>
          </AppCard>

          <AppCard eyebrow="Unlockable Rewards" title="Spend points">
            <div className="rewards-list">
              {unlockableRewards.map((reward) => (
                <div key={reward.title} className="rewards-list-row">
                  <div>
                    <strong>{reward.title}</strong>
                    <span>{reward.status}</span>
                  </div>
                  <em>{reward.cost} pts</em>
                </div>
              ))}
            </div>
          </AppCard>

          <AppCard eyebrow="Activity" title="Recent rewards activity">
            <div className="app-activity-list">
              {rewardsActivity.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </AppCard>
        </div>
      </div>
    </AppLayout>
  );
}

export default Rewards;
