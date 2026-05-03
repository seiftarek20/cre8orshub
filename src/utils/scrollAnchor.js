function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scroll to an element by id (without leading #).
 * Returns true if the element was found.
 */
export function scrollToSectionById(id) {
  if (!id || typeof document === 'undefined') return false;
  const clean = id.startsWith('#') ? id.slice(1) : id;
  const el = document.getElementById(clean);
  if (!el) return false;
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  return true;
}
