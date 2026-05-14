import { useEffect, useMemo, useState } from 'react';
import AppCard from '../components/AppCard.jsx';
import AppLayout from '../components/AppLayout.jsx';
import PointsProgress from '../components/PointsProgress.jsx';
import RewardBadge from '../components/RewardBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  achievements,
  badges,
  creatorLevels,
  pointsSummary,
  rewardsActivity,
  unlockableRewards,
} from '../data/rewards.js';
import { getStudentRewards } from '../services/rewardService.js';

function getLevelFromPoints(totalPoints) {
  if (totalPoints >= 3200) return 'Creative Pro';
  if (totalPoints >= 2400) return 'Portfolio Ready';
  if (totalPoints >= 1200) return 'Visual Storyteller';
  if (totalPoints >= 400) return 'Consistent Editor';
  return 'Beginner Creator';
}

function getNextLevel(currentLevel) {
  const currentIndex = creatorLevels.indexOf(currentLevel);
  return creatorLevels[Math.min(currentIndex + 1, creatorLevels.length - 1)] || creatorLevels[0];
}

function Rewards() {
  const { user } = useAuth();
  const [backendRewards, setBackendRewards] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRewards({ showLoading = true } = {}) {
      if (!user?.id) {
        setBackendRewards(null);
        setLoadError('');
        return;
      }

      if (showLoading) setIsLoading(true);
      setLoadError('');

      try {
        const rewards = await getStudentRewards(user.id);
        if (isMounted) setBackendRewards(rewards);
      } catch (error) {
        if (isMounted) {
          setBackendRewards(null);
          setLoadError(error.message || 'Could not load live rewards.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRewards();

    const refreshOnFocus = () => {
      loadRewards({ showLoading: false });
    };

    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, [user?.id]);

  const hasBackendData = Boolean(
    backendRewards && (backendRewards.totalPoints || backendRewards.badges.length || backendRewards.activity.length),
  );
  const liveLevel = hasBackendData ? getLevelFromPoints(backendRewards.totalPoints) : pointsSummary.currentLevel;
  const liveSummary = useMemo(() => {
    if (!hasBackendData) return pointsSummary;

    return {
      balance: backendRewards.totalPoints,
      currentLevel: liveLevel,
      nextLevel: getNextLevel(liveLevel),
      levelProgress: Math.min(Math.round((backendRewards.totalPoints % 1200) / 12), 100),
      streak: pointsSummary.streak,
    };
  }, [backendRewards, hasBackendData, liveLevel]);
  const visibleBadges = hasBackendData && backendRewards.badges.length ? backendRewards.badges : badges;
  const visibleAchievements = hasBackendData && backendRewards.activity.length ? backendRewards.activity : achievements;
  const visibleActivity = hasBackendData && backendRewards.activity.length
    ? backendRewards.activity.map((item) => `${item.title} (${item.points})`)
    : rewardsActivity;

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
            <h2>{liveSummary.balance.toLocaleString()} pts</h2>
            <p>
              Current level: <strong>{liveSummary.currentLevel}</strong>
            </p>
          </div>
          <PointsProgress
            label={`Progress to ${liveSummary.nextLevel}`}
            value={liveSummary.levelProgress}
            detail={`${100 - liveSummary.levelProgress}% left until the next level unlocks.`}
          />
        </section>

        {isLoading ? <p className="auth-message">Loading your latest rewards...</p> : null}
        {loadError ? <p className="auth-message is-error">Live rewards are unavailable, so starter rewards are shown.</p> : null}

        <section className="rewards-level-strip reveal" aria-label="Creator levels">
          {creatorLevels.map((level) => (
            <span key={level} className={level === liveSummary.currentLevel ? 'is-active' : ''}>
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
            {visibleBadges.map((badge) => (
              <RewardBadge key={badge.title} badge={badge} />
            ))}
          </div>
        </section>

        <div className="rewards-grid">
          <AppCard eyebrow="Achievements" title="Recent wins">
            <div className="rewards-list">
              {visibleAchievements.map((achievement) => (
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

          <AppCard eyebrow="Streak" title={`${liveSummary.streak} days`}>
            <p>Keep submitting small polished work each week to protect the streak and earn extra points.</p>
            <div className="streak-dots" aria-label={`${liveSummary.streak} day streak`}>
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
              {visibleActivity.map((item) => (
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
