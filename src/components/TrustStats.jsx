import { useEffect, useRef, useState } from 'react';

const TRUST_STATS = [
  { value: 2000, suffix: '+', label: 'Students Guided' },
  { value: 50, suffix: '+', label: 'Creative Projects Built' },
  { value: 4, suffix: '', label: 'Creative Tracks' },
  { value: 3, suffix: '', label: 'Learning Modes' },
  { value: 2, suffix: '+', label: 'Years of Training' },
];

const DURATION_MS = 1800;

function TrustStats() {
  const [hasStarted, setHasStarted] = useState(false);
  const [counts, setCounts] = useState(() => TRUST_STATS.map(() => 0));
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || hasStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return undefined;

    let animationFrame;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;

      setCounts(TRUST_STATS.map((stat) => Math.round(stat.value * eased)));

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted]);

  return (
    <section
      ref={sectionRef}
      id="trust-stats"
      className="section-block trust-stats-section anchor-section"
    >
      <div className="section-heading reveal">
        <p className="eyebrow">Numbers That Build Trust</p>
        <h2>Proof that progress here is practical, not random.</h2>
        <p>أرقام بسيطة بتوضح إن التجربة مبنية على تطبيق، متابعة، وتطور حقيقي.</p>
      </div>

      <div className="trust-stats-grid">
        {TRUST_STATS.map((stat, index) => (
          <article key={stat.label} className="trust-stat-card reveal">
            <p className="trust-stat-value">
              {counts[index]}
              {stat.suffix}
            </p>
            <p className="trust-stat-label">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrustStats;
