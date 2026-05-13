import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/** Document order on Home — ids must match anchor sections */
const SECTION_LINKS = [
  { hash: 'courses', label: 'Courses' },
  { hash: 'roadmap', label: 'Roadmap' },
  { hash: 'trust-stats', label: 'Numbers' },
  { hash: 'testimonials', label: 'Reviews' },
  { hash: 'what-you-create', label: 'Create' },
  { hash: 'student-work', label: 'Student Work' },
  { hash: 'booking', label: 'Booking' },
];

function useActiveSection(pathname, hash) {
  const [activeId, setActiveId] = useState(SECTION_LINKS[0].hash);

  useEffect(() => {
    if (pathname !== '/') return undefined;

    const ids = SECTION_LINKS.map((s) => s.hash);
    let debounceId;

    const compute = () => {
      const markerDoc = window.scrollY + window.innerHeight * 0.27;
      let chosen = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const topDoc = el.getBoundingClientRect().top + window.scrollY;
        if (topDoc <= markerDoc + 48) chosen = id;
      }

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY >= maxScroll - 4) {
        chosen = ids[ids.length - 1];
      }

      setActiveId(chosen);
    };

    const schedule = () => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(compute, 42);
    };

    compute();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', compute, { passive: true });

    return () => {
      window.clearTimeout(debounceId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', compute);
    };
  }, [pathname, hash]);

  return activeId;
}

export default function SectionNav() {
  const { pathname, hash } = useLocation();
  const activeId = useActiveSection(pathname, hash);

  if (pathname !== '/') return null;

  return (
    <>
      <nav className="section-timeline" aria-label="Page sections">
        <div className="section-timeline-line" aria-hidden="true" />
        <ul className="section-timeline-list">
          {SECTION_LINKS.map((item) => {
            const isActive = activeId === item.hash;
            return (
              <li key={item.hash} className={`section-timeline-item${isActive ? ' is-active' : ''}`}>
                <Link
                  className={`section-timeline-hit${isActive ? ' is-active' : ''}`}
                  to={`/#${item.hash}`}
                  aria-current={isActive ? 'true' : undefined}
                  title={item.label}
                >
                  <span className="section-timeline-label">{item.label}</span>
                  <span className="section-timeline-node">
                    <span className="section-timeline-dot" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav className="section-timeline-mobile" aria-label="Page sections">
        <div className="section-timeline-mobile-track" aria-hidden="true" />
        <ul className="section-timeline-mobile-list">
          {SECTION_LINKS.map((item) => {
            const isActive = activeId === item.hash;
            return (
              <li key={item.hash}>
                <Link
                  className={`section-timeline-mobile-hit${isActive ? ' is-active' : ''}`}
                  to={`/#${item.hash}`}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={item.label}
                >
                  <span className="section-timeline-mobile-dot" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
