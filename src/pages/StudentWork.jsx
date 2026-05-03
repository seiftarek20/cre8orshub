import { Link } from 'react-router-dom';

function StudentWork() {
  return (
    <div className="section-block page-top">
      <div className="section-heading reveal">
        <p className="eyebrow">Student work</p>
        <h1>Gallery coming together.</h1>
        <p>
          We’re curating featured pieces from Cre8ors Hub creators. Check back soon—or start building your
          own reel with a course track.
        </p>
      </div>
      <div className="he-student-cta reveal">
        <Link className="btn btn-primary" to="/courses">
          Explore courses
        </Link>
        <Link className="btn btn-outline" to="/booking">
          Book a call
        </Link>
      </div>
    </div>
  );
}

export default StudentWork;
