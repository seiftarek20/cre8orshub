function AppCard({ eyebrow, title, children, className = '' }) {
  return (
    <article className={`app-card reveal ${className}`}>
      {(eyebrow || title) && (
        <header className="app-card-header">
          {eyebrow ? <p className="app-card-eyebrow">{eyebrow}</p> : null}
          {title ? <h2>{title}</h2> : null}
        </header>
      )}
      {children}
    </article>
  );
}

export default AppCard;
