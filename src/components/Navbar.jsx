import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { isAuthenticated, isLoading, logout, profile } = useAuth();

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
        {!isLoading && isAuthenticated ? (
          <>
            <NavLink to="/profile">{profile?.full_name || 'Profile'}</NavLink>
            <button className="nav-auth-button" type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
