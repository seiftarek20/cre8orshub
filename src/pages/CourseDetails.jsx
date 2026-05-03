import { Link, useParams } from 'react-router-dom';
import CourseCurriculumMotion from '../components/CourseCurriculumMotion.jsx';
import { getCourseById } from '../data/courses.js';

function CourseDetails() {
  const { id } = useParams();
  const course = getCourseById(id);

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
      <header className="details-hero reveal">
        <p className="eyebrow">{course.arabicTitle}</p>
        <h1>{course.title}</h1>
        <p>{course.subtitle}</p>
        {course.id === 'motion-graphics' && (
          <div className="course-meta" style={{ marginTop: '0.85rem' }}>
            <span>{course.duration}</span>
            <span>{course.level}</span>
          </div>
        )}
      </header>

      <div className="details-layout">
        <div className="details-main">
          {course.id === 'motion-graphics' ? (
            <CourseCurriculumMotion />
          ) : (
            <>
              <article className="details-card reveal">
                <h2>Creative Intro</h2>
                <p>{course.creativeIntro}</p>
                <div className="course-meta" style={{ marginTop: '1rem' }}>
                  <span>{course.duration}</span>
                  <span>{course.level}</span>
                </div>
              </article>

              <article className="details-card reveal">
                <h2>What You Will Explore</h2>
                <ul className="details-list">
                  {course.explore.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="details-card reveal">
                <h2>What You Will Create</h2>
                <ul className="details-list">
                  {course.create.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="details-card reveal">
                <h2>Course Notes</h2>
                <div className="course-meta">
                  <span>Not just steps. A creative way of thinking.</span>
                </div>
              </article>
            </>
          )}
        </div>

        <aside className="details-side">
          {course.id === 'motion-graphics' && (
            <article className="details-card curriculum-sticky-cta reveal">
              <p className="curriculum-sticky-cta-label">Ready to start?</p>
              <Link className="btn btn-primary curriculum-sticky-cta-btn" to={`/booking?course=${course.id}`}>
                Book This Course
              </Link>
            </article>
          )}

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
              <Link className="btn btn-primary" to={`/booking?course=${course.id}`}>
                Book a Call
              </Link>
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
            {course.examples.map((example) => (
              <article
                key={example.src}
                className={`example-card reveal ${example.orientation === 'vertical' ? 'is-vertical' : 'is-horizontal'}`}
              >
                <video controls preload="metadata" src={example.src} />
                <p>{example.title}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default CourseDetails;
