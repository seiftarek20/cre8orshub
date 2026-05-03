import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToSectionById } from '../utils/scrollAnchor.js';
import CourseCard from '../components/CourseCard.jsx';
import Roadmap from '../components/Roadmap.jsx';
import Testimonials from '../components/Testimonials.jsx';
import HomeEnhancements from '../components/HomeEnhancements.jsx';
import TrustStats from '../components/TrustStats.jsx';
import { courses } from '../data/courses.js';
import { whyItems } from '../data/whyItems.js';

const heroHeadlines = [
  'Create visuals that feel impossible to ignore.',
  'Your ideas deserve cinematic execution.',
  'Make every frame feel intentional.',
  'Build visuals with taste, timing, and story.',
];

function Home() {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % heroHeadlines.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const raw = location.hash;
    if (!raw || raw.length < 2) return;
    const id = raw.slice(1);
    const timer = window.setTimeout(() => {
      scrollToSectionById(id);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <>
      <section id="home" className="hero-section anchor-section">
        <video className="hero-video" src="/hero.mp4" autoPlay loop muted playsInline />
        <div className="hero-overlay" />
        <div className="hero-content reveal show">
          <p className="eyebrow">Cre8ors Hub</p>
          <h1 key={headlineIndex} className="hero-title-animated">
            {heroHeadlines[headlineIndex]}
          </h1>
          <p className="hero-description" dir="rtl">
            هنا بتتعلّم تشوف، ترتّب، وتحرّك الفكرة — لحد ما تبقى شغل يستحق يتشاف.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/#courses">
              Explore Courses
            </Link>
            <Link className="btn btn-outline" to="/#roadmap">
              Start Your Creative Path
            </Link>
          </div>
        </div>
      </section>

      <section id="courses" className="section-block anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Courses</p>
          <h2>Choose Your Creative Path</h2>
          <p>كل مسار معمول عشان يبني عينك، إيدك، وطريقتك في التنفيذ.</p>
        </div>
        <div className="courses-grid">
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <Roadmap />

      <TrustStats />

      <Testimonials />

      <HomeEnhancements />

      <section id="why-cre8ors" className="section-block anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Why Cre8ors Hub</p>
          <h2>A place for creators who want their work to feel different.</h2>
        </div>
        <div className="why-grid">
          {whyItems.map((item) => (
            <article key={item.title} className="why-card reveal">
              {item.image ? (
                <img src={item.image} alt={item.title} className="why-image" />
              ) : (
                <div className="why-image why-placeholder" aria-hidden="true" />
              )}
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="booking" className="section-block cta reveal anchor-section">
        <h2>Ready to start creating differently?</h2>
        <p>حوّل عينك من متفرج لصانع. ابدأ المسار اللي يشبه ذوقك.</p>
        <Link className="btn btn-primary" to="/booking">
          ابدأ المسار
        </Link>
      </section>
    </>
  );
}

export default Home;
