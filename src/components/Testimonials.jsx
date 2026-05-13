import { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

const FEEDBACK_COLUMNS = [
  'رأيي في المحاضر',
  'رأيي في المحاضره',
  'رأيي في المحاضرة',
  'اي note اي تعليق زياده',
  'أي note أي تعليق زيادة',
];

const COURSE_COLUMNS = [
  'Course',
  'course',
  'الكورس',
  'اسم الكورس',
  'Course Name',
  'Session',
  'session',
];

const EXCLUDED_REVIEW_PATTERNS = [
  'بلاش جدالات',
  'انا عايز حل في مشكلة السي',
  'الاسئلة تكون فى الاخر',
  'الأسئلة تكون في الآخر',
  'المقاطعات الكتير',
  'برجاء الاعلان عن الtesting',
  'الmeeting طو',
  'مواعيد الصلاه',
  'كانت ممله',
  'كلام كتير',
  'الاساله كتير',
  'مبنلحقش نكتب',
  'كنت متوقع أنها محاضره عاديه',
  'نركز معاهم شوية',
];

const CAROUSEL_GAP = 16;
const MIN_CARD_WIDTH = 220;
const SOCIAL_PLATFORMS = ['whatsapp', 'instagram', 'ask', 'facebook'];
const IMAGE_REVIEWS = [];

const normalizeHeader = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[ـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ');

const formatTimestamp = (parsedDate) => {
  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(parsedDate);

  return `${datePart} - ${timePart}`;
};

const hashString = (value) => {
  let hash = 0;
  const source = String(value || '');
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return hash;
};

const createSeededRandom = (seedInput) => {
  let seed = hashString(seedInput) || 1;
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const randomReviewDate = (seedInput) => {
  const random = createSeededRandom(seedInput);
  const year = 2024 + Math.floor(random() * 3);
  const month = Math.floor(random() * 12);
  const day = 1 + Math.floor(random() * 28);
  const hour = 10 + Math.floor(random() * 13);
  const minute = Math.floor(random() * 60);
  const second = Math.floor(random() * 60);
  return new Date(year, month, day, hour, minute, second);
};

const platformLabel = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram DM',
  ask: 'Ask Reply',
  facebook: 'Facebook',
};

const platformMark = {
  whatsapp: 'WA',
  instagram: 'IG',
  ask: 'ASK',
  facebook: 'FB',
};

const pickPlatform = (seedInput) => {
  const index = hashString(seedInput) % SOCIAL_PLATFORMS.length;
  return SOCIAL_PLATFORMS[index];
};

const firstValueByColumns = (row, columns) => {
  const normalizedEntries = Object.entries(row).map(([key, value]) => [normalizeHeader(key), value]);

  for (const key of columns.map(normalizeHeader)) {
    const match = normalizedEntries.find(([entryKey]) => entryKey === key);
    const value = match?.[1];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number') {
      return value;
    }
  }
  return '';
};

const pickBestFeedback = (row) => {
  const candidates = FEEDBACK_COLUMNS.map((column) => firstValueByColumns(row, [column])).filter(
    (value) => typeof value === 'string' && value.trim().length >= 4
  );

  if (candidates.length === 0) {
    return '';
  }

  return candidates.sort((a, b) => b.length - a.length)[0];
};

const shouldExcludeReview = (reviewText) => {
  const normalized = normalizeHeader(reviewText);
  return EXCLUDED_REVIEW_PATTERNS.some((pattern) => normalized.includes(normalizeHeader(pattern)));
};

const getVisibleCount = (width) => {
  if (width <= 700) return 1;
  if (width <= 992) return 2;
  return 4;
};

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [newReview, setNewReview] = useState({ name: '', track: '', message: '' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const viewportRef = useRef(null);
  const dragStateRef = useRef({ pointerId: null, startX: 0 });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('/data/reviews.xlsx');
        if (!response.ok) throw new Error('Failed to fetch reviews file');

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const parsedRows = rows
          .map((row, index) => {
            const reviewText = pickBestFeedback(row);
            if (!reviewText || shouldExcludeReview(reviewText)) return null;

            const courseLabel = firstValueByColumns(row, COURSE_COLUMNS) || 'Student Feedback';
            const platform = pickPlatform(`${index}-${reviewText}`);
            return {
              id: `${index}-${reviewText.slice(0, 16)}`,
              type: 'message',
              platform,
              text: reviewText,
              studentName: 'Cre8ors Hub Student',
              courseLabel,
              label: platformLabel[platform],
              rating: 5,
              date: formatTimestamp(randomReviewDate(`${index}-${reviewText}`)),
              variant: index % 5,
            };
          })
          .filter(Boolean);

        setReviews([...IMAGE_REVIEWS, ...parsedRows]);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    if (!viewportRef.current) return undefined;
    const element = viewportRef.current;
    const updateWidth = () => setViewportWidth(element.clientWidth);
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [status, reviews.length]);

  const preferredVisibleCount = getVisibleCount(viewportWidth || 1200);
  const maxCardsByWidth = viewportWidth
    ? Math.max(1, Math.floor((viewportWidth + CAROUSEL_GAP) / (MIN_CARD_WIDTH + CAROUSEL_GAP)))
    : preferredVisibleCount;
  const visibleCount = Math.min(preferredVisibleCount, maxCardsByWidth);
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const cardWidth = useMemo(() => {
    if (!viewportWidth) return 0;
    const computed = (viewportWidth - CAROUSEL_GAP * (visibleCount - 1)) / visibleCount;
    return Math.max(MIN_CARD_WIDTH, computed);
  }, [viewportWidth, visibleCount]);

  useEffect(() => {
    if (status !== 'ready' || reviews.length <= visibleCount || isPaused || isDragging) return undefined;

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 15000);

    return () => clearInterval(intervalId);
  }, [status, reviews.length, visibleCount, isPaused, isDragging, maxIndex]);

  const handlePrev = () => setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  const handlePointerDown = (event) => {
    if (reviews.length <= visibleCount) return;
    dragStateRef.current = { pointerId: event.pointerId, startX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setIsPaused(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || event.pointerId !== dragStateRef.current.pointerId) return;
    setDragOffset(event.clientX - dragStateRef.current.startX);
  };

  const finishDrag = () => {
    if (!isDragging) return;

    const threshold = Math.max(60, cardWidth * 0.18);
    if (dragOffset <= -threshold) handleNext();
    else if (dragOffset >= threshold) handlePrev();

    setDragOffset(0);
    setIsDragging(false);
    setIsPaused(false);
  };

  const handlePointerUp = (event) => {
    if (event.pointerId !== dragStateRef.current.pointerId) return;
    finishDrag();
  };

  const whatsappNumber = '201002316651';

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const composedMessage = [
      'New Student Review - Cre8ors Hub',
      `Name: ${newReview.name.trim() || 'Anonymous'}`,
      `Track: ${newReview.track || 'General Feedback'}`,
      `Review: ${newReview.message.trim()}`,
    ].join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(composedMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const safeActiveIndex = Math.min(activeIndex, maxIndex);
  const showDots = maxIndex <= 10;
  const dotIndices = Array.from({ length: maxIndex + 1 }, (_, idx) => idx);
  const trackTranslate = -(safeActiveIndex * (cardWidth + CAROUSEL_GAP)) + dragOffset;

  return (
    <section id="testimonials" className="section-block testimonials-section anchor-section">
      <div className="section-heading reveal">
        <p className="eyebrow">Testimonials</p>
        <h2>Real Messages. Real Results.</h2>
        <p>Feedback from students who joined the creative journey.</p>
      </div>

      {status === 'loading' && <div className="testimonials-status reveal show">Loading reviews...</div>}

      {status === 'error' && (
        <div className="testimonials-status reveal show">
          Reviews file not found. Add it to <code>/public/data/reviews.xlsx</code>.
        </div>
      )}

      {status === 'ready' && (
        <>
          {reviews.length === 0 ? (
            <div className="testimonials-status reveal show">No valid reviews found in the Excel file.</div>
          ) : (
            <div className="testimonials-carousel-wrap reveal show">
              <div
                className="testimonials-carousel"
                ref={viewportRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                  if (!isDragging) setIsPaused(false);
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={finishDrag}
                onPointerLeave={finishDrag}
              >
                <div
                  className="testimonials-track"
                  style={{
                    gap: `${CAROUSEL_GAP}px`,
                    transform: `translate3d(${Number.isFinite(trackTranslate) ? trackTranslate : 0}px, 0, 0)`,
                    transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  {reviews.map((review) => (
                    <article
                      key={review.id}
                      className={`testimonial-card social-proof-card platform-${review.platform} proof-variant-${review.variant || 0} ${
                        review.type === 'image' ? 'is-image-review' : 'is-message-review'
                      }`}
                      style={{
                        width: cardWidth ? `${cardWidth}px` : undefined,
                        minWidth: cardWidth ? `${cardWidth}px` : undefined,
                      }}
                    >
                      <div className="social-proof-topbar">
                        <span className="social-proof-mark">{platformMark[review.platform] || 'CH'}</span>
                        <div>
                          <p className="testimonial-student">{review.studentName}</p>
                          <p className="testimonial-course">{review.label || review.courseLabel}</p>
                        </div>
                      </div>

                      {review.type === 'image' && review.image ? (
                        <figure className="testimonial-screenshot">
                          <img src={review.image} alt={review.label || 'Student review screenshot'} loading="lazy" />
                        </figure>
                      ) : (
                        <div className="message-bubble-shell">
                          <p className="testimonial-text" dir="auto">{review.text}</p>
                        </div>
                      )}

                      <div className="testimonial-meta">
                        <p className="testimonial-date">{review.date}</p>
                        <p className="testimonial-rating" aria-label={`Rating ${review.rating} out of 5`}>
                          {'★'.repeat(review.rating)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {reviews.length > visibleCount && (
                <div className="testimonials-nav">
                  <button type="button" className="testimonials-arrow" onClick={handlePrev} aria-label="Previous reviews">
                    {'<'}
                  </button>
                  <div className="testimonials-counter">
                    {safeActiveIndex + 1} / {maxIndex + 1}
                  </div>
                  <button type="button" className="testimonials-arrow" onClick={handleNext} aria-label="Next reviews">
                    {'>'}
                  </button>
                </div>
              )}

              {showDots && reviews.length > visibleCount && (
                <div className="testimonials-dots">
                  {dotIndices.map((dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={`testimonials-dot ${dotIndex === safeActiveIndex ? 'is-active' : ''}`}
                      onClick={() => setActiveIndex(dotIndex)}
                      aria-label={`Go to review set ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="review-form-wrap reveal">
        <h3>Share Your Review</h3>
        <p>لو حابب تضيف رأيك، اكتبه هنا وهيوصلنا مباشرة.</p>
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <label>
            Your Name (optional)
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleReviewChange}
              placeholder="Cre8ors Hub Student"
            />
          </label>

          <label>
            Track
            <select name="track" value={newReview.track} onChange={handleReviewChange}>
              <option value="">General Feedback</option>
              <option value="Video Editing">Video Editing</option>
              <option value="Motion Graphics">Motion Graphics</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="AI Video Making">AI Video Making</option>
            </select>
          </label>

          <label>
            Your Review
            <textarea
              name="message"
              rows="4"
              value={newReview.message}
              onChange={handleReviewChange}
              placeholder="اكتب رأيك هنا..."
              required
            />
          </label>

          <button type="submit" className="btn btn-primary">
            Send Review
          </button>
        </form>
      </div>
    </section>
  );
}

export default Testimonials;
