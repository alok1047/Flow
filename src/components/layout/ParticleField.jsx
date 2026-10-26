import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import './ParticleField.css';

const PARTICLE_COUNT = 30;

const COLORS = [
  'rgba(255, 255, 255, 0.15)',
  'rgba(255, 255, 255, 0.2)',
  'rgba(102, 126, 234, 0.2)',
  'rgba(102, 126, 234, 0.15)',
  'rgba(118, 75, 162, 0.2)',
  'rgba(118, 75, 162, 0.15)',
];

const ParticleField = () => {
  const showParticles = useStore((s) => s.showParticles);

  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,        // % from left
        y: Math.random() * 100,         // % from top (start position)
        size: 2 + Math.random() * 2,    // 2-4px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 12 + Math.random() * 18, // 12-30s
        delay: Math.random() * -20,      // stagger start
        driftX: (Math.random() - 0.5) * 60, // sideways drift in px
      })),
    []
  );

  if (!showParticles) return null;

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle-field__dot"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{
            y: [0, -window.innerHeight],
            x: [0, p.driftX],
            opacity: [0, 0.3, 0.2, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
