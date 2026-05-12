import { NavLink } from 'react-router-dom';

const appNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-courses', label: 'My Courses' },
  { to: '/projects', label: 'Projects' },
  { to: '/progress', label: 'Progress' },
];

function AppLayout({ eyebrow, title, description, children, action }) {
  return (
    <section className="app-page section-block page-top">
      <div className="app-layout">
        <aside className="app-sidebar reveal" aria-label="Student workspace navigation">
          <div className="app-sidebar-mark">
            <span>CH</span>
          </div>
          <nav className="app-sidebar-nav">
            {appNavItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="app-content">
          <header className="app-header reveal">
            <div>
              {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
              <h1>{title}</h1>
              {description ? <p>{description}</p> : null}
            </div>
            {action ? <div className="app-header-action">{action}</div> : null}
          </header>

          <div className="app-mobile-nav reveal" aria-label="Student workspace navigation">
            {appNavItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}

export default AppLayout;
