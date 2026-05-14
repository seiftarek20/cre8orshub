import { Link } from 'react-router-dom';
import { getCourseById } from '../data/courses.js';
import { seoLandingPages } from '../data/seoLandingPages.js';
import {
  JsonLd,
  buildCourseJsonLd,
  buildFaqJsonLd,
  siteUrl,
  usePageMeta,
} from '../utils/seo.jsx';

function InfoList({ title, items }) {
  return (
    <section className="seo-info-panel reveal">
      <p className="app-card-eyebrow">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SEOCourseLanding({ pageKey }) {
  const page = seoLandingPages[pageKey];
  const course = getCourseById(page.courseId);
  const pageUrl = `${siteUrl}${page.path}`;
  const courseImage = course?.coverImage?.startsWith('http')
    ? course.coverImage
    : `${siteUrl}${course?.coverImage || '/images/motion_graphic_course.png'}`;

  usePageMeta({
    title: page.title,
    description: page.metaDescription,
  });

  return (
    <section className="section-block page-top seo-landing-page">
      <JsonLd
        data={buildCourseJsonLd({
          name: page.h1,
          description: page.metaDescription,
          url: pageUrl,
          image: courseImage,
        })}
      />
      <JsonLd data={buildFaqJsonLd(page.faqs)} />

      <header className="details-hero reveal">
        <p className="eyebrow">Cre8ors Hub</p>
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to={`/booking?course=${page.courseId}`}>
            Book a Consultation
          </Link>
          <Link className="btn btn-outline" to={`/courses/${page.courseId}`}>
            View Course Details
          </Link>
        </div>
      </header>

      <div className="seo-info-grid">
        <InfoList title="Course Benefits" items={page.benefits} />
        <InfoList title="Who It Is For" items={page.audience} />
        <InfoList title="Projects Students Create" items={page.projects} />
        <InfoList title="Tools Used" items={page.tools} />
      </div>

      <section className="seo-faq-section reveal">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Common questions</h2>
        </div>
        <div className="seo-faq-list">
          {page.faqs.map((faq) => (
            <article key={faq.question} className="app-card reveal">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block cta reveal">
        <h2>Ready to start building real creative work?</h2>
        <p>Book a quick consultation and we will help you choose the right course path.</p>
        <Link className="btn btn-primary" to={`/booking?course=${page.courseId}`}>
          Start with Cre8ors Hub
        </Link>
      </section>
    </section>
  );
}

export default SEOCourseLanding;
