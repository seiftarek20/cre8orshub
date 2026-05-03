import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <article className="course-card reveal">
      <div
        className="course-card-cover"
        style={
          course.coverImage
            ? { backgroundImage: `linear-gradient(120deg, rgba(9, 60, 93, 0.65), rgba(5, 20, 32, 0.25)), url(${course.coverImage})` }
            : undefined
        }
      />
      <div className="course-card-content">
        <p className="card-subtle">{course.arabicTitle}</p>
        <h3>{course.title}</h3>
        <p>{course.subtitle}</p>
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
