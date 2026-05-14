import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CourseCurriculum from '../components/CourseCurriculum.jsx';
import PaymentInstructions from '../components/PaymentInstructions.jsx';
import { getCourseCurriculumById } from '../data/courseCurriculums.js';
import { getCourseById } from '../data/courses.js';
import { JsonLd, buildCourseJsonLd, siteUrl } from '../utils/seo.jsx';

function CourseExampleMedia({ example, onPlay }) {
  const isYoutube = example.type === 'youtube' && example.youtubeId;

  if (isYoutube) {
    return (
      <button
        className="example-media-frame example-youtube-preview"
        type="button"
        onClick={() => onPlay(example)}
        aria-label={`Play ${example.title}`}
      >
        <img
          src={`https://img.youtube.com/vi/${example.youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
        />
        <span className="example-play-button" aria-hidden="true">
          <span />
        </span>
      </button>
    );
  }

  if (!example.src) {
    return null;
  }

  return (
    <video
      className="example-media-frame"
      controls
      preload="metadata"
      playsInline
      src={example.src}
    />
  );
}

function CourseDetails() {
  const { id } = useParams();
  const [activeExample, setActiveExample] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const course = getCourseById(id);
  const curriculum = getCourseCurriculumById(id);

  useEffect(() => {
    document.title = course ? `${course.title} | Cre8ors Hub` : 'Course Not Found | Cre8ors Hub';
  }, [course]);

  useEffect(() => {
    if (!activeExample && !isPaymentOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveExample(null);
        setIsPaymentOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeExample, isPaymentOpen]);

  if (!course) {
    return (
      <section className="section-block page-top reveal show">
        <h1>Course not found</h1>
        <Link className="btn btn-outline" to="/courses">
          Back to all courses
        </Link>
      </section>
    );
  }

  return (
    <section className="section-block page-top">
      <JsonLd
        data={buildCourseJsonLd({
          name: `${course.title} Course`,
          description: course.description || course.subtitle,
          url: `${siteUrl}/courses/${course.id}`,
          image: course.coverImage?.startsWith('http') ? course.coverImage : `${siteUrl}${course.coverImage}`,
        })}
      />
      <header className="details-hero reveal">
        <p className="eyebrow">{course.arabicTitle}</p>
        <h1>{course.title}</h1>
        <p>{course.subtitle}</p>

        <div className="course-meta" style={{ marginTop: '0.85rem' }}>
          <span>{course.duration}</span>
          <span>{course.level}</span>
        </div>
      </header>

      <div className="details-layout">
        <div className="details-main">
          <CourseCurriculum courseId={course.id} courseTitle={course.title} curriculum={curriculum} />
        </div>

        <aside className="details-side">
          <article className="details-card curriculum-sticky-cta reveal">
            <p className="curriculum-sticky-cta-label">Ready to start?</p>
            <button
              className="btn btn-primary curriculum-sticky-cta-btn"
              type="button"
              onClick={() => setIsPaymentOpen(true)}
            >
              Pay / Enroll Now
            </button>
          </article>

          <article className="details-card reveal">
            <h2>Learning Options</h2>
            <div className="learning-options-list">
              {course.learningOptions?.map((option) => (
                <div key={option.type} className="learning-option-chip">
                  <h3>{option.type}</h3>
                  <p>{option.labelAr}</p>
                  <small>{option.description}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="details-card reveal">
            <h2>Tools</h2>
            <ul className="details-list">
              {course.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </article>

          <article className="details-card reveal">
            <h2>Actions</h2>
            <div className="actions-column">
              <button className="btn btn-primary" type="button" onClick={() => setIsPaymentOpen(true)}>
                Pay / Enroll Now
              </button>

              <a
                className="btn btn-outline"
                href={course.facebookLink}
                target="_blank"
                rel="noreferrer"
              >
                View Student Work
              </a>

              <Link className="btn btn-ghost" to="/courses">
                شوف التجربة
              </Link>
            </div>
          </article>
        </aside>
      </div>

      <section className="examples-section">
        <h2 className="reveal">Examples | أمثلة من الشغل اللي هتطلع زيه</h2>

        {course.examples.length === 0 ? (
          <div className="details-card reveal">
            <p>Fresh examples are being curated for this track.</p>
          </div>
        ) : (
          <div className="examples-grid">
            {course.examples.map((example, index) => (
              <article
                key={example.youtubeId || example.src || `${example.title}-${index}`}
                className={`example-card reveal ${
                  example.orientation === 'vertical' ? 'is-vertical' : 'is-horizontal'
                }`}
              >
                <CourseExampleMedia example={example} onPlay={setActiveExample} />
                <p>{example.title}</p>
                {example.type === 'youtube' && example.url ? (
                  <a
                    className="example-youtube-link"
                    href={example.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open on YouTube
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>

      {activeExample ? (
        <div
          className={`youtube-modal ${
            activeExample.orientation === 'horizontal' ? 'is-horizontal-modal' : 'is-vertical-modal'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={activeExample.title}
          onClick={() => setActiveExample(null)}
        >
          <div className="youtube-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="youtube-modal-close"
              type="button"
              onClick={() => setActiveExample(null)}
              aria-label="Close video"
            >
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeExample.youtubeId}?autoplay=1`}
              title={activeExample.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {activeExample.url ? (
              <a
                className="youtube-modal-link"
                href={activeExample.url}
                target="_blank"
                rel="noreferrer"
              >
                Open on YouTube
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {isPaymentOpen ? (
        <div className="app-modal-backdrop" role="presentation" onMouseDown={() => setIsPaymentOpen(false)}>
          <section
            className="app-modal-panel reveal show payment-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="app-modal-close" type="button" onClick={() => setIsPaymentOpen(false)}>
              Close
            </button>
            <p className="app-card-eyebrow">Course Payment</p>
            <h2 id="payment-modal-title">{course.title}</h2>
            <p className="app-muted">Complete payment, then send proof on WhatsApp so enrollment can be confirmed.</p>
            <PaymentInstructions courseTitle={course.title} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

export default CourseDetails;
