import { useRef, useEffect, useCallback } from 'react';
import './StarField.css';

const STAR_COUNT = 400;
const TWINKLE_SPEED = 0.008;

function createStars(width, height) {
  const stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const hue = Math.random() > 0.7 ? 220 + Math.random() * 30 : 0; // some blue-ish
    const saturation = hue > 0 ? 40 + Math.random() * 40 : 0;
    const lightness = 85 + Math.random() * 15;
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.5 + Math.random() * 2,
      baseOpacity: 0.2 + Math.random() * 0.8,
      opacity: 0.2 + Math.random() * 0.8,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleRate: 0.002 + Math.random() * TWINKLE_SPEED,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    });
  }
  return stars;
}

export default function StarField() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animFrameRef = useRef(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    dimensionsRef.current = { width, height };

    // Regenerate stars on resize so they fill the new dimensions
    starsRef.current = createStars(width, height);
  }, []);

  useEffect(() => {
    resizeCanvas();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let running = true;

    function animate() {
      if (!running) return;

      const { width, height } = dimensionsRef.current;
      ctx.clearRect(0, 0, width, height);

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        // Advance twinkle phase
        star.twinklePhase += star.twinkleRate;
        star.opacity =
          star.baseOpacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  return (
    <div className="star-field" aria-hidden="true">
      <canvas ref={canvasRef} className="star-field__canvas" />
    </div>
  );
}
