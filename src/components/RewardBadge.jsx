function RewardBadge({ badge }) {
  const isLocked = badge.state === 'Locked';

  return (
    <article className={`reward-badge reveal ${isLocked ? 'is-locked' : ''}`}>
      <div className="reward-badge-icon" aria-hidden="true">
        {isLocked ? 'L' : 'B'}
      </div>
      <div>
        <p>{badge.state}</p>
        <h3>{badge.title}</h3>
        <span>{badge.detail}</span>
      </div>
    </article>
  );
}

export default RewardBadge;
