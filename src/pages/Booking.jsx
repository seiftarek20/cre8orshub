import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courses } from '../data/courses.js';
import { createBookingRequest } from '../services/bookingService.js';

const whatsappNumber = '201002316651';

function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedCourse = searchParams.get('course') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: preselectedCourse,
    level: '',
    learningMode: '',
    preferredContactTime: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Booking | Cre8ors Hub';
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === formData.course)?.title || formData.course || '-',
    [formData.course]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildWhatsappUrl = () => {
    const selectedLearningMode =
      learningModeOptions.find((mode) => mode.value === formData.learningMode)?.labelEn ||
      formData.learningMode;

    const message = [
      'New Creative Consultation - Cre8ors Hub',
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Course: ${selectedCourse}`,
      `Current Level: ${formData.level}`,
      `Learning Mode: ${selectedLearningMode}`,
      `Preferred Contact Time: ${formData.preferredContactTime || '-'}`,
      `Message: ${formData.message || '-'}`,
    ].join('\n');

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.course || !formData.learningMode) {
      setErrorMessage('Please complete the required booking details.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createBookingRequest({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        course_slug: formData.course,
        preferred_mode: formData.learningMode,
        message: [
          formData.level ? `Level: ${formData.level}` : '',
          formData.preferredContactTime ? `Preferred contact time: ${formData.preferredContactTime}` : '',
          formData.message,
        ].filter(Boolean).join('\n'),
      });

      setSuccessMessage('Your booking request was sent. We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: preselectedCourse,
        level: '',
        learningMode: '',
        preferredContactTime: '',
        message: '',
      });
    } catch (error) {
      setErrorMessage('Could not save the booking request. Opening WhatsApp as a fallback.');
      window.open(buildWhatsappUrl(), '_blank', 'noopener,noreferrer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const learningModeOptions = [
    {
      value: 'online-live',
      labelAr: 'أونلاين لايف',
      labelEn: 'Online Live',
    },
    {
      value: 'online-recorded',
      labelAr: 'أونلاين فيديوهات مسجلة',
      labelEn: 'Online Recorded',
    },
    {
      value: 'offline-dokki-cairo-egypt',
      labelAr: 'أوفلاين - الدقي، القاهرة، مصر',
      labelEn: 'Offline - Dokki, Cairo, Egypt',
    },
  ];

  return (
    <section className="section-block page-top">
      <div className="section-heading reveal">
        <p className="eyebrow">Start Here</p>
        <h1>Start Your Creative Journey</h1>
        <p>ابعتلنا بياناتك، ونرشحلك أنسب مسار تبدأ منه.</p>
      </div>

      <form className="booking-form reveal" onSubmit={handleSubmit}>
        <div className="booking-mode-intro">
          <h2>Choose How You Want to Learn</h2>
          <p>اختار الطريقة الأنسب ليك: لايف، مسجل، أو حضور في المكان.</p>
        </div>

        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Course
          <select name="course" value={formData.course} onChange={handleChange} required>
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Learning Mode
          <select
            name="learningMode"
            value={formData.learningMode}
            onChange={handleChange}
            required
          >
            <option value="">اختر طريقة التعلم</option>
            {learningModeOptions.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.labelAr}
              </option>
            ))}
          </select>
        </label>

        <label>
          Current level
          <select name="level" value={formData.level} onChange={handleChange} required>
            <option value="">Select your level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label>
          Preferred Contact Time
          <select
            name="preferredContactTime"
            value={formData.preferredContactTime}
            onChange={handleChange}
            required
          >
            <option value="">Select preferred time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Anytime">Anytime</option>
          </select>
        </label>

        <label>
          Extra message
          <textarea
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any details you want to add..."
          />
        </label>

        {successMessage ? <p className="auth-message is-success">{successMessage}</p> : null}
        {errorMessage ? <p className="auth-message is-error">{errorMessage}</p> : null}
        {isSubmitting ? <p className="auth-message">Sending your booking request...</p> : null}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          احجز استشارة
        </button>
      </form>
    </section>
  );
}

export default Booking;
