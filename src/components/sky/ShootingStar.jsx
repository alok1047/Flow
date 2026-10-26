import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ShootingStar.css';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createShootingStar() {
  const startX = randomBetween(10, 80); // vw %
  const startY = randomBetween(2, 35);  // vh % — top portion
  const angle = randomBetween(25, 50);  // degrees
  const distance = randomBetween(250, 450); // px travel

  return {
    id: Date.now() + Math.random(),
    startX,
    startY,
    angle,
    distance,
    duration: randomBetween(0.6, 1.2),
  };
}

function Star({ star, onComplete }) {
  const radians = (star.angle * Math.PI) / 180;
  const dx = Math.cos(radians) * star.distance;
  const dy = Math.sin(radians) * star.distance;

  return (
    <motion.div
      className="shooting-star"
      style={{
        left: `${star.startX}%`,
        top: `${star.startY}%`,
        rotate: `${star.angle}deg`,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: dx,
        y: dy,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: star.duration,
        ease: 'easeIn',
        opacity: {
          times: [0, 0.05, 0.7, 1],
          duration: star.duration,
        },
      }}
      onAnimationComplete={onComplete}
    />
  );
}

export default function ShootingStar() {
  const [stars, setStars] = useState([]);

  const spawnStar = useCallback(() => {
    setStars((prev) => [...prev, createShootingStar()]);
  }, []);

  const removeStar = useCallback((id) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
  }, []);

  useEffect(() => {
    let timeoutId;

    function scheduleNext() {
      const delay = randomBetween(4000, 8000);
      timeoutId = setTimeout(() => {
        spawnStar();
        scheduleNext();
      }, delay);
    }

    // Fire the first one after a short initial delay
    timeoutId = setTimeout(() => {
      spawnStar();
      scheduleNext();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [spawnStar]);

  return (
    <div className="shooting-star-container" aria-hidden="true">
      <AnimatePresence>
        {stars.map((star) => (
          <Star
            key={star.id}
            star={star}
            onComplete={() => removeStar(star.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
