import MotionParticles from './MotionParticles.jsx';

function BackgroundAnimation() {
  return (
    <div className="bg-animation" aria-hidden="true">
      <span className="bg-orb orb-1" />
      <span className="bg-orb orb-2" />
      <span className="bg-orb orb-3" />
      <MotionParticles />
      <span className="bg-grid" />
    </div>
  );
}

export default BackgroundAnimation;
