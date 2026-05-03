import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollRevealManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    const observeAllRevealElements = () => {
      const elements = Array.from(document.querySelectorAll('.reveal'));
      elements.forEach((element) => observer.observe(element));
    };

    observeAllRevealElements();

    const mutationObserver = new MutationObserver(() => {
      observeAllRevealElements();
    });

    mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return null;
}

export default ScrollRevealManager;
