import { useEffect, useRef } from 'react';

/** Drifting dots + soft links; ocean palette. Respects prefers-reduced-motion. */
function MotionParticles() {
  const canvasRef = useRef(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = mqReduce.matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let particles = [];
    let links = true;
    let t0 = 0;

    const navy = { r: 9, g: 60, b: 93 };
    const tq = { r: 111, g: 209, b: 215 };
    const mint = { r: 93, g: 248, b: 216 };
    const blue = { r: 59, g: 117, b: 151 };

    function pickColor(i) {
      const palette = [tq, mint, blue, navy];
      return palette[i % palette.length];
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = Math.max(window.innerHeight, document.documentElement.scrollHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      const base = Math.min(88, Math.floor(Math.sqrt(area) / 10));
      const n = reducedRef.current ? Math.min(36, Math.max(24, Math.floor(base * 0.28))) : base;
      links = n > 24 && !reducedRef.current;
      particles = [];
      for (let i = 0; i < n; i++) {
        const c = pickColor(i);
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * (reducedRef.current ? 0 : 0.4),
          vy: (Math.random() - 0.5) * (reducedRef.current ? 0 : 0.4),
          r: 0.6 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          c,
        });
      }
    }

    function step(ts) {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;

      ctx.clearRect(0, 0, w, h);

      if (!particles.length) {
        raf = requestAnimationFrame(step);
        return;
      }

      if (!reducedRef.current) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }
      }

      if (links && !reducedRef.current) {
        const maxDist = Math.min(118, w / 8);
        const maxDistSq = maxDist * maxDist;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < maxDistSq) {
              const d = Math.sqrt(d2);
              const alpha = (1 - d / maxDist) * 0.12;
              ctx.strokeStyle = `rgba(111, 209, 215, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = 0.55 + 0.45 * Math.sin(elapsed * 0.85 + p.phase);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c.r}, ${p.c.g}, ${p.c.b}, ${0.12 + 0.22 * pulse})`;
        ctx.arc(p.x, p.y, p.r * (0.88 + 0.2 * pulse), 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const onReduce = () => {
      reducedRef.current = mqReduce.matches;
      resize();
    };
    mqReduce.addEventListener('change', onReduce);

    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mqReduce.removeEventListener('change', onReduce);
    };
  }, []);

  return <canvas className="bg-particles" ref={canvasRef} aria-hidden />;
}

export default MotionParticles;
