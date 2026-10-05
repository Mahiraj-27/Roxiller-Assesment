import React, { useEffect, useRef } from 'react';

// Palette matching RateSphere's refined theme: Deep Slate, Amber Star Gold, Slate Blue & Soft Emerald
const THEME_COLORS = [
  'rgba(15, 23, 42, ',    // Deep Slate (Theme Primary)
  'rgba(245, 158, 11, ',  // Star Amber / Gold (Rating Accent)
  'rgba(71, 85, 105, ',   // Elegant Slate Grey
  'rgba(5, 150, 105, ',   // Emerald Accent (Success / Metrics)
  'rgba(217, 119, 6, ',   // Warm Honey Amber
];

const CursorParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user's accessibility preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // Only enable on devices with fine pointer (mouse/trackpad), skip touch-only
    if ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles = [];
    const MAX_PARTICLES = 130;

    class Particle {
      constructor(x, y, isBurst = false) {
        this.x = x;
        this.y = y;
        this.isBurst = isBurst;

        const angle = Math.random() * Math.PI * 2;
        if (isBurst) {
          const speed = Math.random() * 4.5 + 2.0; // Quick initial explosion
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.friction = 0.94; // Deceleration for fireworks/crackle feel
          this.gravity = 0.06;
          this.size = Math.random() * 3.5 + 1.2;
          this.decay = Math.random() * 0.024 + 0.018;
        } else {
          const speed = Math.random() * 1.2 + 0.3; // Gentle trail drift
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed - 0.35; // Gentle upward lift
          this.friction = 0.98;
          this.gravity = 0;
          this.size = Math.random() * 2.8 + 1.0;
          this.decay = Math.random() * 0.02 + 0.015;
        }

        this.alpha = 1.0;
        this.colorPrefix = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
      }

      update() {
        this.vx *= this.friction;
        this.vy = this.vy * this.friction + this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.size *= 0.965;
        this.alpha -= this.decay;
      }

      draw(c) {
        if (this.alpha <= 0) return;
        c.save();
        c.beginPath();
        c.arc(this.x, this.y, Math.max(this.size, 0.4), 0, Math.PI * 2);
        c.fillStyle = `${this.colorPrefix}${Math.max(this.alpha * 0.75, 0)})`;
        if (this.isBurst) {
          c.shadowBlur = 6;
          c.shadowColor = `${this.colorPrefix}0.6)`;
        }
        c.fill();
        c.restore();
      }
    }

    let lastSpawn = 0;
    const handleMouseMove = (e) => {
      const now = performance.now();
      // Throttle trail spawn to 22ms (~45fps spawn rate) for smooth performance
      if (now - lastSpawn < 22) return;
      lastSpawn = now;

      if (particles.length < MAX_PARTICLES) {
        particles.push(new Particle(e.clientX, e.clientY, false));
      }
    };

    const handleClick = (e) => {
      // Create a short crack/burst explosion of 22 particles scattering outward
      const burstCount = 22;
      for (let i = 0; i < burstCount; i++) {
        if (particles.length < MAX_PARTICLES + 30) {
          particles.push(new Particle(e.clientX, e.clientY, true));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0 || p.size <= 0.3) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
};

export default CursorParticles;
