import { useEffect, useId, useState } from 'react';

function LessonVideoIcon() {
  return (
    <span className="curriculum-lesson-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 6.5C4 5.12 5.12 4 6.5 4h7C14.88 4 16 5.12 16 6.5v11c0 1.38-1.12 2.5-2.5 2.5h-7A2.5 2.5 0 0 1 4 17.5v-11Z"
          stroke="currentColor"
          strokeWidth="1.35"
        />
        <path d="M17 9v6l4-3-4-3Z" fill="currentColor" opacity="0.85" />
      </svg>
    </span>
  );
}

function getModuleLessonCount(mod) {
  return mod.lessonCount || mod.lessons?.length || 0;
}

export default function CourseCurriculum({ courseId, courseTitle, curriculum }) {
  const uid = useId();
  const [openId, setOpenId] = useState(curriculum?.modules?.[0]?.id || null);

  useEffect(() => {
    setOpenId(curriculum?.modules?.[0]?.id || null);
  }, [curriculum]);

  if (!curriculum?.modules?.length) {
    return null;
  }

  const toggle = (moduleId) => {
    setOpenId((prev) => (prev === moduleId ? null : moduleId));
  };

  return (
    <div className="course-curriculum" data-course-id={courseId}>
      <div className="curriculum-stats-row reveal">
        {curriculum.stats?.map((stat) => (
          <span key={stat.key || stat.label} className="curriculum-stat-pill">
            {stat.label}
          </span>
        ))}
      </div>

      <header className="curriculum-header reveal">
        <p className="curriculum-kicker">{courseTitle}</p>
        <h2 className="curriculum-title">Course Curriculum</h2>
        <p className="curriculum-subtitle">{curriculum.description}</p>
      </header>

      <div className="curriculum-modules" role="list">
        {curriculum.modules.map((mod, index) => {
          const isOpen = openId === mod.id;
          const panelId = `${uid}-panel-${mod.id}`;
          const headerId = `${uid}-header-${mod.id}`;
          const lessonCount = getModuleLessonCount(mod);

          return (
            <article
              key={mod.id}
              className={`curriculum-module${isOpen ? ' is-open is-active' : ''}`}
              style={{ '--curriculum-stagger': index }}
              role="listitem"
            >
              <button
                type="button"
                id={headerId}
                className="curriculum-module-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(mod.id)}
              >
                <span className="curriculum-module-num">{mod.number}</span>
                <span className="curriculum-module-main">
                  <span className="curriculum-module-title-row">
                    <span className="curriculum-module-title">{mod.title}</span>
                    <span className="curriculum-module-meta">
                      <span>{lessonCount} lessons</span>
                      <span className="curriculum-meta-dot" aria-hidden="true" />
                      <span>{mod.durationLabel}</span>
                    </span>
                  </span>
                  <span className="curriculum-module-desc">{mod.description}</span>
                </span>
                <span className="curriculum-chevron" aria-hidden="true" />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={`curriculum-module-panel${isOpen ? ' is-expanded' : ''}`}
                aria-hidden={!isOpen}
              >
                <div className="curriculum-module-panel-inner">
                  <ul className="curriculum-lesson-list">
                    {mod.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson} className="curriculum-lesson-row">
                        <LessonVideoIcon />
                        <span className="curriculum-lesson-num">{lessonIndex + 1}.</span>
                        <span className="curriculum-lesson-title">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
