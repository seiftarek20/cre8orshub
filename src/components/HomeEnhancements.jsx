import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { courses, getCourseById } from '../data/courses.js';

const ACCENT = '#6fd1d7';

const quizQuestions = [
  {
    id: 'q1',
    prompt: 'What pulls you in first when you watch content?',
    options: [
      { label: 'Pacing, cuts, and how the story flows', courseId: 'video-editing' },
      { label: 'Movement, typography, and animated energy', courseId: 'motion-graphics' },
      { label: 'Layout, color, and brand-ready visuals', courseId: 'graphic-design' },
      { label: 'Generating scenes and cinematic ideas fast', courseId: 'ai-video-making' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Which tool vibe matches you right now?',
    options: [
      { label: 'Timeline-first editing', courseId: 'video-editing' },
      { label: 'Keyframes and compositing', courseId: 'motion-graphics' },
      { label: 'Vectors, grids, and type systems', courseId: 'graphic-design' },
      { label: 'Prompts, models, and AI pipelines', courseId: 'ai-video-making' },
    ],
  },
  {
    id: 'q3',
    prompt: 'Your dream outcome in 8 weeks looks like…',
    options: [
      { label: 'A tight reel that feels expensive', courseId: 'video-editing' },
      { label: 'A motion piece that tells a micro-story', courseId: 'motion-graphics' },
      { label: 'A cohesive social campaign look', courseId: 'graphic-design' },
      { label: 'An AI-assisted cinematic scene', courseId: 'ai-video-making' },
    ],
  },
];

const learningModes = [
  {
    title: 'Online Live',
    description: 'Structured sessions with real-time feedback, demos, and Q&A so you never guess what “good” looks like.',
  },
  {
    title: 'Recorded',
    description: 'Learn on your schedule with premium lessons you can revisit, pause, and practice with intentionally.',
  },
  {
    title: 'Offline (Dokki, Cairo)',
    description: 'In-person training in Dokki with focused critique, hands-on drills, and a studio-minded environment.',
  },
];

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

const audienceCards = [
  {
    title: 'Beginners who feel confused',
    description: 'You want a clear path—not random tutorials that never connect into real skill.',
  },
  {
    title: 'YouTube learners who feel lost',
    description: 'You’ve watched hundreds of videos, but your projects still don’t feel “finished.”',
  },
  {
    title: 'Ideas without execution',
    description: 'You can imagine the outcome, but the technical steps break your momentum.',
  },
  {
    title: 'You want sharper visual taste',
    description: 'You’re ready to train your eye so every frame looks intentional, not accidental.',
  },
];

const featuredStudentPieces = [
  { title: 'Edit: product launch rhythm', kind: 'Video', aspectRatio: '16 / 9' },
  { title: 'Motion: typographic story beat', kind: 'Motion', aspectRatio: '9 / 16' },
  { title: 'Brand social set: ocean minimal', kind: 'Graphic', aspectRatio: '4 / 5' },
];

const toolPills = [
  'Premiere',
  'After Effects',
  'Photoshop',
  'Illustrator',
  'Runway',
  'Kling',
  'Veo',
];

function tallyCourseId(selections) {
  const counts = {};
  selections.forEach((id) => {
    if (!id) return;
    counts[id] = (counts[id] || 0) + 1;
  });
  let best = null;
  let bestScore = -1;
  const order = ['video-editing', 'motion-graphics', 'graphic-design', 'ai-video-making'];
  order.forEach((id) => {
    const score = counts[id] || 0;
    if (score > bestScore) {
      bestScore = score;
      best = id;
    }
  });
  return best || 'video-editing';
}

function CreativePathQuiz() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState(() => quizQuestions.map(() => null));
  const [showResult, setShowResult] = useState(false);

  const recommendedId = useMemo(() => tallyCourseId(selections), [selections]);
  const recommended = getCourseById(recommendedId) || courses[0];

  const current = quizQuestions[step];
  const isLastStep = step === quizQuestions.length - 1;

  const pickOption = (courseId) => {
    const next = [...selections];
    next[step] = courseId;
    setSelections(next);
    if (isLastStep) {
      setShowResult(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setSelections(quizQuestions.map(() => null));
    setShowResult(false);
  };

  return (
    <div className="he-glass he-quiz reveal">
      <div className="he-section-heading he-quiz-heading">
        <p className="eyebrow">Creative Path Quiz</p>
        <h2>Three questions. One clear recommendation.</h2>
        <p>No fluff—just a premium track that matches how you like to create.</p>
      </div>

      {!showResult && current && (
        <div className="he-quiz-body">
          <p className="he-quiz-progress">
            Question {step + 1} / {quizQuestions.length}
          </p>
          <h3 className="he-quiz-prompt">{current.prompt}</h3>
          <div className="he-quiz-options">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                className="he-quiz-option"
                onClick={() => pickOption(opt.courseId)}
              >
                <span className="he-quiz-option-label">{opt.label}</span>
                <span className="he-quiz-option-cue" style={{ color: ACCENT }}>
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showResult && (
        <div className="he-quiz-result">
          <p className="eyebrow">Your match</p>
          <h3 className="he-result-title">{recommended.title}</h3>
          <p className="he-result-sub">{recommended.subtitle}</p>
          <div className="he-result-actions">
            <Link className="btn btn-primary" to={`/courses/${recommended.id}`}>
              View course
            </Link>
            <Link className="btn btn-outline" to="/booking">
              Book a call
            </Link>
            <button type="button" className="btn btn-ghost he-quiz-restart" onClick={restart}>
              Retake quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
      <section id="creative-quiz" className="section-block he-section anchor-section">
        <CreativePathQuiz />
      </section>

      <section id="learning-modes" className="section-block he-section anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Learning Modes</p>
          <h2>Choose how you want the craft to fit your life.</h2>
          <p>Same premium standard—flexible formats for different schedules and cities.</p>
        </div>
        <div className="he-grid he-grid-3">
          {learningModes.map((mode) => (
            <article key={mode.title} className="he-glass he-card reveal">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="what-you-create" className="section-block he-section anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">What You’ll Create</p>
          <h2>Portfolio-minded outcomes—not “class exercises.”</h2>
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

      <section id="is-this-for-you" className="section-block he-section anchor-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Is This For You?</p>
          <h2>If this sounds familiar, you’re in the right room.</h2>
        </div>
        <div className="he-grid he-grid-2">
          {audienceCards.map((card) => (
            <article key={card.title} className="he-glass he-card he-audience-card reveal">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

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

      <section className="section-block he-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Tools Wall</p>
          <h2>The stack we build taste on.</h2>
        </div>
        <div className="he-pill-wall reveal">
          {toolPills.map((tool) => (
            <span key={tool} className="he-pill">
              {tool}
            </span>
          ))}
        </div>
      </section>

      <section className="section-block he-section he-instructor-section">
        <div className="he-glass he-instructor reveal">
          <p className="eyebrow">From your instructor</p>
          <h2>I don’t teach “buttons.” I teach judgment.</h2>
          <p className="he-instructor-copy">
            My goal is simple: help you see better, move faster, and finish work you’re proud to put in
            front of people. If you’re willing to practice with intention, I’ll meet you with a clear
            roadmap and honest critique—so your next project feels like a leap, not a lucky accident.
          </p>
          <Link className="btn btn-primary" to="/booking">
            Book your seat
          </Link>
        </div>
      </section>
    </div>
  );
}
