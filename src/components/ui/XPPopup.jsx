import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './XPPopup.css';

const XPPopup = ({ amount, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate sparkle positions once
  const sparkles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 40,
        delay: Math.random() * 0.3,
        scale: 0.5 + Math.random() * 1,
      })),
    []
  );

  return (
    <AnimatePresence>
      <motion.div
        className="xp-popup"
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.6 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.span
          className="xp-popup__text"
          animate={{ y: -30, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        >
          +{amount} XP

          {sparkles.map((s) => (
            <motion.span
              key={s.id}
              className="xp-popup__sparkle"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: s.x,
                y: s.y - 20,
                scale: [0, s.scale, 0],
              }}
              transition={{
                duration: 0.8,
                delay: s.delay,
                ease: 'easeOut',
              }}
              style={{ left: '50%', top: '50%' }}
            />
          ))}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
};

export default XPPopup;
