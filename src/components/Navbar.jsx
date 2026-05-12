import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/#home" className="brand">
        Cre8ors Hub
      </Link>
      <nav className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <Link to="/#courses">Courses</Link>
        <Link to="/#roadmap">Roadmap</Link>
        <Link to="/#booking">Booking</Link>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
