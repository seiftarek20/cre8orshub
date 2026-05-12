import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <article className="course-card reveal">
      <div className="course-card-cover">
        {course.coverImage ? <img src={course.coverImage} alt="" loading="lazy" /> : null}
        <span className="course-cover-sheen" aria-hidden="true" />
      </div>
      <div className="course-card-content">
        <div className="course-card-heading">
          <p className="card-subtle">{course.arabicTitle}</p>
          <h3>{course.title}</h3>
        </div>
        <p className="course-card-copy">{course.subtitle}</p>
        <div className="course-meta">
          <span>{course.duration}</span>
          <span>{course.level}</span>
        </div>
        <Link className="btn btn-outline" to={`/courses/${course.id}`}>
          Explore The Course
        </Link>
      </div>
    </article>
  );
}

export default CourseCard;
