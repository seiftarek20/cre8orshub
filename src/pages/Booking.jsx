import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courses } from '../data/courses.js';

const whatsappNumber = '201002316651';

function Booking() {
  const [searchParams] = useSearchParams();
  const preselectedCourse = searchParams.get('course') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    course: preselectedCourse,
    level: '',
    learningMode: '',
    preferredContactTime: '',
    message: '',
  });

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === formData.course)?.title || formData.course || '-',
    [formData.course]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedLearningMode =
      learningModeOptions.find((mode) => mode.value === formData.learningMode)?.labelEn ||
      formData.learningMode;

    const message = [
      'New Creative Consultation - Cre8ors Hub',
      `Name: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Course: ${selectedCourse}`,
      `Current Level: ${formData.level}`,
      `Learning Mode: ${selectedLearningMode}`,
      `Preferred Contact Time: ${formData.preferredContactTime || '-'}`,
      `Message: ${formData.message || '-'}`,
    ].join('\n');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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

        <button className="btn btn-primary" type="submit">
          احجز استشارة
        </button>
      </form>
    </section>
  );
}

export default Booking;
