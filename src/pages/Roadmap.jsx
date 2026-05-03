import { Link } from 'react-router-dom';
import { roadmapSteps } from '../data/roadmap.js';

function RoadmapPage() {
  return (
    <section className="section-block page-top roadmap-page">
      <div className="roadmap-page-container">
        <div className="roadmap-page-video-col reveal">
          <div className="roadmap-reel-frame">
            <video
              className="roadmap-reel-video"
              controls
              loop
              playsInline
              preload="metadata"
              src="/roadmap-reel.mp4"
            />
          </div>
        </div>

        <div className="roadmap-page-content-col">
          <header className="section-heading reveal">
            <p className="eyebrow">Creative Journey</p>
            <h1>Your Creative Roadmap</h1>
            <p>رحلة واضحة من البداية لحد ما تبقى جاهز تطلع شغل قوي</p>
            <p>
              في Cre8ors Hub، الرحلة مش عشوائية. كل خطوة ليها هدف واضح، من بناء العين
              والتفكير الإبداعي لحد التطبيق العملي وإخراج شغل تفتخر بيه.
            </p>
          </header>

          <div className="roadmap-page-steps">
            {roadmapSteps.map((step, index) => (
              <article key={step.title} className="roadmap-page-step reveal">
                <span className="roadmap-step-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.arabic}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="roadmap-page-cta reveal">
            <h2>Ready to start your path?</h2>
            <p>اختار الكورس المناسب وابدأ أول خطوة.</p>
            <div className="hero-actions">
              <Link className="btn btn-outline" to="/courses">
                View Courses
              </Link>
              <Link className="btn btn-primary" to="/booking">
                Book Now
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default RoadmapPage;
