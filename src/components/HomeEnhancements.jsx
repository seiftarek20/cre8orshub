import { useState } from 'react';
import { Link } from 'react-router-dom';

const createShowcase = [
  {
    key: 'video',
    title: 'Video Editing',
    subtitle: 'SHORT AD REEL',
    description: 'Build a punchy ad reel with rhythm, sound design, and a signature cut style.',
    mediaType: 'youtube',
    youtubeId: '5-lNURT-swg',
    url: 'https://www.youtube.com/shorts/5-lNURT-swg',
    orientation: 'vertical',
  },
  {
    key: 'motion',
    title: 'Motion',
    subtitle: 'ANIMATED STORY',
    description: 'Shape a short animated narrative with timing, typography, and layered motion.',
    mediaType: 'youtube',
    youtubeId: 'o-LqiGr9NQM',
    url: 'https://www.youtube.com/shorts/o-LqiGr9NQM',
    orientation: 'vertical',
  },
  {
    key: 'graphic',
    title: 'Graphic',
    subtitle: 'SOCIAL CAMPAIGN',
    description: 'Design a cohesive campaign system that feels premium across every post.',
    mediaType: 'image',
    image: '/images/create/design-1.jpg',
    orientation: 'vertical',
  },
  {
    key: 'ai',
    title: 'AI',
    subtitle: 'AI CINEMATIC SCENE',
    description: 'Direct an AI-assisted scene with mood, consistency, and a human finish.',
    mediaType: 'youtube',
    youtubeId: 'm83Fpo7KN0E',
    url: 'https://youtu.be/m83Fpo7KN0E',
    orientation: 'horizontal',
  },
];

const featuredStudentPieces = [
  { title: 'Edit: product launch rhythm', kind: 'Video', aspectRatio: '16 / 9' },
  { title: 'Motion: typographic story beat', kind: 'Motion', aspectRatio: '9 / 16' },
  { title: 'Brand social set: ocean minimal', kind: 'Graphic', aspectRatio: '4 / 5' },
];

function CreateMediaPreview({ item, onPlay }) {
  if (item.mediaType === 'youtube') {
    return (
      <button
        className="he-create-media-button"
        type="button"
        onClick={() => onPlay(item)}
        aria-label={`Play ${item.title} preview`}
      >
        <img
          src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
        />
        <span className="he-create-play" aria-hidden="true">
          <span />
        </span>
      </button>
    );
  }

  return <img src={item.image} alt={`${item.title} preview`} loading="lazy" />;
}

export default function HomeEnhancements() {
  const [activeCreateVideo, setActiveCreateVideo] = useState(null);

  return (
    <div className="home-enhancements">
      <section id="what-you-create" className="section-block he-section anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">What You&apos;ll Create</p>
          <h2>Portfolio-minded outcomes, not class exercises.</h2>
        </div>
        <div className="he-grid he-grid-4">
          {createShowcase.map((item) => (
            <article
              key={item.key}
              className={`he-glass he-card he-create-card he-create-${item.orientation} reveal`}
            >
              <div className="he-create-media">
                <CreateMediaPreview item={item} onPlay={setActiveCreateVideo} />
              </div>
              <div className="he-create-body">
                <h3>{item.title}</h3>
                <p className="he-create-sub">{item.subtitle}</p>
                <p>{item.description}</p>
                {item.mediaType === 'youtube' ? (
                  <a className="he-create-link" href={item.url} target="_blank" rel="noreferrer">
                    Open on YouTube
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeCreateVideo ? (
        <div
          className={`he-create-modal ${
            activeCreateVideo.orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeCreateVideo.title} preview`}
          onClick={() => setActiveCreateVideo(null)}
        >
          <div className="he-create-modal-panel" onClick={(event) => event.stopPropagation()}>
            <button
              className="he-create-modal-close"
              type="button"
              onClick={() => setActiveCreateVideo(null)}
              aria-label="Close preview"
            >
              X
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${activeCreateVideo.youtubeId}?autoplay=1`}
              title={`${activeCreateVideo.title} preview`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <a className="he-create-modal-link" href={activeCreateVideo.url} target="_blank" rel="noreferrer">
              Open on YouTube
            </a>
          </div>
        </div>
      ) : null}

      <section id="student-work" className="section-block he-section anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Featured Student Work</p>
          <h2>Real projects. Real taste upgrades.</h2>
        </div>
        <div className="he-student-grid">
          {featuredStudentPieces.map((piece) => (
            <article key={piece.title} className="he-glass he-student-card reveal">
              <div className="he-student-thumb" style={{ aspectRatio: piece.aspectRatio }}>
                <span className="he-student-kind">{piece.kind}</span>
              </div>
              <div className="he-student-meta">
                <h3>{piece.title}</h3>
              </div>
            </article>
          ))}
        </div>
        <div className="he-student-cta reveal">
          <Link className="btn btn-outline" to="/student-work">
            View student work
          </Link>
        </div>
      </section>

      <section className="section-block he-section he-instructor-section">
        <div className="he-glass he-instructor reveal">
          <p className="eyebrow">From your instructor</p>
          <h2>I don&apos;t teach buttons. I teach judgment.</h2>
          <p className="he-instructor-copy">
            My goal is simple: help you see better, move faster, and finish work you are proud to put in
            front of people. If you are willing to practice with intention, I will meet you with a clear
            roadmap and honest critique so your next project feels like a leap, not a lucky accident.
          </p>
          <Link className="btn btn-primary" to="/booking">
            Book your seat
          </Link>
        </div>
      </section>
    </div>
  );
}
