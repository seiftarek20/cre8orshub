import { Link } from 'react-router-dom';
import { roadmapSteps } from '../data/roadmap.js';

function Roadmap() {
  return (
    <section id="roadmap" className="section-block roadmap-section anchor-section">
      <div className="section-heading reveal">
        <p className="eyebrow">How It Works</p>
        <h2>Your Creative Roadmap</h2>
        <p>رحلة واضحة من أول فكرة لحد نتيجة تقدر تعرضها</p>
      </div>

      <div className="roadmap-grid">
        {roadmapSteps.map((step, index) => (
          <article key={step.title} className="roadmap-card reveal">
            <span className="roadmap-step-number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.arabic}</p>
          </article>
        ))}
      </div>

      <div className="roadmap-actions reveal">
        <Link className="btn btn-primary" to="/roadmap">
          Roadmap
        </Link>
      </div>
    </section>
  );
}

export default Roadmap;
