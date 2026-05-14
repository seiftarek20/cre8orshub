import { useEffect } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { courses } from '../data/courses.js';

function Courses() {
  useEffect(() => {
    document.title = 'Courses | Cre8ors Hub';
  }, []);

  return (
    <section className="section-block page-top">
      <div className="section-heading reveal">
        <p className="eyebrow">Creative Tracks</p>
        <h1>Choose Your Creative Track</h1>
        <p>مش بتتعلم Tool... بتتعلم Taste.</p>
      </div>
      <div className="courses-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

export default Courses;
